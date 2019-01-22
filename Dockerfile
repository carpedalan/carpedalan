FROM node:10-alpine AS base
WORKDIR /app
COPY yarn.lock .

COPY package.json .
RUN yarn --production --ignore-optional
COPY src/ ./src
COPY server/ ./server
COPY api/ ./api
COPY public/ ./public
COPY shared/ ./shared
COPY babel.config.js .
COPY .env.example .
COPY index.js . 
COPY scripts/ ./scripts
COPY db/ ./db
RUN apk --update add curl
FROM base AS prod
COPY .env .
COPY pk-APKAIUIJTQRAIWFPJFEA.pem .
COPY webpack.prod.js .
RUN yarn build
EXPOSE 80
CMD ["yarn", "start:prod"]

FROM base AS dev
RUN yarn --ignore-optional
COPY .env .
COPY nodemon.json .
COPY webpack.config.js .
EXPOSE 3001
EXPOSE 9229