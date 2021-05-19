FROM python:3.8

WORKDIR /usr/src/app
COPY api/requirements.txt .
RUN pip install -r requirements.txt
COPY api .
COPY ./deployment/kubernetes/run.sh .

CMD [ "bash", "run.sh" ]
