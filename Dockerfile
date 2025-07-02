# SPDX-FileCopyrightText: 2024 PNED G.I.E.
#
# SPDX-License-Identifier: Apache-2.0
FROM registry.access.redhat.com/ubi9/nodejs-22-minimal:9.6-1751380832 AS base

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

ENV NODE_ENV="production"
# Optional: Disable telemetry at runtime
# ENV NEXT_TELEMETRY_DISABLED="1"

COPY --from=builder /app/public ./public
COPY --from=builder /app/scripts ./scripts

# Ensure no write permissions for executable directories
COPY --from=builder --chown=1001:1001 /app/.next/standalone ./
COPY --from=builder --chown=1001:1001 /app/.next/static ./.next/static

USER 1001

EXPOSE 3000

ENV PORT="3000"
ENV HOSTNAME="0.0.0.0"

ENV MAINTAINER="PNED G.I.E."
ENV APP_TITLE="userportal-frontend"
ENV APP_DESCRIPTION="Frontend of user portal."

LABEL maintainer="${MAINTAINER}"
LABEL summary="${APP_TITLE}"
LABEL description="${APP_DESCRIPTION}"

LABEL org.opencontainers.image.vendor="${MAINTAINER}"
LABEL org.opencontainers.image.licenses="Apache-2.0"
LABEL org.opencontainers.image.title="${APP_TITLE}"
LABEL org.opencontainers.image.description="${APP_DESCRIPTION}"

LABEL io.k8s.display-name="${APP_TITLE}"
LABEL io.k8s.description="${APP_DESCRIPTION}"

CMD ["node", "scripts/start.js"]
