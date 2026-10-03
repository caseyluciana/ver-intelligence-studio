import re, pathlib

src = pathlib.Path("tco_standalone.html").read_text(encoding="utf-8")

# Inline help-modal.js
hm = pathlib.Path("assets/help-modal.js").read_text(encoding="utf-8")
src = src.replace('<script src="assets/help-modal.js" defer></script>', '<script>\n' + hm + '\n</script>')
src = src.replace('<script src="assets/help-modal.js"></script>', '<script>\n' + hm + '\n</script>')

# Encode non-ASCII in all <script> blocks
def js_escape(c):
    cp = ord(c)
    if cp < 128:
        return c
    if cp <= 0xFFFF:
        return "\\u%04X" % cp
    # Surrogate pair for non-BMP (e.g. emoji above U+FFFF)
    cp -= 0x10000
    hi = 0xD800 + (cp >> 10)
    lo = 0xDC00 + (cp & 0x3FF)
    return "\\u%04X\\u%04X" % (hi, lo)

def encode_script(m):
    tag, body, close = m.group(1), m.group(2), m.group(3)
    encoded = "".join(js_escape(c) for c in body)
    return tag + encoded + close

src = re.sub(r"(<script[^>]*>)(.*?)(</script>)", encode_script, src, flags=re.DOTALL)

out = pathlib.Path("C:/Users/ccandelaria/vibeship-apps/tco-standalone/index.html")
out.write_text(src, encoding="utf-8")
print("Written: %d bytes" % out.stat().st_size)
