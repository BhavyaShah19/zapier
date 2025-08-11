FROM node:18-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY ./prisma prisma
RUN npx prisma generate
COPY ./src src
COPY tsconfig.json .
RUN npm run build

EXPOSE 3001

CMD ["sh", "-c", "npm run migrate && node dist/index.js"]