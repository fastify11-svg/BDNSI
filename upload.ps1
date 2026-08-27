$ErrorActionPreference = "Stop"

$FILE = "deploy.tar.gz"
$SIZE = (Get-Item $FILE).Length
$URL = "https://srv2124-files.hstgr.io/rest/fbba514fb1fda831/api/tus/public_html"
$AUTH_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9VUyIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTg4MTM5NzM1OSIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc4Nzc0MzY3OCwiaWF0IjoxNzg3NzIyMDc4fQ.dto_rFCya2TFxYu5g1Mwk_Nx_76HeEWxBa_wbp588W8"
$REST_AUTH_KEY = "762f9efbef085ebb3a41c2b1ff6c54a4c373b7a2bf17df35386ecfbfedf7d032-fbba514fb1fda831"

Write-Host "Creating upload tunnel for $FILE ($SIZE bytes)..."

$postResult = curl.exe -i -s -X POST "$URL/$($FILE)?override=true" -H "X-Auth: $AUTH_KEY" -H "X-Auth-Rest: $REST_AUTH_KEY" -H "Tus-Resumable: 1.0.0" -H "Upload-Length: $SIZE" -H "Upload-Offset: 0"

Write-Host $postResult

Write-Host "Uploading file bytes..."

$patchResult = curl.exe -i -s -X PATCH "$URL/$($FILE)?override=true" -H "X-Auth: $AUTH_KEY" -H "X-Auth-Rest: $REST_AUTH_KEY" -H "Tus-Resumable: 1.0.0" -H "Content-Type: application/offset+octet-stream" -H "Upload-Offset: 0" --data-binary "@$FILE"

Write-Host $patchResult
Write-Host "Done!"
