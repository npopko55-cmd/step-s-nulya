#!/bin/zsh
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
LIST=("$@"); [ ${#LIST[@]} -eq 0 ] && LIST=(1920 1536 1440 1366 1280 1100 1024 980 900 820 768 700 640 599 480 414 390 360 320)
for W in $LIST; do
  "$CH" --headless=new --disable-gpu --window-size=$(( W>500?W+20:520 )),700 --virtual-time-budget=11000 --dump-dom "http://localhost:5310/_overlap.html#$W" 2>/dev/null \
   | python3 -E -P -c "import sys,re,html;d=sys.stdin.read();m=re.search(r'<pre id=\"A\">(.*?)</pre>',d,re.S);print('  '+(html.unescape(m.group(1)) if m else 'нет данных'))" &
  sleep 0.3
done; wait
