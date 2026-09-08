$ErrorActionPreference = 'SilentlyContinue'
$out = 'C:\BDNSI\deep_search_results.txt'

Write-Output '=== HOSTS FILE ===' | Out-File -FilePath $out -Encoding utf8
Select-String -Path 'C:\Windows\System32\drivers\etc\hosts' -Pattern 'agentrouter|anyrouter' | Out-File -FilePath $out -Append -Encoding utf8

Write-Output '=== POWERSHELL PROFILES ===' | Out-File -FilePath $out -Append -Encoding utf8
Select-String -Path $PROFILE.AllUsersAllHosts, $PROFILE.AllUsersCurrentHost, $PROFILE.CurrentUserAllHosts, $PROFILE.CurrentUserCurrentHost -Pattern 'agentrouter|anyrouter' | Out-File -FilePath $out -Append -Encoding utf8

Write-Output '=== HOME DIR DOTFILES ===' | Out-File -FilePath $out -Append -Encoding utf8
Get-ChildItem -Path $env:USERPROFILE -Filter '.*' -File | ForEach-Object {
    Select-String -Path $_.FullName -Pattern 'agentrouter|anyrouter'
} | Out-File -FilePath $out -Append -Encoding utf8

Write-Output '=== APPDATA SEARCH ===' | Out-File -FilePath $out -Append -Encoding utf8
Get-ChildItem -Path $env:APPDATA, $env:LOCALAPPDATA -Recurse -Depth 3 -Directory -ErrorAction SilentlyContinue | Where-Object { $_.Name -match 'agentrouter|anyrouter' } | Select-Object FullName | Out-File -FilePath $out -Append -Encoding utf8
