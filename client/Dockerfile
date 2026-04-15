# Stage 1: Build the React application
FROM node:20 AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Set the API URL for the build
ARG VITE_API_BASE=http://localhost:5000/api
ENV VITE_API_BASE=$VITE_VITE_API_BASE
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
