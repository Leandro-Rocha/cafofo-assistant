FROM alpine:3.12

WORKDIR /usr/src/app

RUN apk add --update npm

COPY package*.json ./
RUN npm ci

COPY src/ src/
COPY tsconfig.json .

RUN npm run build

CMD [ "node", "dist/tsc/cli.js" ]
