FROM nginx:1.7

COPY default.conf /etc/nginx/conf.d/default.conf
COPY boot.sh /boot.sh
RUN chmod +x /boot.sh
COPY app /usr/share/nginx/html

CMD ["/boot.sh"]
