$ErrorActionPreference = 'SilentlyContinue'
$out = 'C:\BDNSI\pc_audit_results.txt'

Write-Output '=== ENV VARS ===' > $out
Get-ChildItem Env: | Where-Object { $_.Name -match 'agentrouter|anyrouter|openai|codex|anthropic|supervisor' -or $_.Value -match 'agentrouter|anyrouter' } | Format-List Name, Value >> $out

Write-Output '=== USER PATH ===' >> $out
[Environment]::GetEnvironmentVariable('Path', 'User') >> $out

Write-Output '=== SYSTEM PATH ===' >> $out
[Environment]::GetEnvironmentVariable('Path', 'Machine') >> $out

Write-Output '=== POWERSHELL PROFILES ===' >> $out
Select-String -Path $PROFILE.AllUsersAllHosts, $PROFILE.AllUsersCurrentHost, $PROFILE.CurrentUserAllHosts, $PROFILE.CurrentUserCurrentHost -Pattern 'agentrouter|anyrouter|codex|supervisor' >> $out

Write-Output '=== SCHEDULED TASKS ===' >> $out
Get-ScheduledTask | Where-Object { $_.TaskName -match 'agentrouter|anyrouter|supervisor|bridge' -or $_.TaskPath -match 'agentrouter|anyrouter' } | Select-Object TaskName, State >> $out

Write-Output '=== SERVICES ===' >> $out
Get-Service | Where-Object { $_.Name -match 'agentrouter|anyrouter|supervisor' -or $_.DisplayName -match 'agentrouter|anyrouter|supervisor' } | Select-Object Name, Status >> $out

Write-Output '=== PROCESSES ===' >> $out
Get-CimInstance Win32_Process | Where-Object { $_.Name -match 'agentrouter|anyrouter' -or $_.CommandLine -match 'agentrouter|anyrouter|supervisor\.mjs|bridge-state' } | Select-Object ProcessId, Name, CommandLine >> $out

Write-Output '=== NPM GLOBAL ===' >> $out
npm list -g --depth=0 >> $out

Write-Output '=== NPM PROXY ===' >> $out
npm config get proxy >> $out
npm config get https-proxy >> $out

Write-Output '=== WINHTTP PROXY ===' >> $out
netsh winhttp show proxy >> $out

Write-Output '=== WININET PROXY ===' >> $out
Get-ItemProperty -Path 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Internet Settings' | Select-Object ProxyEnable, ProxyServer >> $out

Write-Output '=== HOSTS FILE ===' >> $out
Select-String -Path 'C:\Windows\System32\drivers\etc\hosts' -Pattern 'agentrouter|anyrouter' >> $out

Write-Output '=== REGISTRY (USER ENV) ===' >> $out
Get-ItemProperty -Path 'HKCU:\Environment' | fl >> $out

Write-Output '=== REGISTRY (MACHINE ENV) ===' >> $out
Get-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Session Manager\Environment' | fl >> $out

Write-Output '=== COMMAND RESOLUTION ===' >> $out
Get-Command codex -All -ErrorAction SilentlyContinue >> $out
Get-Command openai -All -ErrorAction SilentlyContinue >> $out

Write-Output '=== APPDATA SEARCH ===' >> $out
Get-ChildItem -Path $env:APPDATA, $env:LOCALAPPDATA -Recurse -Depth 3 -Directory -ErrorAction SilentlyContinue | Where-Object { $_.Name -match 'agentrouter|anyrouter|supervisor' } | Select-Object FullName >> $out

Write-Output '=== CONFIG FILES ===' >> $out
Get-ChildItem -Path $env:USERPROFILE -Filter '.*' -File | ForEach-Object {
    Select-String -Path $_.FullName -Pattern 'agentrouter|anyrouter|supervisor'
} >> $out
