import json
with open(r'C:\Users\Naeem\.gemini\antigravity-ide\brain\3103808d-7f2a-43c6-b160-fbe248bec8da\.system_generated\logs\transcript.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        if data.get('type') == 'USER_INPUT' and 'LIVE-004' in data.get('content', ''):
            lines = data['content'].split('\n')
            for i, l in enumerate(lines):
                if 'LIVE-004' in l:
                    for j in range(max(0, i-2), min(len(lines), i+15)):
                        print(lines[j])
            break
