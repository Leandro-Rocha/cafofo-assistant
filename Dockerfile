FROM node:lts-alpine3.14

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY src/ src/
COPY tsconfig.json .
COPY .env .

RUN npm run build

ENV TZ="America/Sao_Paulo"

CMD [ "node", "dist/tsc/cli.js" ]