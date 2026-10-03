cp = 0x1F4CA
cp -= 0x10000
hi = 0xD800 + (cp >> 10)
lo = 0xDC00 + (cp & 0x3FF)
import sys
sys.stdout.buffer.write(('Surrogate pair for U+1F4CA: \\u%04X\\u%04X\n' % (hi, lo)).encode('utf-8'))
