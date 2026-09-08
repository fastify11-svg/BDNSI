import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const URL = "https://srv2124-files.hstgr.io/rest/167879e97a1d2599/api/tus/public_html";
const AUTH_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9VUyIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTg4MTM5NzM1OSIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc4ODU5ODI2OCwiaWF0IjoxNzg4NTc2NjY4fQ.lAQAkpJ63rLwuvCCo_vC-g8eswTm8KCMSxUoJVYkOmU";
const REST_AUTH_KEY = "a384e639c2d1f502c3742db7a8fe4791b1b0dc4902e79f7bc169abc6c9fa1c93-167879e97a1d2599";

async function uploadFile(filePath, destPath) {
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
        console.error(`Skipping ${filePath} (not found or directory)`);
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
        const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks
        for (let offset = 0; offset < size; offset += CHUNK_SIZE) {
            const end = Math.min(offset + CHUNK_SIZE, size);
            const chunk = fileData.subarray(offset, end);
            
            const patchHeaders = {
                'X-Auth': AUTH_KEY,
                'X-Auth-Rest': REST_AUTH_KEY,
                'Tus-Resumable': '1.0.0',
                'Content-Type': 'application/offset+octet-stream',
                'Upload-Offset': offset.toString()
            };

            const patchRes = await fetch(createUrl, { method: 'PATCH', headers: patchHeaders, body: chunk });
            if (!patchRes.ok) {
                 console.error(await patchRes.text());
                 return;
            }
        }
        console.log(`Successfully uploaded: ${destPath}`);
    } catch (e) {
        console.error(e);
    }
}

async function run() {
    const statusOutput = execSync('git diff --name-only HEAD~1 HEAD', { encoding: 'utf-8' });
    const lines = statusOutput.split('\n');
    for (const line of lines) {
        if (!line.trim()) continue;
        const file = line.trim();
        
        // Exclude test data, temp files, etc.
        if (file.includes('mysql_test_data') || 
            file.includes('scratch') || 
            file.includes('deploy.zip') || 
            file.includes('temp') ||
            file.includes('.txt') ||
            file.includes('.mjs') ||
            file.includes('.cjs') ||
            file.includes('.ps1') ||
            file.includes('FINAL_AI_SUPERVISOR')) {
            continue;
        }

        // Only handle Modified, Added (tracked files from diff)
        if (true) {
            const fullPath = path.join('C:\\BDNSI', file);
            if (fs.existsSync(fullPath)) {
                if (fs.statSync(fullPath).isDirectory()) {
                    // For untracked directories, upload all files inside
                    const dirFiles = execSync(`dir /s /b /a-d "${fullPath}"`, { encoding: 'utf-8' });
                    const fileLines = dirFiles.replace(/\r/g, '').split('\n').filter(Boolean);
                    for (const f of fileLines) {
                        const relativePath = f.substring('C:\\BDNSI\\'.length).replace(/\\\\/g, '/');
                        await uploadFile(f, relativePath);
                    }
                } else {
                    await uploadFile(fullPath, file.replace(/\\\\/g, '/'));
                }
            }
        }
    }
}

run();
