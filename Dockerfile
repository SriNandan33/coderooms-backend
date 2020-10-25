FROM node:12-alpine

WORKDIR /usr/src/app

COPY package.json .

RUN npm install

RUN npm install -g peer

RUN apk update && apk add bash

EXPOSE 8000
EXPOSE 9000

COPY . .

ENTRYPOINT [ "bash", "run.sh" ]
