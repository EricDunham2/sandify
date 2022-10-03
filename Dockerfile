# Dockerfile for development of sandify

FROM node:16.10.0

RUN npm install -g npm
#RUN npm install -g

RUN mkdir /srv/app && chown node:node /srv/app

#COPY . /srv/app

USER node

WORKDIR /srv/app

CMD [ "npm", "start" ]
