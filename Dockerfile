FROM docker.m.daocloud.io/node:20-alpine

WORKDIR /app

COPY repo/package.json ./

RUN npm config set registry https://registry.npmmirror.com && \
    npm install

COPY repo/ ./

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]
