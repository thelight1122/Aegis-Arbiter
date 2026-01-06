# FILE: server/Dockerfile
FROM node:20-alpine AS runtime

WORKDIR /app

# Install deps (production only)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy compiled output
COPY dist ./dist

ENV NODE_ENV=production
ENV PORT=8787
EXPOSE 8787

CMD ["node", "dist/index.js"]
