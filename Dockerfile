FROM node:16

WORKDIR /market/
COPY ./package.json /market/
COPY ./package-lock.json /market/
RUN npm install

COPY . /market/
CMD ["npm","start"]