# SPDX-License-Identifier: Apache-2.0
# Copyright Contributors to the Egeria project

FROM node:10-alpine as build

ARG version=2.8-SNAPSHOT
ARG VCS_REF=unknown
ARG VCS_ORIGIN=unknown
ARG BUILD_TIME=unknown
ARG VCS_DATE=unknown

# Labels from https://github.com/opencontainers/image-spec/blob/master/annotations.md#pre-defined-annotation-keys (with additions prefixed ext)
LABEL org.opencontainers.image.vendor = "ODPi" \
      org.opencontainers.image.title = "Egeria-uistatic" \
      org.opencontainers.image.description = "Static Web Content to support the ui server chassis" \
      org.opencontainers.image.url = "https://egeria.odpi.org/" \
      org.opencontainers.image.source = "$VCS_ORIGIN" \
      org.opencontainers.image.authors = "ODPi Egeria" \
      org.opencontainers.image.revision = "$VCS_REF" \
      org.opencontainers.image.licenses = "Apache-2.0" \
      org.opencontainers.image.created = "$BUILD_TIME" \
      org.opencontainers.image.version = "$version" \
      org.opencontainers.image.documentation = "https://egeria.odpi.org/open-metadata-resources/open-metadata-deployment/docker/egeria-uistatic/" \
      org.opencontainers.image.ext.vcs-date = "$VCS_DATE" \
      org.opencontainers.image.ext.docker.cmd = "docker run -p 8080:8080 -d odpi/egeria-uistatic" \
      org.opencontainers.image.ext.docker.debug = "" \
      org.opencontainers.image.ext.docker.params = ""

# Initial version -- build from git

RUN mkdir -p /home/node/egeria-ui
WORKDIR /home/node/egeria-ui

# Note we copy the entire tree -- once the dev team have clarified what is needed, this can be optimized
# We also do not yet do a multi stage build, as this requires clarity over what needs to be present in the runtime
# vs the development environment. In addition we may wish to use nginx or similar for a production case.

COPY --chown=node:node .  .


USER 1000
EXPOSE 8081

CMD [ "npm", "run", "start" ]
