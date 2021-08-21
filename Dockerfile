FROM alpine:3.12

WORKDIR /usr/src/app

RUN apk add --update npm

COPY package*.json ./
RUN npm ci --only=production

COPY src/ src/
COPY tsconfig.json .

RUN npm run build

ENV TZ="America/Sao_Paulo"

CMD [ "node", "dist/tsc/cli.js" ]

