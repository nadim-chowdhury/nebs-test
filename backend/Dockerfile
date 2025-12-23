# Base stage
FROM node:20-alpine AS base

# Development stage
FROM base AS dev
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM base AS production
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY --from=dev /app/dist ./dist
CMD ["node", "dist/main"]
