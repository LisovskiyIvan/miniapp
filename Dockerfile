# Этап сборки
FROM oven/bun:1-alpine as build

WORKDIR /app

# ENV NODE_OPTIONS="--max-old-space-size=128"
# ENV BUN_JS_RUNTIME_OPTS="--max-old-space-size=128"

# Копируем файлы зависимостей
COPY package.json bun.lock ./

# Устанавливаем зависимости
RUN bun install 

# Копируем исходный код
COPY . .

# Собираем приложение с максимальной оптимизацией памяти
RUN bun run build

# Этап production
FROM nginx:alpine

# Копируем собранные файлы из этапа сборки
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем конфигурацию nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт
EXPOSE 80

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"]