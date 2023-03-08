FROM node:14

RUN mkdir -p /home/app/

WORKDIR /home/app/

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

ENTRYPOINT ["npm", "run"]

CMD ["start"]