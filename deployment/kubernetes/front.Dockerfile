FROM nginx
EXPOSE 80
COPY app/build /app/site

STOPSIGNAL SIGTERM
CMD ["nginx", "-g", "daemon off;"]
