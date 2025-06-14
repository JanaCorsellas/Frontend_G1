#!/bin/sh
if [ x"${API_URL}" != "x" ]; then
 echo "{ \"apiUrl\": \"${NG_APP_API_URL}\" }" > /usr/share/nginx/html/config.json
fi

nginx -g 'daemon off;'
