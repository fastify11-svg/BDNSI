<?php
$lines = file('C:\Users\Naeem\.gemini\antigravity-ide\brain\3103808d-7f2a-43c6-b160-fbe248bec8da\.system_generated\logs\transcript_full.jsonl');
foreach ($lines as $line) {
    $data = json_decode($line, true);
    if ($data && isset($data['content'])) {
        $content = $data['content'];
        $pos = strpos($content, 'LIVE-002');
        if ($pos !== false && strpos($content, 'LIVE-004') !== false && $data['type'] === 'USER_INPUT') {
            echo "Found in type: " . $data['type'] . "\n";
            echo substr($content, $pos - 200, 1000);
            exit;
        }
    }
}
