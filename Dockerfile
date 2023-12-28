FROM node:alpine
WORKDIR /app
COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install
COPY ./src ./src
COPY ./.env ./
CMD [ "node", "src/index.js" ] 
