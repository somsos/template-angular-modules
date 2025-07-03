#!/bin/bash
set -e

echo '######### build starts ######### ';

docker build -t template_frontend:1 .

echo "builded template_frontend:1\n\n\n"

echo '######### build finished ######### ';
