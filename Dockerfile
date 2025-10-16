# 1) Build the site
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 2) Serve the built files with Caddy (simple, fast web server)
FROM caddy:2.8-alpine
# Put your built files where Caddy serves from
COPY --from=build /app/dist /usr/share/caddy
# Tiny server config: serve files on port 8080 inside the container
COPY caddy/Caddyfile /etc/caddy/Caddyfile
