import os
import re

root = r'c:\Users\denie\OneDrive\Documents\GitHub\art-109\tutorials\github-copilot\copilot-demo-turn-in\kpop-haikyuu-cyberpunk'
html_path = os.path.join(root, 'index.html')
images_dir = os.path.join(root, 'images')

with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

slug = lambda name: re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')

pattern = re.compile(r'(<article[^>]*?data-name="([^"]+)"[^>]*?>)(.*?)(<div class="card__avatar"[^>]*></div>)(.*?</article>)', re.S)

names = []


def repl(match):
    article_open = match.group(1)
    name = match.group(2)
    before = match.group(3)
    after = match.group(5)
    slug_name = slug(name)
    filename = f'{slug_name}.svg'
    names.append((name, filename))
    new_avatar = f'<div class="card__avatar"><img src="images/{filename}" alt="Portrait of {name}" /></div>'
    return article_open + before + new_avatar + after

new_html, count = pattern.subn(repl, html)
if count == 0:
    raise RuntimeError('No cards updated')

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(new_html)

os.makedirs(images_dir, exist_ok=True)
for name, filename in set(names):
    path = os.path.join(images_dir, filename)
    if os.path.exists(path):
        continue
    color = '#' + ''.join([format((ord(c) * 7) % 256, '02x') for c in name[:3].ljust(3)])
    color2 = '#' + ''.join([format((ord(c) * 11 + 80) % 256, '02x') for c in name[-3:].rjust(3)])
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="{color}" />
      <stop offset="100%" stop-color="{color2}" />
    </linearGradient>
  </defs>
  <rect width="400" height="400" rx="40" ry="40" fill="url(#g)" />
  <text x="50%" y="45%" text-anchor="middle" fill="#ffffff" font-family="Inter, sans-serif" font-size="42" font-weight="700">{name}</text>
  <text x="50%" y="62%" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-family="Inter, sans-serif" font-size="22">Cyberpunk Fan Art</text>
</svg>'''
    with open(path, 'w', encoding='utf-8') as f:
        f.write(svg)

print(f'Updated {count} cards and created {len(set(names))} avatar images.')
