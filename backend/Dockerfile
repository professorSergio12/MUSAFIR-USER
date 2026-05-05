FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy application source
COPY . .

# Backend reads .env from path "./.env" - in production, inject env via Docker/Compose
# Do not copy .env into the image for security; use runtime env or secrets.
ENV NODE_ENV=production

EXPOSE 4000

CMD ["node", "index.js"]
