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

const Section12_HostBasicReactSite = () => {
  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: { xs: 2, sm: 3, md: 4 } }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        A11 — Host a Basic React Site (Static SPA + GitHub Actions)
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Build the React docs in GitHub on every push to <code>main</code>, sync
        the build to the server, and serve it directly from the front Caddy with
        proper SPA routing. No backend, no databases — just static files over
        HTTPS.
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Step
        n="1"
        title="Prereqs & target paths"
        what="Pick the site domain and the on-disk path that Caddy will serve."
        why="Consistent paths keep deployments simple."
        cmd={`# This will be the main base-site, which will begin as a static react site, but may be expanded to include backend, etc. at a later date:
Domain: gtpwebdev.xyz
Server path for built files: /srv/apps/base-site/frontend/dist

# Ensure server folders exist and are writable by glen (do this while logged in as glen):
mkdir -p /srv/apps/base-site/{frontend/dist,caddy}
`}
        expect={`'/srv/apps/base-site/frontend/dist' exists; owned by glen.`}
      />

      <Step
        n="2"
        title="Create the app Caddyfile (SPA fallback on :8080)"
        what="Add a Caddy config ion the server that serves the React build and falls back to index.html for client routes."
        why="SPAs need unknown routes to return index.html so the client router can handle them."
        cmd={`Create the Caddyfile file in /srv/apps/base-site/carry, ensuring the correct access privileges (glen glen):
          
mkdir -p /srv/apps/base-site/caddy
touch /srv/apps/base-site/caddy/Caddyfile #note file has no extension
chmod 644 /srv/apps/base-site/caddy/Caddyfile
chown glen:glen /srv/apps/base-site/caddy/Caddyfile 

Now edit the Caddyfile file, careful not to sudo as it's glen access:

:8080
root * /usr/share/caddy
try_files {path} /index.html
file_server

# Note: in the next stage the docker-compose file will mount this at /etc/caddy/Caddyfile within the app.`}
        expect={`The file /srv/apps/base-site/caddy/Caddyfile exists. When everything is setup, the container will listen on :8080 and serve the SPA with proper routing.`}
        glenAdd={`Using :8080 inside the app container is just a convention; Caddy at the front door will reverse proxy to base-site-frontend:8080 over the caddy_to_apps network.`}
      />

      <Step
        n="3"
        title="Wire the front-door Caddy to the app (reverse proxy)"
        what="Add a site block so the public hostname forwards traffic to your app’s Caddy on :8080."
        why="Front-door Caddy terminates HTTPS and routes requests over the caddy_to_apps network to your app container."
        cmd={`# Edit /srv/reverse-proxy/Caddyfile and add this host block:

gtpwebdev.xyz {
  reverse_proxy base-site-frontend:8080
}

# Then reload front-door Caddy:
cd /srv
docker compose restart caddy`}
        expect={`'srv-caddy-1' restarts cleanly. Visiting https://gtpwebdev.xyz serves the SPA from base-site-frontend.`}
        glenAdd={`'base-site-frontend' is the Docker service name. Caddy reaches it over the caddy_to_apps network; The base-site container is not expposed publicly, it only answers to the frontdoor caddy service, hence port 8080 is a common app/backend convention.`}
      />

      <Step
        n="4"
        title="Set up the front-door Caddy container"
        what="Run a single, always-on Caddy at /srv that terminates HTTPS and routes to your apps."
        why="Keep TLS/ACME and public ports in one place. Apps run privately; Caddy forwards requests over the shared Docker network."
        cmd={`# Edit /srv/docker-compose.yml (Caddy-only project) using sudo nano

# The caddy_to_apps network is the shared 'front door → apps' bridge.
networks:
  caddy_to_apps:
    external: true  # pre-created; Compose won't create/delete it

services:
  caddy:                      # service (and Docker DNS) name
    image: caddy:2
    ports: ["80:80","443:443"]  # HTTP and HTTPS
    volumes:
      - ./reverse-proxy/Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
      - caddy_config:/config
    networks: [caddy_to_apps]
    restart: unless-stopped

volumes:
  caddy_data:
  caddy_config:

# Apply the change:
cd /srv
docker compose up -d
`}
        expect={`'docker compose config -q' is quiet (valid), and 'srv-caddy-1' is Up.`}
        glenAdd={`The caddy_to_apps network ensures caddy can communicate with any app with that network.`}
      />

      <Step
        n="5"
        title="Create the base-site app (frontend-only for now)"
        what="Run a tiny per-app Caddy that serves your built React files with SPA fallback."
        why="Keeps the app self-contained today, and ready to grow (API/DB/Redis) later without touching the front-door."
        cmd={`# 1)  Optionally create the required directories. From glen, no need to use sudo or change ownership:
mkdir -p /srv/apps/base-site/frontend

# 2)  Create the compose file: /srv/apps/base-site/docker-compose.yml

networks:
  caddy_to_apps:
    external: true

services:
  base-site-frontend:
    image: caddy:2
    # Caddy will read /etc/caddy/Caddyfile by default
    volumes:
      - ./caddy/Caddyfile:/etc/caddy/Caddyfile:ro
      - ./frontend/dist:/usr/share/caddy:ro # this is the standard location, remembering that its internal to the app-specific container
    networks: [caddy_to_apps]
    restart: unless-stopped

# 3) Bring the app up
cd /srv/apps/base-site
docker compose up -d`}
        expect={`'base-site-frontend' is Up, and https://gtpwebdev.xyz serves the SPA (routes work via try_files).`}
        glenAdd={`Mount path inside the app container follows the image's standard: /usr/share/caddy. Keep using this for every SPA.`}
      />

      <Step
        n="6"
        title="Create a GitHub deploy key (CI will use it)"
        what="This sets up a SSH key separate from my server login SSH, specifically for Github to deploy to the server. It will setup a private key on github and a public key on the server."
        why="Safer than using your personal key; easy to revoke."
        cmd={`# 1) Locally, this adds a github-deploy file for the private key and github-deploy.pub for the public key:
ssh-keygen -t ed25519 -f github-deploy -C "github-actions"  # don't add a passphrase when asked

# 2) Add the public key, which is located in github-actions.pub,  to the server. Write it into /home/glen/.ssh/authorized_keys on a new line, which will already exist.

# 3) Add the private key to github. The private key is located in github-actions (no extension).

In GitHub → Repo → Settings → Secrets and variables → Actions → New repository secret:
SSH_PRIVATE_KEY  = (contents of github-deploy including ---START--- etc.)

While you're there, also add in:
SSH_HOST         = server-apps.<insert Tailnet DNS name from Tailscale>.ts.net   # or your public DNS/IP
SSH_USER         = glen
SSH_DEST         = /srv/apps/base-site/frontend/dist  # target dir on server
`}
        expect={`Server now accepts deployments via that key. Your personal SSH key remains separate.`}
        glenAdd={`If struggling with any of this, cross-reference with what is used in base-site.`}
      />

      <Step
        n="7"
        title="Add GitHub Actions workflow"
        what="Build the React app on push to main and rsync the dist/ folder to the server."
        why="Zero-click deploys: push → build → deploy."
        cmd={`# In your repo, create: .github/workflows/deploy.yml
name: Build & Deploy Docs
on:
  push:
    branches: [ "main" ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Use Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install & Build
        run: |
          npm ci
          npm run build

      - name: Setup SSH for rsync
        env:
          SSH_PRIVATE_KEY: \${{ secrets.SSH_PRIVATE_KEY }}
          SSH_HOST: \${{ secrets.SSH_HOST }}
        run: |
          install -m 700 -d ~/.ssh
          echo "\$SSH_PRIVATE_KEY" > ~/.ssh/id_ed25519
          chmod 600 ~/.ssh/id_ed25519
          # recommended: pin server host key (replace with your server's):
          # ssh-keyscan -H "\$SSH_HOST" >> ~/.ssh/known_hosts
          printf "Host *\\n\\tStrictHostKeyChecking no\\n" > ~/.ssh/config

      - name: Deploy dist/ to server
        env:
          SSH_HOST: \${{ secrets.SSH_HOST }}
          SSH_USER: \${{ secrets.SSH_USER }}
          SSH_DEST: \${{ secrets.SSH_DEST }}
        run: |
          rsync -avz --delete -e "ssh -i ~/.ssh/id_ed25519" dist/ "\$SSH_USER@\$SSH_HOST:\$SSH_DEST/"`}
        expect={`A successful workflow run shows 'Install & Build' and 'Deploy' steps green. Files appear on the server.`}
        glenAdd={`If your build outputs to 'build/' instead of 'dist/', change the rsync source path accordingly.`}
      />

      <Step
        n="8"
        title="First deploy test"
        what="Push to main and watch the workflow."
        why="Confirms CI and the server path are wired correctly."
        cmd={`git add .
git commit -m "docs: first CI deploy"
git push origin main

# Then: watch Actions tab → the 'Build & Deploy Docs' workflow
# When it finishes, open:
https://gtpwebdev.xyz`}
        expect={`Your React docs load over HTTPS. Client routes work (thanks to try_files).`}
      />

      <Step
        n="9"
        title="Rollback / quick fixes"
        what="Revert to a previous version or re-run a deploy."
        why="Fast recovery when a build breaks."
        cmd={`# Revert to a previous commit and push:
git revert <bad-commit-sha>
git push origin main

# Or re-run the last successful Action from the Actions tab (Re-run job).
# If deploy path was wrong, fix SSH_DEST secret and re-run.`}
        expect={`Site returns to a known-good state without SSHing into the server.`}
      />

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
        Notes & Tips
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        • This pattern scales: add more SPAs by mounting more{" "}
        <code>./sites/&lt;name&gt;/dist</code> folders and adding matching
        Caddyfile site blocks. No extra containers needed. • For stricter SSH
        security in CI, replace <code>StrictHostKeyChecking no</code> with a
        pinned host key via{" "}
        <code>ssh-keyscan -H "$SSH_HOST" &gt;&gt; ~/.ssh/known_hosts</code>. •
        Cloudflare proxy can be ON; just ensure SSL/TLS is <b>Full (strict)</b>.{" "}
        • If you later add an API, use a subdomain (
        <code>api.&lt;domain&gt;</code>) or path routing (<code>/api/*</code>)
        in Caddy and keep this SPA setup unchanged.
      </Typography>
    </Box>
  );
};

export default Section12_HostBasicReactSite;
