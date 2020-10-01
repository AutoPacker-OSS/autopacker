# Dockerfile for development build
FROM node:13.12.0-alpine

# Set working directory
WORKDIR /app

# Copy config and dependency files
COPY package.json ./
COPY yarn.lock ./
COPY .env ./
COPY dev.env ./

# Install node modules
RUN yarn install

# Allow to mount sources into the container
RUN mkdir /app/src
RUN mkdir /app/public
VOLUME /app/src
VOLUME /app/public

# Expose TCP port 3000
EXPOSE 3000

# This is needed, otherwise the container will exit "gracefully"
# See discussion here: https://github.com/facebook/create-react-app/issues/8688
# This commit is the cause: https://github.com/facebook/create-react-app/commit/7e6d6cd05f3054723c8b015c813e13761659759e
ENV CI=true

# Start development version of the web app
CMD ["yarn", "start"]
