# Base stage
FROM node:20-alpine AS base

# Development stage
FROM base AS dev
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "run", "start:dev"]

# Production stage
FROM base AS production
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY --from=dev /app/dist ./dist
COPY --from=dev /app/drizzle.config.ts ./
COPY --from=dev /app/src/drizzle ./src/drizzle
CMD ["sh", "-c", "npm run db:push && node dist/src/main"]
