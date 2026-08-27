const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');

const zip = new AdmZip();

function addDir(dirPath, zipPath) {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);

        const excludeDirs = ['node_modules', '.git', '.agents', 'storage/framework/cache/data', 'storage/framework/views', 'storage/framework/sessions', 'storage/logs', '.phpunit.cache'];
        
        if (stat.isDirectory()) {
            // Check if directory should be excluded
            let exclude = false;
            for (const exDir of excludeDirs) {
                if (file === exDir || fullPath.replace(/\\/g, '/').endsWith('/' + exDir)) {
                    exclude = true;
                    break;
                }
            }
            if (!exclude) {
                addDir(fullPath, zipPath ? `${zipPath}/${file}` : file);
            }
        } else {
            const excludeFiles = ['.env', 'validFiles.json', 'file_list.txt', 'file_list2.txt', 'build_tar.mjs', 'full_auto_deploy.mjs', 'fix_live_env.js', 'zip_it.cjs', 'zip_it.mjs', 'setup.log', 'playwright-output.log', 'zip_it.php'];
            if (excludeFiles.includes(file)) continue;
            if (file.startsWith('deploy') && (file.endsWith('.zip') || file.endsWith('.tar.gz'))) continue;
            if (file === 'latest_bdnsi_working_db.sql') continue;

            zip.addLocalFile(fullPath, zipPath);
        }
    }
}

console.log("Starting zip process...");
addDir(__dirname, '');
console.log("Writing to deploy3.zip...");
zip.writeZip('../deploy3.zip');
console.log("Zip complete!");
