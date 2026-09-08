import fs from 'fs';

const URL = "https://srv2124-files.hstgr.io/rest/a91f40422b969ada/api/tus/public_html";
const AUTH_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9VUyIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTg4MTM5NzM1OSIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc4ODUwMTYyOSwiaWF0IjoxNzg4NDgwMDI5fQ.1eKN8YBk2ardcyJz9xf2ULy1ysE8fBDcZc5RYEiHrBE";
const REST_AUTH_KEY = "44230b335ddd9f61f07ebc16a4c6447779b279ae66ed6ee3c9b7cabc5c37211c-a91f40422b969ada";

async function uploadFile(filePath, destPath) {
    const stats = fs.statSync(filePath);
    const size = stats.size;
    const createUrl = `${URL}/${encodeURIComponent(destPath)}?override=true`;
    const createHeaders = {
        'X-Auth': AUTH_KEY,
        'X-Auth-Rest': REST_AUTH_KEY,
        'Tus-Resumable': '1.0.0',
        'Upload-Length': size.toString(),
        'Upload-Offset': '0'
    };
    await fetch(createUrl, { method: 'POST', headers: createHeaders });
    const fileData = fs.readFileSync(filePath);
    const patchHeaders = {
        'X-Auth': AUTH_KEY,
        'X-Auth-Rest': REST_AUTH_KEY,
        'Tus-Resumable': '1.0.0',
        'Content-Type': 'application/offset+octet-stream',
        'Upload-Offset': '0'
    };
    await fetch(createUrl, { method: 'PATCH', headers: patchHeaders, body: fileData });
}

uploadFile('C:\\BDNSI\\scratch_forensic_leads.php', 'public/scratch_forensic_leads.php').catch(console.error);
