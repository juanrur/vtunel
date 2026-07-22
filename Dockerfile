FROM node:20-alpine AS builder
ARG NEXT_PUBLIC_POCKETBASE_URL=http://localhost:8080
ENV NEXT_PUBLIC_POCKETBASE_URL=$NEXT_PUBLIC_POCKETBASE_URL
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
ENV POCKETBASE_URL=http://db:8080
CMD ["node", "server.js"]
