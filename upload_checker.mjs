import fs from 'fs';

const URL = "https://srv2124-files.hstgr.io/rest/45fb3167f5e2d807/api/tus/public_html";
const AUTH_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9VUyIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTg4MTM5NzM1OSIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc4Nzg0NDA1NywiaWF0IjoxNzg3ODIyNDU3fQ.DcbQ82pSBQPdvjNW-jgyyN_8bACFLDtEUjQc7h2xk-Q";
const REST_AUTH_KEY = "3d5793cb2b8c7747624c369a1b9b71a422afd0d36c2a53059a649d2702a1d9c0-45fb3167f5e2d807";

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
        if (!patchRes.ok) return console.error(await patchRes.text());
        
        console.log(`Successfully uploaded: ${destPath}`);
    } catch (e) {
        console.error(e);
    }
}

uploadFile('C:\\BDNSI\\storage\\app\\run_checks.php', 'storage/app/run_checks.php');
