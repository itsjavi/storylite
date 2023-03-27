FROM --platform=linux/amd64 "mcr.microsoft.com/devcontainers/universal:latest" as vscode

ENV NEXT_TELEMETRY_DISABLED 1
ENV REACT_EDITOR code
ENV N_PREFIX="/home/codespace/n"
ENV PATH="/workspaces/storylite/node_modules/.bin:/home/codespace/n/bin:$PATH"

RUN corepack disable && \
    npm i -g n

RUN n 18 && \
    /home/codespace/n/bin/corepack enable && \
    /home/codespace/n/bin/corepack prepare pnpm@latest --activate

WORKDIR /workspaces/storylite
EXPOSE 7707
EXPOSE 24678

# ------------------------------------------------

FROM node:18-bullseye as universal

# env vars
ENV HOME /home/codespace

ENV DEBIAN_FRONTEND noninteractive
ENV REACT_EDITOR code
ENV N_PREFIX="/home/codespace/n"
ENV PATH="/workspaces/storylite/node_modules/.bin:/home/codespace/n/bin:$PATH"

# Configure Locale and Timezone
ENV LC_ALL=en_US.UTF-8 \
    LANG=en_US.UTF-8 \
    LANGUAGE=en_US.UTF-8

ENV TZ=Europe/Berlin

RUN apt-get update && \
    apt-get install -y locales && \
    apt-get clean -y && rm -rf /var/lib/apt/lists/* && \
    echo 'en_US.UTF-8 UTF-8\nde_DE ISO-8859-1' > /etc/locale.gen && \
    locale-gen && \
    dpkg-reconfigure locales

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Install essentials

RUN apt-get update && \
    apt-get install -y git zsh && \
    apt-get clean -y && rm -rf /var/lib/apt/lists/*

ENV SHELL /bin/zsh

# Setup package manager(s)
RUN corepack disable && \
    npm i -g n

RUN n 18 && \
    /home/codespace/n/bin/corepack enable && \
    /home/codespace/n/bin/corepack prepare pnpm@latest --activate

WORKDIR /workspaces/storylite
EXPOSE 7707
EXPOSE 24678
