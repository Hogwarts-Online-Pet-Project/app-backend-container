FROM node:20.3

RUN apt-get -y update

RUN apt-get install -y mariadb-client

WORKDIR /usr/app

COPY . /usr/app


RUN npm i

RUN rm -rf /usr/app/node_modules/@moreillon && mkdir /usr/app/node_modules/@moreillon
COPY ./backend_acrud_dependency/@moreillon /usr/app/node_modules/@moreillon

EXPOSE 8547

CMD [ "node", "app" ]