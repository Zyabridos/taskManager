FROM node:20-alpine

WORKDIR /app

# Копируем файлы package.json и package-lock.json
COPY frontend/package*.json ./

# Очищаем кэш NPM и устанавливаем зависимости
RUN npm cache clean --force
RUN npm install --verbose

# Копируем все оставшиеся файлы
COPY frontend ./

# Строим проект
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
