FROM node:11.13-alpine AS base
WORKDIR /app
COPY yarn.lock .
RUN apk add git=2.20.1-r0
COPY package.json .
RUN yarn
COPY src ./src
COPY tsconfig.json .
COPY webpack.config.js .
COPY babel.config.js .
COPY devServer.js .
EXPOSE 4000


CMD ["node", "devServer"]
