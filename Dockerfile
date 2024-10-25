# Dockerfile

FROM node:20.18.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm rebuild bcrypt

RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "start:prod"]
