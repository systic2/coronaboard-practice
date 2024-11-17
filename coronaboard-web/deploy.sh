#!/bin/bash

git pull

npm install

(cd ../coronaboard-api/tools && node main.js)

NODE_OPTIONS='--max-old-space-size=1536' gatsby build

aws s3 sync \
--acl public-read \
--cache-control public,max-age=0,must-revalidate \
--exclude "*" \
--include "*.html" --include "*.json" \
--delete \
./public s3://coronaboard-systic.kr

aws s3 sync \
--acl public-read \
--cache-control public,max-age=31536000 \
--exclude "*.html" --exclude "*.json" \
--delete \
./public s3://coronaboard-systic.kr