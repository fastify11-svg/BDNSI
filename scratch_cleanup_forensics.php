<?php
$files = [
    'scratch_forensic_db.php',
    'scratch_forensic_backup.php',
    'scratch_forensic_migrations.php',
    'scratch_forensic_fk.php',
    'scratch_forensic_leads.php',
    'scratch_forensic_crm.php',
    'scratch_forensic_crm2.php',
    'scratch_forensic_routes.php',
    'scratch_forensic_files.php',
    'scratch_admin.php',
    'scratch_move_routes.php',
    'scratch_forensic_http.php',
    'scratch_forensic_commands.php',
    'scratch_cleanup_forensics.php'
];

foreach ($files as $file) {
    $path = __DIR__ . '/' . $file;
    if (file_exists($path)) {
        unlink($path);
        echo "Deleted $file\n";
    }
}
echo "Forensic cleanup complete.\n";
?>
