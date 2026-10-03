import re
content = open('C:/Users/ccandelaria/vibeship-apps/tco-standalone/index.html', encoding='utf-8').read()
# Find \uXXXX patterns and check they are valid 4-hex-digit escapes
pat = re.compile(r'\\u([0-9a-fA-F]{0,4})')
bad = []
for m in pat.finditer(content):
    if len(m.group(1)) != 4:
        bad.append((m.start(), content[max(0,m.start()-30):m.start()+40]))
print('Bad escapes:', len(bad))
for pos, ctx in bad[:10]:
    print(' pos', pos, repr(ctx))

# Also check for any raw non-ASCII that snuck through in script blocks
script_blocks = re.findall(r'<script[^>]*>(.*?)</script>', content, re.DOTALL)
non_ascii_count = 0
for i, blk in enumerate(script_blocks):
    for j, c in enumerate(blk):
        if ord(c) > 127:
            non_ascii_count += 1
            if non_ascii_count <= 10:
                print(f'Non-ASCII in script block {i}, offset {j}: U+{ord(c):04X} {repr(c)} ctx={repr(blk[max(0,j-20):j+20])}')
print(f'Total non-ASCII in script blocks: {non_ascii_count}')
