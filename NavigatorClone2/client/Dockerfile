# Build stage
FROM node:14 as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --quiet

# Add the following line to install the required packages
RUN npm install --quiet @date-io/date-fns@1.3.13 @material-ui/pickers date-fns@2.30.0 @material-ui/lab

# Add these packages during the build process
RUN npm install --quiet react-dnd react-dnd-html5-backend

# Copy all files
COPY . .

# Create .env file with SKIP_PREFLIGHT_CHECK to bypass dependency issues
RUN echo "SKIP_PREFLIGHT_CHECK=true" > .env

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy the build output
COPY --from=build /app/build /usr/share/nginx/html

# Create a simple nginx config that handles React routing
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 