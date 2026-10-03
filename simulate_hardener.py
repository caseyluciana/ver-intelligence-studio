"""
Simulate what the Cloud Hosting hardener does to the staging file,
then syntax-check the resulting JS to find any parse errors.
"""
import re, subprocess

content = open('C:/Users/ccandelaria/vibeship-apps/tco-standalone/index.html', encoding='utf-8').read()

def simulate_hardener(html):
    # 1. Strip values of inline event handler attributes in HTML
    #    e.g. onclick="foo()" -> onclick=""
    html = re.sub(r'\bon\w+\s*=\s*"[^"]*"', lambda m: m.group().split('=')[0] + '=""', html)
    html = re.sub(r"\bon\w+\s*=\s*'[^']*'", lambda m: m.group().split('=')[0] + "=''", html)

    # 2. Strip non-ASCII characters from <script> blocks
    def strip_nonascii_from_scripts(html):
        result = []
        in_script = False
        for line in html.split('\n'):
            if '<script>' in line and 'src=' not in line:
                in_script = True
            if '</script>' in line:
                in_script = False
            if in_script:
                # Strip non-ASCII chars
                result.append(''.join(c if ord(c) < 128 else ' ' for c in line))
            else:
                result.append(line)
        return '\n'.join(result)

    html = strip_nonascii_from_scripts(html)
    return html

hardened = simulate_hardener(content)

print(f"Original: {len(content.encode('utf-8'))} bytes")
print(f"Hardened: {len(hardened.encode('utf-8'))} bytes")
print(f"Diff: {len(content.encode('utf-8')) - len(hardened.encode('utf-8'))} bytes")

# Extract main script block and syntax-check
lines = hardened.split('\n')
in_script = False
script_lines = []
start_idx = None
for i, line in enumerate(lines):
    if line.strip() == '<script>' and i > 2500 and not in_script:
        in_script = True
        start_idx = i
        script_lines = []
        continue
    if line.strip() == '</script>' and in_script:
        in_script = False
        break
    if in_script:
        script_lines.append(line)

print(f"Main script: {len(script_lines)} lines (starting at line {start_idx+1})")
js = '\n'.join(script_lines)

# Write and syntax-check
path = 'C:/Users/ccandelaria/Projects/CW Rate Benchmarks/tco_hardened_sim.js'
with open(path, 'w', encoding='utf-8') as f:
    f.write(js)

r = subprocess.run(['node', '--check', path], capture_output=True, text=True)
if r.returncode != 0:
    print(f"SYNTAX ERROR:\n{r.stderr}")
else:
    print("No syntax errors in simulated hardened JS")

# Also write the full hardened HTML for manual inspection
out = 'C:/Users/ccandelaria/vibeship-apps/tco-standalone/hardened_sim.html'
with open(out, 'w', encoding='utf-8') as f:
    f.write(hardened)
print(f"Simulated hardened file written to: {out}")
