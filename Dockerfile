# SPDX-License-Identifier: Apache-2.0
# Copyright Contributors to the Egeria project

# Stage 1 - Build
FROM node:16.13.0 AS builder

WORKDIR /app
COPY . /app
RUN npm install && npm run build:docker

# Stage 2 - Containerize
FROM nginx:1.19.0

ARG version=4.1.0
ARG VCS_REF=unknown
ARG VCS_ORIGIN=unknown
ARG BUILD_TIME=unknown
ARG VCS_DATE=unknown

LABEL org.opencontainers.image.vendor = "odpi" \
      org.opencontainers.image.title = "egeria-ui" \
      org.opencontainers.image.description = "User interface instance using main Egeria functionalities." \
      org.opencontainers.image.url = "https://egeria-project.org/" \
      org.opencontainers.image.source = "$VCS_ORIGIN" \
      org.opencontainers.image.authors = "Egeria Contributors" \
      org.opencontainers.image.revision = "$VCS_REF" \
      org.opencontainers.image.licenses = "Apache-2.0" \
      org.opencontainers.image.created = "$BUILD_TIME" \
      org.opencontainers.image.version = "$version" \
      org.opencontainers.image.documentation = "" \
      org.opencontainers.image.ext.vcs-date = "$VCS_DATE" \
      org.opencontainers.image.ext.docker.cmd = "docker run -p 80:80 -d odpi/egeria-ui:latest" \
      org.opencontainers.image.ext.docker.debug = "" \
      org.opencontainers.image.ext.docker.params = ""

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/build /var/www/

# Defaults to port 80. In our k8s charts we override this config
COPY etc/nginx.conf /etc/nginx/conf.d/default.conf

# default CMD/ENTRYPOINT will be used from base image
