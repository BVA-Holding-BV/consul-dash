FROM nginx:1.7

COPY reverse.conf /etc/nginx/conf.d/default.conf
COPY boot.sh /boot.sh
COPY app /usr/share/nginx/html

CMD ["/boot.sh"]
