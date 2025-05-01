FROM node:23-alpine3.21

WORKDIR /visto-listener
COPY package.json package.json
RUN yarn install --dev

COPY src src

CMD ["yarn", "start_live"]