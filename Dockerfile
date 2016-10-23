FROM node:6

COPY . /opt/service
WORKDIR /opt/service
RUN npm rebuild
RUN npm run dist

EXPOSE 8080

CMD npm start
