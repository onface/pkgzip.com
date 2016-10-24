FROM node:6

COPY . /opt/service
WORKDIR /opt/service

# install yarn
RUN apt-key adv --keyserver pgp.mit.edu --recv D101F7899D41F3C3
RUN echo "deb http://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get install yarn
RUN yarn --version

# rebuild npm to target os
RUN npm rebuild

# build app source to dist
RUN npm run dist

EXPOSE 8080

CMD npm start
