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
        <StepChip label={`A8.${n}`} />
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

/* ------------------------- Section 8 main component --------------------- */

const Section8_YAMLAndCompose = () => {
  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: { xs: 2, sm: 3, md: 4 } }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        A8 — YAML & Docker Compose Intro
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Docker Compose files are written in <b>YAML</b>, a simple,
        indentation-based format. Think “structured notes” that Docker reads.
        This section shows just enough YAML to edit{" "}
        <code>docker-compose.yml</code> confidently, validate it safely, and run
        your stack.
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Step
        n="1"
        title="YAML basics in 90 seconds"
        what="YAML is key: value pairs, lists, and indentation (spaces only)."
        why="Compose reads services, ports, volumes, etc. from YAML."
        cmd={`# Mapping (object / dictionary)
service:
  image: caddy:2
  restart: unless-stopped

# List (sequence)
ports:
  - "80:80"
  - "443:443"

# Scalars (strings, numbers, booleans)
replicas: 1
debug: false
domain: gtpwebdev.xyz

# Comments start with '#'
# Indentation: use SPACES (2 is common). NEVER use tabs.`}
        expect={`You can recognize objects, lists, and values; indentation = structure.`}
        glenAdd={`If Compose errors mention "mapping values are not allowed" or "did not find expected key", it’s usually indentation or a stray colon.`}
      />

      <Step
        n="2"
        title="Read your current compose at /srv"
        what="Open and skim the file to connect concepts to reality."
        why="Seeing real entries (services, volumes, ports) makes YAML click."
        cmd={`sudo nano /srv/docker-compose.yml
# or:
less /srv/docker-compose.yml`}
        expect={`Top level keys like: version, services, volumes. Under services: caddy, base, fxhash.`}
      />

      <Step
        n="3"
        title="Safely validate YAML & Compose syntax"
        what="Use Docker’s built-in validation before you run anything."
        why="Catches indentation/typos early. Zero risk."
        cmd={`cd /srv
docker compose config         # expands & validates; prints merged config
docker compose config -q      # quiet mode: exit code 0 = valid
# If there's a problem, it'll print the line and column.`}
        expect={`Either clean output or a helpful error pointing to the exact line.`}
      />

      <Step
        n="4"
        title="What each section means (quick tour)"
        what="Identify the essentials in your compose file."
        why="So edits feel obvious instead of scary."
        cmd={`version: "3.9"          # compose schema version
services:                 # things that run
  caddy:                  # service name (DNS name inside Docker network)
    image: caddy:2        # download the caddy package, latest in the v2 series, from Docker hub
    ports:
      - "80:80"           # host:container for http
      - "443:443"         # host:container for https
    volumes:
      - ./reverse-proxy/Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
      - caddy_config:/config
    depends_on: [base, fxhash]
    restart: unless-stopped

  base:
    image: caddy:2
    command: ["caddy","file-server","--root","/usr/share/caddy","--listen",":80"]
    volumes:
      - ./apps/base-site/frontend:/usr/share/caddy:ro

  fxhash:
    image: caddy:2
    command: ["caddy","file-server","--root","/usr/share/caddy","--listen",":80"]
    volumes:
      - ./apps/fxhash/frontend:/usr/share/caddy:ro

volumes:                  # named volumes (persist caddy certs/config)
  caddy_data:
  caddy_config:`}
        expect={`You can point to services, ports, volumes, and understand what they map to.`}
      />

      <Step
        n="5"
        title="Make a tiny, safe edit (confidence builder)"
        what="Change the Caddy email in the Caddyfile and restart only Caddy."
        why="Practice an edit + restart flow without touching app content."
        cmd={`# Edit the ACME email (root-owned file)
sudo nano /srv/reverse-proxy/Caddyfile

# Restart just the front door
cd /srv
docker compose restart caddy

# Watch logs for ACME info or reloads
docker compose logs -f caddy | sed -n '1,120p'`}
        expect={`Caddy reloads with no YAML errors. Your sites still work over HTTPS.`}
        glenAdd={`You can also run \`docker compose up -d --no-deps caddy\` to update caddy without restarting base/fxhash.`}
      />

      <Step
        n="6"
        title="Common YAML pitfalls (and how to avoid them)"
        what="The handful of mistakes everyone makes once."
        why="Knowing these saves time."
        cmd={`# 1) Tabs instead of spaces → BAD
\tports:
\t  - "80:80"

# 2) Misaligned indentation → BAD
services:
 caddy:
    image: caddy:2    # (one level should be 2 spaces consistently)

# 3) Missing quotes on strings with colon or special chars
command: ["npm", "run", "build"]  # good (list form)
# If you use a single string with colon, quote it.

# 4) Trailing colon on a scalar → BAD
image: caddy:2:      # <-- extra colon

# Validate every time:
docker compose config -q`}
        expect={`Fewer “why won’t it start?” moments. Validator catches most issues.`}
      />

      <Step
        n="7"
        title="Environment variables (just enough for later)"
        what="Compose can substitute ${VARS} from a .env file next to docker-compose.yml."
        why="Keeps secrets/values out of the YAML (or at least centralized)."
        cmd={`# /srv/.env (example)
ACME_EMAIL=you@gtpwebdev.xyz

# docker-compose.yml (snippet)
# ...
# volumes unchanged
# ...
# In Caddyfile you can also reference env via {$ACME_EMAIL} if needed
# and pass it with: env ACME_EMAIL=you@gtpwebdev.xyz (advanced usage)`}
        expect={`You know where values could live when apps need configs/secrets.`}
        glenAdd={`We’ll keep secrets in /srv/secrets later; .env is for non-sensitive config or local overrides.`}
      />

      <Step
        n="8"
        title="Run, stop, inspect — the 5 Compose commands you’ll use daily"
        what="Memorize these and you’re fluent."
        why="They cover 95% of operations."
        cmd={`cd /srv

# This is basically bring the stack up
docker compose up -d

# Gracefully stops the containers but keeps them and their volumes around
docker compose stop

# Stops and starts a single service - after any change to Caddy config
docker compose restart caddy

# View service status / view a flow of the logs
docker compose ps
docker compose logs -f caddy

# Tear down containers, rarely used (keeps named volumes like caddy_data)
docker compose down`}
        expect={`Comfortable control over the stack without fear.`}
      />

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
        Result
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        You understand the shape of YAML, how Docker Compose reads it, and how
        to validate and operate your stack safely. From here, editing services,
        ports, and volumes is a matter of adjusting a few keys and re-running{" "}
        <code>docker compose config -q</code>.
      </Typography>

      <Code>{`Cheat Sheet
-----------
- Indentation = structure (use spaces, not tabs).
- Mappings = key: value ; Lists = dash lines under a key.
- Validate before running:  docker compose config -q
- Restart only what changed: docker compose restart <service>
- Logs are your friend:      docker compose logs -f <service>`}</Code>
    </Box>
  );
};

export default Section8_YAMLAndCompose;
