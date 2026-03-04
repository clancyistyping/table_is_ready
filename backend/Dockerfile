# ---- Build stage ----
FROM node:20-alpine AS build 

WORKDIR /app
# starting with tiny version of Linux with node20 installed

COPY package*.json ./
COPY tsconfig*.json ./
COPY prisma ./prisma
# `COPY package*.json ./` find all package*.json (the source) and paste them into the destination relative to WORKDIR.

# ci = clean install, ensures dependencies are exact match of package.json
RUN npm ci

# Copy source code
# src is copied here so that whenever only source code changes, it skips the above steps.
COPY src ./src

# Generate Prisma
RUN npx prisma generate
RUN npm run build
# 'build' runs tsc (.ts -> .js)

# ---- runtime stage ----
FROM node:20-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
# tells Node and Fastify to "high performance mode" by turning off some debugging features for speed

COPY package*.json ./
RUN npm ci --omit=dev
# installs only what's needed to run the app.

COPY --from=build /app/dist ./dist
# Grab the prisma engine and generated client
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/src/generated ./src/generated
# reach back to the first build stage, and grab only the compiled .js files, and toss everything else

EXPOSE 3000

CMD ["node", "dist/app.js"]
# start the app