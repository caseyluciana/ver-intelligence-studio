import re, sys
content = open('C:/Users/ccandelaria/vibeship-apps/tco-standalone/index.html', encoding='utf-8').read()
lines = content.split('\n')

scripts = []
in_script = False
script_lines = []
for line in lines:
    stripped = line.strip()
    if '<script>' in stripped and 'src=' not in stripped:
        in_script = True
        script_lines = []
        continue
    if '</script>' in stripped and in_script:
        in_script = False
        scripts.append('\n'.join(script_lines))
        script_lines = []
        continue
    if in_script:
        script_lines.append(line)

for i, s in enumerate(scripts):
    first = s.strip()[:80].encode('ascii', 'replace').decode('ascii')
    print(f"Block {i+1}: {len(s)} chars, starts: {first}")
