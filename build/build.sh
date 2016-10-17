#!/usr/bin/env bash

#construct a dummy newline.txt file
printf "\n\n \n" > .newline.txt

rollup -c -o "tmp.js"

#concatenate d3 to js

cat ../d3min.js \
.newline.txt \
tmp.js > ../app.js

#remove unnecessary files
rm .newline.txt tmp.js



