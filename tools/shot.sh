#!/bin/zsh
# снимок страницы на ширине $1 в /tmp/w$1.png (обрезан по высоте страницы);
# если шрифты не загрузились (в кадре чёрная плашка) — переснимает, до 3 раз
W=$1; CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
WW=$(( W > 500 ? W : 500 ))
for try in 1 2 3; do
  "$CH" --headless=new --disable-gpu --hide-scrollbars --window-size=$WW,14000 --virtual-time-budget=14000 --screenshot=/tmp/w$W.png "http://localhost:5310/_frame.html#$W" 2>/dev/null
  python3 -E -P -c "
import sys
from PIL import Image;im=Image.open('/tmp/w$W.png').convert('RGB');w,h=im.size
if im.getpixel((5,5))==(0,0,0): sys.exit(3)
y=h-1
while y>0 and im.getpixel((min($W,w)-2,y))==(119,119,119):y-=1
im.crop((0,0,min($W,w),y+1)).save('/tmp/w$W.png')" && break
done
