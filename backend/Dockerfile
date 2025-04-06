FROM node:18-slim

RUN apt-get update && apt-get install -yq \
  build-essential \
  python3 \
  && rm -rf /var/lib/apt/lists/*

RUN ln -s /usr/bin/python3 /usr/bin/python

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=5001
EXPOSE 5001

CMD ["bash", "-c", "npx knex migrate:latest && npm start"]
