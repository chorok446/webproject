FROM node:16

WORKDIR /market/
COPY ./package.json /market/
COPY ./babel.config.json /market/
RUN npm install

COPY . /market/
CMD rm -rf node_modules/
CMD npm update
CMD ["npm","start"]