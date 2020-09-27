FROM nginx
EXPOSE 8081
RUN rm -rf /etc/nginx/sites-enabled/*
COPY app/build /app/site

STOPSIGNAL SIGTERM
CMD ["nginx", "-g", "daemon off;"]
