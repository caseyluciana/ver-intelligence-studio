import re

content = open('C:/Users/ccandelaria/vibeship-apps/tco-standalone/index.html', encoding='utf-8').read()
lines = content.split('\n')

hits = []
for i, line in enumerate(lines, 1):
    # JS string literals (in quotes) containing on[word]= patterns
    if re.search(r"""['"].*\bon\w+\s*=\s*['"]""", line):
        hits.append((i, line.strip()[:150]))

print(f"JS string literals with inline event handlers: {len(hits)}")
for ln, text in hits[:30]:
    print(f"  L{ln}: {text}")
