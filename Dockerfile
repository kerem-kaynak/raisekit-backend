
FROM node:18-alpine

WORKDIR /app

COPY package*.json .
COPY . .

RUN npm ci --only=production --force

CMD [ "node", "app.js" ]