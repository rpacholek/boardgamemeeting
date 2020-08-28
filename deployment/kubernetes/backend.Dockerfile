FROM python:3

WORKDIR /usr/src/app
COPY api .
RUN pip install -r requirements.txt
COPY ./deployment/kubernetes/run.sh .

CMD [ "bash", "run.sh" ]
