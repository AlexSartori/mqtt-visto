FROM node:23-alpine3.21 AS development
WORKDIR /app
COPY package.json package.json
RUN --mount=type=cache,target=/root/.yarn YARN_CACHE_FOLDER=/root/.yarn yarn install --dev
COPY src src
CMD ["yarn", "parcel", "-p", "8008", "src/*.html"]

FROM development AS build_prod
RUN yarn parcel build --dist-dir dist src/*.html

FROM busybox:1.35 AS production
EXPOSE 8001
WORKDIR /app
COPY --from=build_prod /app/dist /app
CMD ["busybox", "httpd", "-f", "-v", "-p", "8008", "-h", "/app"]
