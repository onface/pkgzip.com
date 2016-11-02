FROM node:4.5

ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY

COPY . /opt/service
WORKDIR /opt/service

RUN npm --version
RUN npm install -g yarn && yarn
# RUN npm i

RUN ./lambdaify.sh
