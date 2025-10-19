import React from "react";
import {
  Box,
  Typography,
  Divider,
  Card,
  CardContent,
  Stack,
  Chip,
} from "@mui/material";

/* ----------------------------- Shared bits ----------------------------- */

const StepChip = ({ label, color = "primary" }) => (
  <Chip
    size="small"
    color={color}
    label={label}
    sx={{ borderRadius: "999px", fontWeight: 700 }}
  />
);

const Code = (props) => (
  <Box
    component="pre"
    sx={{
      mt: 1,
      p: 1.5,
      borderRadius: 1,
      bgcolor: "background.default",
      overflow: "auto",
      fontSize: 13,
      lineHeight: 1.5,
    }}
    {...props}
  />
);

const Step = ({ n, title, what, why, cmd, expect, glenAdd = "" }) => (
  <Card variant="outlined" sx={{ mb: 2 }}>
    <CardContent>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
        <StepChip label={`A11.${n}`} />
        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
          {title}
        </Typography>
      </Stack>

      {what && (
        <Typography variant="body2">
          <b>What:</b> {what}
        </Typography>
      )}
      {why && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
          <b>Why:</b> {why}
        </Typography>
      )}
      {cmd && <Code>{cmd}</Code>}
      {expect && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          <b>You should see:</b> {expect}
        </Typography>
      )}
      {glenAdd && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          <b>My note:</b> {glenAdd}
        </Typography>
      )}
    </CardContent>
  </Card>
);

/* ------------------------- Section 11 main component --------------------- */

