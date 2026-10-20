#!/bin/zsh
# снимок страницы на ширине $1 в /tmp/w$1.png
W=$1; CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
WW=$(( W > 500 ? W : 500 ))
"$CH" --headless=new --disable-gpu --hide-scrollbars --window-size=$WW,9800 --virtual-time-budget=14000 --screenshot=/tmp/w$W.png "http://localhost:5310/_frame.html#$W" 2>/dev/null
