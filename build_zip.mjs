import fs from 'fs';
import { execSync } from 'child_process';
import archiver from 'archiver';

console.log("Getting git files...");
const gitFilesStr = execSync('git ls-files', { encoding: 'utf-8' });
const gitFiles = gitFilesStr.replace(/\r/g, '').split('\n').filter(Boolean);

console.log("Getting build files...");
let buildFiles = [];
try {
  const buildOutput = execSync('dir /s /b public\\build', { encoding: 'utf-8' });
  const basePath = process.cwd().length + 1;
  buildFiles = buildOutput.replace(/\r/g, '').split('\n').filter(Boolean).map(f => {
    return f.substring(basePath).replace(/\\/g, '/');
  });
} catch(e) {}

let vendorFiles = [];
try {
  const vendorOutput = execSync('dir /s /b vendor', { encoding: 'utf-8' });
  const basePath = process.cwd().length + 1;
  vendorFiles = vendorOutput.replace(/\r/g, '').split('\n').filter(Boolean).map(f => {
    return f.substring(basePath).replace(/\\/g, '/');
  });
} catch(e) {}

const allFiles = [...gitFiles, ...buildFiles, ...vendorFiles];
// Filter out files that don't exist (like deleted git files)
const validFiles = allFiles.filter(f => {
  if (f.includes('node_modules/') || f.includes('.agents/') || f.includes('storage/framework/')) return false;
  try {
    return fs.existsSync(f) && fs.statSync(f).isFile();
  } catch (e) {
    return false;
  }
});

console.log(`Total valid files: ${validFiles.length}`);

console.log("Creating deploy.zip...");
const output = fs.createWriteStream('deploy.zip');
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', function() {
  console.log(archive.pointer() + ' total bytes written to deploy.zip');
});

archive.on('error', function(err) {
  throw err;
});

archive.pipe(output);

validFiles.forEach(file => {
    archive.file(file, { name: file });
});

archive.finalize();
