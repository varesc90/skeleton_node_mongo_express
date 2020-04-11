FROM node:carbon

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --silence

COPY . .

EXPOSE 3001

CMD [ "npm", "start" ]