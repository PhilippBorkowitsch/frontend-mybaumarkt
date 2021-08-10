FROM node:14.17.1-alpine

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./
COPY patches/ ./patches/
RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent
RUN npm run postinstall

COPY . ./

CMD ["npm", "start"]