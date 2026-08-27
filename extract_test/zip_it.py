import os
import zipfile

def create_zip():
    zip_path = '../deploy3.zip'
    if os.path.exists(zip_path):
        os.remove(zip_path)

    # Note: Using set for O(1) lookups
    exclude_dirs = {
        'node_modules', '.git', '.agents', 
        r'storage\framework\cache\data', 
        r'storage\framework\views', 
        r'storage\framework\sessions', 
        r'storage\logs', '.phpunit.cache',
        r'storage\app\public',
        r'public\storage',
        r'public\storage_backup'
    }
    
    # We also need to normalize exclusions for comparison
    exclude_dirs_normalized = {d.replace('\\', '/') for d in exclude_dirs}

    exclude_files = {
        '.env', 'validFiles.json', 'file_list.txt', 'file_list2.txt',
        'build_tar.mjs', 'full_auto_deploy.mjs', 'fix_live_env.js', 
        'zip_it.cjs', 'zip_it.mjs', 'setup.log', 'playwright-output.log',
        'zip_it.php', 'zip_it.py'
    }

    print("Creating zip file...")
    count = 0
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED, compresslevel=1) as zipf:
        for root, dirs, files in os.walk('.'):
            # Check relative paths
            rel_root = os.path.relpath(root, '.').replace('\\', '/')
            if rel_root == '.':
                rel_root = ''
            
            # Remove excluded dirs from traversal
            new_dirs = []
            for d in dirs:
                full_d = f"{rel_root}/{d}" if rel_root else d
                # Check if this exact directory or its path is excluded
                if full_d in exclude_dirs_normalized or d in exclude_dirs_normalized:
                    continue
                new_dirs.append(d)
            dirs[:] = new_dirs

            for file in files:
                if file in exclude_files:
                    continue
                if file.startswith('deploy') and (file.endswith('.zip') or file.endswith('.tar.gz')):
                    continue
                if file == 'latest_bdnsi_working_db.sql':
                    continue

                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, '.')
                
                # Check if it's a symlink (like public/storage)
                if os.path.islink(file_path):
                    continue
                
                try:
                    zipf.write(file_path, arcname)
                    count += 1
                except Exception as e:
                    print(f"Error adding {file_path}: {e}")
                    
    print(f"Done! Added {count} files to {zip_path}.")

if __name__ == '__main__':
    create_zip()
