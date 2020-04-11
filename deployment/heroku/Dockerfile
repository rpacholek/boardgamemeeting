FROM ubuntu:focal
ENV DEBIAN_FRONTEND=noninteractive
RUN apt update && \
    apt install -y nginx python3 gunicorn python3-pip && \
    ln -fs /usr/share/zoneinfo/Europe/Warsaw /etc/localtime && \
    dpkg-reconfigure --frontend noninteractive tzdata

EXPOSE 80
COPY deployment/heroku /app
COPY api/requirements.txt /app/requirements.txt
RUN pip3 install -r /app/requirements.txt

RUN rm -f /etc/nginx/sites-enabled/default /etc/nginx/sites-available/default && \
    ln -s /app/nginx.conf /etc/nginx/sites-enabled/bmg && \
    ln -s /app/nginx.conf /etc/nginx/sites-available/bmg 
COPY api /app/api
COPY app/build /app/site

STOPSIGNAL SIGTERM

CMD ["bash", "/app/run.sh"]
