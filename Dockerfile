FROM harbor.uat.cmft.com/base/nginx:latest

RUN rm -rf /etc/nginx/conf.d/default.conf

RUN rm -rf /etc/nginx/conf.d/nginx.conf

ADD nginx.conf /etc/nginx/conf.d/nginx.conf

ADD dist /app/html/yourself-path
