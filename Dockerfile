# SPDX-FileCopyrightText: 2024 PNED G.I.E.
#
# SPDX-License-Identifier: Apache-2.0
FROM registry.access.redhat.com/ubi9/nodejs-20-minimal:9.5-1733824671 AS base

# Install dependencies only when needed
FROM base AS deps
USER 0
WORKDIR /app

# Install dependencies based on the available lock file
COPY package.json ./
COPY package-lock.json ./
RUN  npm ci --ignore-scripts

# Rebuild the source code only when needed
FROM base AS builder
USER 0
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Optional: Disable telemetry
# ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
USER 0
WORKDIR /app

ENV NODE_ENV production
# Optional: Disable telemetry at runtime
# ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/public ./public

# Ensure no write permissions for executable directories
COPY --from=builder --chown=1001:1001 /app/.next/standalone ./
COPY --from=builder --chown=1001:1001 /app/.next/static ./.next/static

USER 1001

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