const Section11_HostReactSite = () => {
  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: { xs: 2, sm: 3, md: 4 } }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        A11 — Host a React (Vite) Site via Docker + Caddy (HTTPS)
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        We’ll: (1) build your site in GitHub into a Docker image, (2) run that
        image on your server, and (3) serve it over HTTPS via your main Caddy
        reverse proxy. This keeps the server simple and repeatable.
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Step
        n="1"
        title="Prerequisites"
        what="Have a working domain and Caddy reverse proxy (from earlier), and a React/Vite repo on GitHub."
        why="The domain points traffic at your server. Caddy provides HTTPS. Your repo is where we’ll build the site."
        cmd={
          "# Check Docker & network exist on the server\n" +
          "docker --version\n" +
          "docker network ls | grep frontend_net || docker network create frontend_net\n\n" +
          "# Confirm Caddy front proxy is up (from your earlier setup)\n" +
          "docker compose -f /srv/docker-compose.yml ps"
        }
        expect={
          "Docker installed, 'frontend_net' exists (or is created), Caddy is running as your front door."
        }
      />

      <Step
        n="2"
        title="Add Dockerfile to your React repo"
        what="Create a multi-stage Dockerfile: build with Node, serve with Caddy inside the app container."
        why="Build once in CI; run a tiny, fast static server in production."
        cmd={
          "# 'Dockerfile' in the React repo root, content:\n\n" +
          "FROM node:20-alpine AS build\n" +
          "WORKDIR /app\n" +
          "COPY package*.json ./\n" +
          "RUN npm ci\n" +
          "COPY . .\n" +
          "RUN npm run build\n\n" +
          "FROM caddy:2.8-alpine\n" +
          "COPY --from=build /app/dist /usr/share/caddy\n" +
          "COPY caddy/Caddyfile /etc/caddy/Caddyfile\n" +
          "# Add a caddy/Caddyfile, content:\n\n" +
          "mkdir -p caddy\n" +
          ":8080\n" +
          "root * /usr/share/caddy\n\n" +
          "# If you use React Router (client routes), enable SPA fallback:\n" +
          "try_files {path} /index.html\n\n" +
          "file_server\n"
        }
        expect={
          "Two files added: Dockerfile and caddy/Caddyfile. 'npm run build' must create 'dist/'."
        }
        glenAdd={"To be clear, the files have no extensions."}
      />

      <Step
        n="3"
        title="Add GitHub Action to build & push to GHCR"
        what="Create .github/workflows/build.yml to build an image on every push to main."
        why="Your server pulls an immutable image; no build tools needed on the server."
        cmd={
          "Select Actions -> New Workflow -> Set up a workflow yourself, and insert:.\n\n" +
          "name: Build and Push (Static App)\n\n" +
          "on:\n" +
          "  push:\n" +
          "    branches: [ main ]\n" +
          "  workflow_dispatch:\n\n" +
          "jobs:\n" +
          "  docker:\n" +
          "    runs-on: ubuntu-latest\n" +
          "    permissions:\n" +
          "      contents: read\n" +
          "      packages: write\n" +
          "    steps:\n" +
          "      - uses: actions/checkout@v4\n\n" +
          "      - name: Log in to GHCR\n" +
          "        uses: docker/login-action@v3\n" +
          "        with:\n" +
          "          registry: ghcr.io\n" +
          "          username: ${{ github.actor }}\n" +
          "          password: ${{ secrets.GITHUB_TOKEN }}\n\n" +
          "      - name: Build (lowercase image path)\n" +
          "        shell: bash\n" +
          "        run: |\n" +
          "          OWNER_LC=$(echo \"${{ github.repository_owner }}\" | tr '[:upper:]' '[:lower:]')\n" +
          "          REPO_LC=$(echo \"${{ github.event.repository.name }}\" | tr '[:upper:]' '[:lower:]')\n" +
          "          SHORT_SHA=$(git rev-parse --short HEAD)\n" +
          '          IMAGE="ghcr.io/${OWNER_LC}/${REPO_LC}:${SHORT_SHA}"\n' +
          '          echo "IMAGE=$IMAGE" >> $GITHUB_ENV\n' +
          '          docker build -t "$IMAGE" .\n\n' +
          "      - name: Push\n" +
          '        run: docker push "$IMAGE"\n\n' +
          "      - name: Also tag 'latest'\n" +
          "        shell: bash\n" +
          "        run: |\n" +
          "          OWNER_LC=$(echo \"${{ github.repository_owner }}\" | tr '[:upper:]' '[:lower:]')\n" +
          "          REPO_LC=$(echo \"${{ github.event.repository.name }}\" | tr '[:upper:]' '[:lower:]')\n" +
          '          LATEST="ghcr.io/${OWNER_LC}/${REPO_LC}:latest"\n' +
          '          docker tag "$IMAGE" "$LATEST"\n' +
          '          docker push "$LATEST"\n\n'
        }
        expect={
          "A successful workflow run under GitHub → Actions. Image appears at ghcr.io/<owner>/<repo>:latest"
        }
        glenAdd={
          "gtpWebDev caused issues as image paths need to be lower case, so some of code deals with that."
        }
      />

      <Step
        n="4"
        title="Prepare server folders for this app"
        what="Create a tidy home for this app’s compose and env."
        why="Keeps each app isolated and predictable."
        cmd={
          "mkdir -p /srv/apps/my-frontend\n" +
          "cd /srv/apps/my-frontend\n\n" +
          "cat > .env << 'ENV'\n" +
          "APP_NAME=my-frontend\n" +
          "APP_IMAGE=ghcr.io/REPLACE_OWNER/REPLACE_REPO:latest\n" +
          "PUBLIC_DOMAIN=REPLACE_DOMAIN   # e.g. app.gtpwebdev.xyz\n" +
          "ENV\n\n" +
          "cat > docker-compose.yml << 'YAML'\n" +
          'version: "3.9"\n' +
          "services:\n" +
          "  web:\n" +
          '    image: "${APP_IMAGE}"\n' +
          '    container_name: "${APP_NAME}-web"\n' +
          "    restart: unless-stopped\n" +
          "    networks:\n" +
          "      - frontend_net\n" +
          "    expose:\n" +
          '      - "8080"   # internal only; public HTTPS handled by main Caddy\n\n' +
          "networks:\n" +
          "  frontend_net:\n" +
          "    external: true\n" +
          "YAML"
        }
        expect={
          "A new folder /srv/apps/my-frontend with .env and docker-compose.yml ready to run."
        }
        glenAdd={
          "Replace REPLACE_OWNER/REPLACE_REPO with lowercase GHCR path, and REPLACE_DOMAIN with your real domain."
        }
      />

      <Step
        n="5"
        title="Wire the public domain to this container via main Caddy"
        what="Add a site block to the server-wide Caddyfile that points to the container."
        why="Caddy does HTTPS and routes traffic to your app over the Docker network."
        cmd={
          "# Edit server-wide Caddyfile (created earlier)\n" +
          "cat >> /srv/reverse-proxy/Caddyfile << 'CADDY'\n\n" +
          "# React app\n" +
          "REPLACE_DOMAIN {\n" +
          "  encode zstd gzip\n" +
          "  reverse_proxy my-frontend-web:8080\n" +
          "}\n" +
          "CADDY\n\n" +
          "# Reload Caddy (adjust path if your caddy compose file differs)\n" +
          "docker compose -f /srv/docker-compose.yml exec caddy caddy reload --config /etc/caddy/Caddyfile"
        }
        expect={
          "No errors on reload. A new site block is active for your domain."
        }
        glenAdd={
          "'my-frontend-web' matches the container_name in your compose. Both must be on 'frontend_net'."
        }
      />

      <Step
        n="6"
        title="Start the app container"
        what="Pull the image from GHCR and run it."
        why="Makes the service reachable internally so Caddy can proxy to it."
        cmd={
          "cd /srv/apps/my-frontend\n" +
          "docker compose pull\n" +
          "docker compose up -d\n" +
          "docker ps\n\n" +
          "# Optional: watch logs briefly\n" +
          "docker logs -f my-frontend-web"
        }
        expect={
          "Container is running; logs should be quiet (Caddy serves static files)."
        }
      />

      <Step
        n="7"
        title="Verify over HTTPS"
        what="Load the site in a browser or with curl."
        why="Checks end-to-end: Domain → Caddy (HTTPS) → app container."
        cmd={
          "# From your laptop:\n" +
          "open https://REPLACE_DOMAIN\n\n" +
          "# Or:\n" +
          "curl -I https://REPLACE_DOMAIN"
        }
        expect={"HTTP/2 200 with a valid certificate. Your React site loads."}
      />

      <Step
        n="8"
        title="Deploy updates later"
        what="Push to main (build runs) → pull & restart on server."
        why="Simple, repeatable release flow."
        cmd={
          "# After pushing code to main and the Action finishes:\n" +
          "cd /srv/apps/my-frontend\n" +
          "docker compose pull\n" +
          "docker compose up -d"
        }
        expect={"Container restarts on the new image in a second or two."}
        glenAdd={
          "For precise rollbacks, use commit tags instead of ':latest' in APP_IMAGE."
        }
      />

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
        Troubleshooting
      </Typography>
      <Code>
        {"# Is the container running?\n" +
          "docker compose -f /srv/docker-compose.yml ps\n" +
          "docker compose -f /srv/docker-compose.yml logs caddy\n" +
          "docker compose -f /srv/apps/my-frontend/docker-compose.yml ps\n" +
          "docker logs my-frontend-web\n\n" +
          "# Common issues:\n" +
          "- 404 on deep link (/about):\n" +
          "  * Ensure SPA fallback in app-local caddy/Caddyfile:\n" +
          "    try_files {path} /index.html\n\n" +
          "- 502 Bad Gateway:\n" +
          "  * Container not running or wrong name/port.\n" +
          "  * Fix and: docker compose -f /srv/docker-compose.yml restart caddy\n\n" +
          "- Image not found / pull fails:\n" +
          "  * Make sure image path is lowercase and visible (public), or log in to GHCR.\n" +
          "  * APP_IMAGE should be like: ghcr.io/owner/repo:latest\n\n" +
          "- Still seeing old version:\n" +
          "  * Browser cache. Vite fingerprints assets but a hard refresh helps."}
      </Code>

      <Divider sx={{ my: 2 }} />

      <Typography variant="body2" color="text.secondary">
        Result: your React site is built in GitHub, runs as a container on your
        server, and is served over HTTPS by Caddy. No Node build tools or public
        ports are exposed beyond Caddy. Updates are pull-and-restart.
      </Typography>
    </Box>
  );
};

export default Section11_HostReactSite;
