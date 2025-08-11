FROM node:18-alpine

WORKDIR /app  

COPY package*.json ./  

COPY tsconfig.json .
RUN npm install  

COPY ./prisma prisma
RUN npx prisma generate
 
COPY ./src src

RUN npm run build

COPY wait-for-kafka.sh /usr/local/bin/wait-for-kafka.sh
RUN chmod +x /usr/local/bin/wait-for-kafka.sh

CMD ["sh", "/usr/local/bin/wait-for-kafka.sh"]
