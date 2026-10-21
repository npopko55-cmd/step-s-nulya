#!/bin/zsh
# Проверка ширин: вылеты, текст на вырезах/молнии/тексте, пустоты в карточках.
# Шрифты грузятся с Google Fonts; если не успели — ширина перепроверяется (до 3 раз).
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
LIST=("$@"); [ ${#LIST[@]} -eq 0 ] && LIST=(1920 1536 1440 1366 1280 1100 1024 980 900 820 768 700 640 599 480 414 390 360 320)
one() {
  "$CH" --headless=new --disable-gpu --window-size=$(( $1>500?$1+20:520 )),700 --virtual-time-budget=11000 --dump-dom "http://localhost:5310/_overlap.html#$1" 2>/dev/null \
   | python3 -E -P -c "import sys,re,html;d=sys.stdin.read();m=re.search(r'<pre id=\"A\">(.*?)</pre>',d,re.S);print(html.unescape(m.group(1)) if m else '$1: нет данных')"
}
for W in $LIST; do
  for try in 1 2 3; do
    R=$(one $W)
    [[ "$R" != *ШРИФТЫ* ]] && break
  done
  echo "  $R"
done
