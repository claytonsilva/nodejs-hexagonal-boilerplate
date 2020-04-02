FROM node:12-alpine

ADD . /app/eticca-api-denuncias

WORKDIR /app/eticca-api-denuncias

RUN apk --no-cache add ca-certificates
RUN apk update && apk upgrade && apk add --no-cache bash git openssh

RUN yarn install
RUN yarn build

VOLUME [ "/app/eticca-api-denuncias" ]
