FROM node:10-alpine AS base
WORKDIR /app
COPY yarn.lock .

COPY package.json .
RUN apk add curl=7.61.1-r1 git=2.18.1-r0
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
EXPOSE 3001

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
# COPY webpack.prod.js .
# RUN NODE_ENV=production yarn build
COPY webpack.config.js .
EXPOSE 9229