# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy source code and config files
COPY src ./src
COPY entities ./entities
COPY nest-cli.json tsconfig.json tsconfig.build.json ./

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy dist folder from the builder stage
COPY --from=builder /app/dist ./dist

# Set environment
ENV NODE_ENV=production

# Expose the API port
EXPOSE 3001

# Command to run the application
CMD ["node", "dist/src/main.js"]
