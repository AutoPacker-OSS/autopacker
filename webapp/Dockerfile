# This Dockerfile shows and example of how to use multi stage building

# Stage 1: Build project
FROM node:13-alpine as react-build
# Set working directory
WORKDIR /app
# Copy all (not ignored) files into container (app directory)
COPY . ./
# Install all dependencies and build app (for staging environment)
RUN yarn install
RUN yarn build

# Stage: 2 - setting up nginx
FROM nginx:alpine
# Copy nginx configuration into the container
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy build 
COPY --from=react-build /app/build /usr/share/nginx/html
EXPOSE 80
# Defining entrypoint; run server when container starts
ENTRYPOINT ["nginx", "-g", "daemon off;"]