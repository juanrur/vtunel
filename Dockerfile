FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG POCKETBASE_URL
ENV POCKETBASE_URL=${POCKETBASE_URL}
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
ENV POCKETBASE_URL=http://db:8080
CMD ["node", "server.js"]
