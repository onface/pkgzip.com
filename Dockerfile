FROM node:6

COPY . /opt/service
WORKDIR /opt/service

RUN npm install

# install yarn
RUN npm install --global yarn
RUN yarn --version

# build app source to dist
RUN npm run dist

EXPOSE 8080

CMD npm start
