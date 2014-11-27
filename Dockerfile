FROM nginx:1.7

COPY reverse.conf /etc/nginx/conf.d/default.conf
COPY boot.sh /boot.sh

CMD ["/boot.sh"]
