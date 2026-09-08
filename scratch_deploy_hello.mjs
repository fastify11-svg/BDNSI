import fs from 'fs';

const URL = "https://srv2124-files.hstgr.io/rest/a91f40422b969ada/api/tus/public_html";
const AUTH_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9VUyIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTg4MTM5NzM1OSIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc4ODUwMTYyOSwiaWF0IjoxNzg4NDgwMDI5fQ.1eKN8YBk2ardcyJz9xf2ULy1ysE8fBDcZc5RYEiHrBE";
const REST_AUTH_KEY = "44230b335ddd9f61f07ebc16a4c6447779b279ae66ed6ee3c9b7cabc5c37211c-a91f40422b969ada";

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
        if (!createRes.ok) {
            console.error(await createRes.text());
            return false;
        }

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
            return false;
        }
        
        console.log(`Successfully uploaded: ${destPath}`);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

async function run() {
    await uploadFile(`C:\\BDNSI\\scratch_hello.php`, 'public/scratch_hello.php');
}

run().catch(console.error);
