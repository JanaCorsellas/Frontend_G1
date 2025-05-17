#!/bin/sh
if [ x"${PUBLIC_API_URL}" != "x" ]; then
 echo "{ \"apiUrl\": \"${PUBLIC_API_URL}\" }" > /usr/share/nginx/html/config.json
fi

nginx -g 'daemon off;'
