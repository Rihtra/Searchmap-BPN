import re

path = r"C:\Users\asus\Videos\bpn\src\data\initialData.ts"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Update interface
old_iface = """export interface MapRecord {
  id: string;
  kode: string;"""

new_iface = """export interface MapRecord {
  id: string;
  kode: string;
  tabungNumber: number;
  kodeTabung: string;"""

if old_iface in content:
    content = content.replace(old_iface, new_iface)

# Add tabungNumber and kodeTabung to all map entries
def replacer(match):
    pid = match.group(1)
    return f'"proyekId": {pid},\n    "tabungNumber": {pid},\n    "kodeTabung": "TABUNG {pid}",'

content = re.sub(r'"proyekId": (\d+),', replacer, content)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("initialData.ts updated with tabung fields successfully.")
