import fs from 'fs';

const URL = "https://srv2124-files.hstgr.io/rest/bda12edd27bb2874/api/tus/public_html";
const AUTH_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9VUyIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTg4MTM5NzM1OSIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc4ODYzNTU2NCwiaWF0IjoxNzg4NjEzOTY0fQ.J1wi4YdYBENQnMhlsEt-8_odwlNRT2BF6-cLeaSLY7c";
const REST_AUTH_KEY = "9bb3be1e20d0cfeb82bed4d6126f8d4c07bce5bad27c9bafe3c86af692a33228-bda12edd27bb2874";

async function uploadFile(filePath, destPath) {
    if (!fs.existsSync(filePath)) {
        console.error(`Skipping ${filePath} (not found)`);
        return;
    }
    
    const stats = fs.statSync(filePath);
    const size = stats.size;
    console.log(`Uploading ${filePath} to ${destPath} (${size} bytes)...`);

    const createUrl = `${URL}/${encodeURIComponent(destPath)}?override=true`;
    const createHeaders = {
        'X-Auth': AUTH_KEY,
        'X-Auth-Rest': REST_AUTH_KEY,
        'Tus-Resumable': '1.0.0',
        'Upload-Length': size.toString(),
        'Upload-Offset': '0'
    };

    try {
        const createRes = await fetch(createUrl, { method: 'POST', headers: createHeaders });
        if (!createRes.ok) return console.error(await createRes.text());

        const fileData = fs.readFileSync(filePath);
        
        const patchHeaders = {
            'X-Auth': AUTH_KEY,
            'X-Auth-Rest': REST_AUTH_KEY,
            'Tus-Resumable': '1.0.0',
            'Content-Type': 'application/offset+octet-stream',
            'Upload-Offset': '0'
        };

        const patchRes = await fetch(createUrl, { method: 'PATCH', headers: patchHeaders, body: fileData });
        if (!patchRes.ok) {
             console.error(await patchRes.text());
             return;
        }
        
        console.log(`Successfully uploaded: ${destPath}`);
    } catch (e) {
        console.error(e);
    }
}

uploadFile('C:\\BDNSI\\scratch_phase_n_evidence.php', 'public/phase_n_evidence.php');
