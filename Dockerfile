# AEGIS Kernel Reference Implementation
# Fulfills 'Inspectability over Optimization' (Principle 2.3)

FROM node:22-slim

# Set up the Rested Environment
WORKDIR /opt/aegis-kernel
ENV NODE_ENV=production
ENV AEGIS_GATE_SECRET=arizona_lab_reproducibility_secret

# Install minimal dependencies for better-sqlite3
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copy local logic into the container
COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Expose the Glass Gate (API + Witness Stream)
EXPOSE 8787

# Execute the Conscience Loop
CMD ["node", "server/dist/index.js"]