# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm i --silent || true
COPY . .
RUN npm run build

# Run stage
FROM node:20-alpine AS run
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY package.json ./package.json
RUN npm i -g serve
EXPOSE 4173
CMD ["serve", "-s", "dist", "-l", "4173"]
