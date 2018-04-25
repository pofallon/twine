FROM node:carbon-slim
ARG version
RUN apt-get -qq update && \
    apt-get install -y --no-install-recommends libsecret-1-0 && \
    rm -rf /var/lib/apt/lists/*
RUN npm install --unsafe-perm=true -g "@pofallon/twine@$version"
ENTRYPOINT [ "twine" ]