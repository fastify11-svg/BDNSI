$ErrorActionPreference = 'SilentlyContinue'

Write-Output '=== SYSTEM INFO ==='
[System.Environment]::OSVersion.VersionString
$env:USERNAME
$PSVersionTable.PSVersion.Major

Write-Output '=== POWERSHELL PROFILES ==='
$PROFILE.AllUsersAllHosts
$PROFILE.AllUsersCurrentHost
$PROFILE.CurrentUserAllHosts
$PROFILE.CurrentUserCurrentHost

Write-Output '=== USER PATH ==='
[Environment]::GetEnvironmentVariable('Path', 'User')

Write-Output '=== SYSTEM PATH ==='
[Environment]::GetEnvironmentVariable('Path', 'Machine')

Write-Output '=== ENV VARS ==='
Get-ChildItem Env: | Where-Object { $_.Name -match 'agentrouter|anyrouter|openai|codex|proxy|api' -or $_.Value -match 'agentrouter|anyrouter' } | Format-List Name, Value

Write-Output '=== NPM GLOBAL PACKAGES ==='
npm list -g --depth=0

Write-Output '=== NPM PROXY ==='
npm config get proxy
npm config get https-proxy

Write-Output '=== PROCESSES ==='
Get-CimInstance Win32_Process | Where-Object { $_.Name -match 'agentrouter|anyrouter' -or $_.CommandLine -match 'agentrouter|anyrouter' } | Select-Object ProcessId, Name, CommandLine

Write-Output '=== SERVICES ==='
Get-Service | Where-Object { $_.Name -match 'agentrouter|anyrouter' -or $_.DisplayName -match 'agentrouter|anyrouter' }

Write-Output '=== SCHEDULED TASKS ==='
Get-ScheduledTask | Where-Object { $_.TaskName -match 'agentrouter|anyrouter' -or $_.TaskPath -match 'agentrouter|anyrouter' }

Write-Output '=== WINHTTP PROXY ==='
netsh winhttp show proxy

Write-Output '=== WININET PROXY ==='
Get-ItemProperty -Path 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Internet Settings' | Select-Object ProxyEnable, ProxyServer

Write-Output '=== REGISTRY SEARCH (USER ENV) ==='
Get-ItemProperty -Path 'HKCU:\Environment' | fl

Write-Output '=== REGISTRY SEARCH (MACHINE ENV) ==='
Get-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Session Manager\Environment' | fl
