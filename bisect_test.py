"""
Split the main <script> block of the staging file into two halves.
Test each half for syntax errors with node --check.
"""
import re, hashlib, subprocess, sys

content = open('C:/Users/ccandelaria/vibeship-apps/tco-standalone/index.html', encoding='utf-8').read()
lines = content.split('\n')

# Find main script block boundaries (the big one, lines 2608-10007 in 1-indexed)
start_idx = None
end_idx = None
for i, line in enumerate(lines):
    if line.strip() == '<script>' and start_idx is None and i > 2000:
        start_idx = i + 1  # first line of JS content
    if line.strip() == '</script>' and start_idx is not None and end_idx is None:
        end_idx = i  # exclusive
        break

print(f"Script block: lines {start_idx+1} to {end_idx} (0-indexed: {start_idx} to {end_idx})")
js_lines = lines[start_idx:end_idx]
print(f"Total JS lines: {len(js_lines)}")

# Write full JS and syntax-check
js = '\n'.join(js_lines)
path = 'C:/Users/ccandelaria/Projects/CW Rate Benchmarks/tco_full_js.js'
open(path, 'w', encoding='utf-8').write(js)
r = subprocess.run(['node', '--check', path], capture_output=True, text=True)
if r.returncode != 0:
    print(f"SYNTAX ERROR in full JS:\n{r.stderr}")
else:
    print("Full JS: no syntax errors")

# Binary bisect to find the line that causes the error
lo, hi = 0, len(js_lines)
while hi - lo > 50:
    mid = (lo + hi) // 2
    chunk = '\n'.join(js_lines[:mid])
    p = 'C:/Users/ccandelaria/Projects/CW Rate Benchmarks/tco_bisect.js'
    open(p, 'w', encoding='utf-8').write(chunk)
    r = subprocess.run(['node', '--check', p], capture_output=True, text=True)
    if r.returncode != 0:
        hi = mid
    else:
        lo = mid
    print(f"  bisect: lo={lo} hi={hi}")

# Show the suspect region
print(f"\nSuspect region: lines {start_idx+lo+1} to {start_idx+hi+1} of HTML file")
for i in range(max(0,lo-3), min(len(js_lines), hi+3)):
    print(f"  {start_idx+i+1}: {js_lines[i][:120]}")
