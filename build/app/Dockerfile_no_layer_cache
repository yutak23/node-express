FROM node:16.19.0-alpine3.16 AS builder

RUN mkdir /app
WORKDIR /app

COPY . .

RUN chmod +x ./build/app/entrypoint.sh && \
    yarn install --frozen-lockfile && \
    yarn build && \
    mkdir for-next-stage && \
    mv build config dist src static package.json yarn.lock for-next-stage/

FROM node:16.19.0-alpine3.16

RUN mkdir /app
COPY --from=builder /app/for-next-stage /app
WORKDIR /app

RUN yarn install --production --frozen-lockfile

ENTRYPOINT ["./build/app/entrypoint.sh"]