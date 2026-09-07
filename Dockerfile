FROM node:22-bookworm-slim

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends git \
    && rm -rf /var/lib/apt/lists/*

RUN git config --global --add safe.directory /app

RUN corepack enable

EXPOSE 5173

CMD ["pnpm", "dev", "--host", "0.0.0.0"]
