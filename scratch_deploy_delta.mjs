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

const filesToUpload = [
    'app/Http/Controllers/Admin/LeadController.php',
    'app/Models/Lead.php',
    'database/migrations/2026_09_04_053154_add_created_by_to_leads_table.php',
    'resources/js/Pages/Admin/Leads/Index.jsx',
    'tests/Feature/Admin/LeadManagementTest.php',
    'public/build/manifest.json',
    'public/build/assets/app-CcAzH8WX.css',
    'public/build/assets/app-DbgnMSbV.js'
];

async function run() {
    for (const f of filesToUpload) {
        await uploadFile(`C:\\BDNSI\\${f.replace(/\//g, '\\')}`, f);
    }
}

run().catch(console.error);
