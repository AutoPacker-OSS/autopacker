# Stage 1: Build project
FROM tiangolo/node-frontend:10 as build-stage

# Set working directory
WORKDIR /app

# Copy all (not ignored) files into container (app directory)
COPY . ./

# Install all dependencies and build app (for staging environment)
RUN npm install
RUN npm run-script build -- --output-path=./dist/out

# Stage: 2 - setting up nginx
FROM nginx:alpine

# Copy build
COPY --from=build-stage /app/dist/out/ /usr/share/nginx/html

# Copy the default nginx.conf provided by tiangolo/node-frontend
COPY --from=build-stage /nginx.conf /etc/nginx/conf.d/default.conf

# Defining entrypoint; run server when container starts
ENTRYPOINT ["nginx", "-g", "daemon off;"]