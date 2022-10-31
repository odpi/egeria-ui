# SPDX-License-Identifier: Apache-2.0
# Copyright Contributors to the Egeria project

FROM public.ecr.aws/nginx/nginx:latest

ARG version=1.4.0
ARG VCS_REF=unknown
ARG VCS_ORIGIN=unknown
ARG BUILD_TIME=unknown
ARG VCS_DATE=unknown

# Labels from https://github.com/opencontainers/image-spec/blob/master/annotations.md#pre-defined-annotation-keys (with additions prefixed ext)
LABEL org.opencontainers.image.vendor = "odpi" \
      org.opencontainers.image.title = "egeria-ui" \
      org.opencontainers.image.description = "Static Web Content to support the ui server chassis" \
      org.opencontainers.image.url = "https://egeria.odpi.org/" \
      org.opencontainers.image.source = "$VCS_ORIGIN" \
      org.opencontainers.image.authors = "ODPi Egeria" \
      org.opencontainers.image.revision = "$VCS_REF" \
      org.opencontainers.image.licenses = "Apache-2.0" \
      org.opencontainers.image.created = "$BUILD_TIME" \
      org.opencontainers.image.version = "$version" \
      org.opencontainers.image.documentation = "https://egeria.odpi.org/open-metadata-resources/open-metadata-deployment/docker/egeria-ui/" \
      org.opencontainers.image.ext.vcs-date = "$VCS_DATE" \
      org.opencontainers.image.ext.docker.cmd = "docker run -p 80:80 -d odpi/egeria-ui:latest" \
      org.opencontainers.image.ext.docker.debug = "" \
      org.opencontainers.image.ext.docker.params = ""

# Just copy the built files & serve via nginx
COPY build/ /var/www/
COPY etc/nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
