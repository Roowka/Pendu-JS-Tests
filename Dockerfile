FROM node:22-alpine AS hangman-game

COPY package.json  /app/
WORKDIR /app

RUN npm install

COPY . /app

EXPOSE 3030

CMD ["npm", "run", "start"]