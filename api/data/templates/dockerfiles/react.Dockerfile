# Stage 1: Build project
FROM anicholasson/react-nginx as react-build

# Set working directory
WORKDIR /app

# Copy all (not ignored) files into container (app directory)
COPY . ./

# Install all dependencies and build app (for staging environment)
RUN npm install
RUN npm run-script build

# Stage: 2 - setting up nginx
FROM nginx:alpine

# Set nginx configuration
COPY --from=react-build /nginx.conf /etc/nginx/conf.d/default.conf

# Copy build
COPY --from=react-build /app/build /usr/share/nginx/html

# Defining entrypoint; run server when container starts
ENTRYPOINT ["nginx", "-g", "daemon off;"]