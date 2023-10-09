FROM node:20-alpine as builder
WORKDIR /builder
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
COPY package*.json .
RUN npm ci --production
COPY --from=builder /builder/build /app
ENV PORT=8080
EXPOSE 8080
RUN export PORT=8080
CMD [ "node", "/app/index.js" ]