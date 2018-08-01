FROM node:8-alpine as builder

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Bundle app source
COPY . /app

RUN npm install 
RUN npm install -g @angular/cli@6.1.1
RUN ng build --prod

FROM node:8-alpine
RUN mkdir -p /app/server /app/dist
WORKDIR /app

COPY --from=builder /app/server.js /app/package.json /app/index.html /app/
COPY --from=builder /app/server /app/server
COPY --from=builder /app/dist /app/dist

RUN npm install --production

EXPOSE 3000

CMD [ "node", "server" ]

