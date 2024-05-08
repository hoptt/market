FROM node:18

RUN npm install -g yarn

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 3000

CMD yarn start

