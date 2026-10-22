# Собирает index.html из page.src.html: @@logo@@ — логотип «Шагай Дома», @@burst@@ — молния с линиями
# скорости (tools/burst.svg), @@icon:NAME@@ — icons/NAME.svg
import pathlib, re
root = pathlib.Path(__file__).resolve().parent.parent
src = (root / 'page.src.html').read_text(encoding='utf-8')
logo = (root / 'tools' / 'logo.svg').read_text(encoding='utf-8').strip()

def icon(m):
    svg = (root / 'icons' / (m.group(1) + '.svg')).read_text(encoding='utf-8').strip()
    return svg.replace('<svg ', '<svg aria-hidden="true" focusable="false" ', 1)

burst = (root / 'tools' / 'burst.svg').read_text(encoding='utf-8').strip()
tape = 'Степ • ' * 40   # лента «СТЕП • СТЕП»: длиннее любой ширины экрана, лишнее обрезается
panel = (root / 'tools' / 'panel.svg').read_text(encoding='utf-8').strip()   # молния и линии скорости на красной панели
out = src.replace('@@panel@@', panel).replace('@@logo@@', logo).replace('@@burst@@', burst).replace('@@tape@@', tape.strip())
out = re.sub(r'@@icon:([a-z0-9-]+)@@', icon, out)
left = re.findall(r'@@[^@]+@@', out)
if left:
    raise SystemExit('не подставлено: ' + ', '.join(sorted(set(left))))
(root / 'index.html').write_text(out, encoding='utf-8')
print('index.html собран:', len(out), 'знаков')
