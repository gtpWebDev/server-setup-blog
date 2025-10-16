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
        <StepChip label={`A7.${n}`} />
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

/* ------------------------- Section 7 main component --------------------- */

const Section7_CaddySetup = () => {
  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: { xs: 2, sm: 3, md: 4 } }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        A7 — Caddy Reverse Proxy & Automatic HTTPS
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 700, mb: 1, color: "red" }}>
        Note: this section involves content on yaml in particular that will be
        explained in Section A8 - recommended to just follow the instructions
        then understand later.
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Bring up Caddy as the front door on ports 80/443. It will automatically
        obtain TLS certificates for <code>gtpwebdev.xyz</code> and{" "}
        <code>fxhash.gtpwebdev.xyz</code> and reverse-proxy traffic to two
        lightweight static site containers (placeholders you can later replace
        with real apps).
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Step
        n="1"
        title="Prerequisites check"
        what="Confirm DNS and firewall are ready."
        why="Caddy’s ACME (Let’s Encrypt) must reach your server on 80/443; DNS must point to your server."
        cmd={`# DNS (in Cloudflare): A/AAAA records exist and are DNS only (grey)
# Local firewall:
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw status

# Optional: confirm IPv6 enabled by UFW
grep -E '^IPV6=' /etc/default/ufw   # should output: IPV6=yes`}
        expect={`Ports 80 and 443 allowed (v4 and v6). DNS lookups for gtpwebdev.xyz & fxhash.* resolve to your IP(s).`}
        glenAdd={`This should all have been done in the earlier stages.`}
      />

      <Step
        n="2"
        title="Create folders and simple placeholder sites"
        what="Set up two tiny static sites served by lightweight Caddy containers (backend targets)."
        why="Avoids 'hello world' and gives you a professional placeholder immediately."
        cmd={`
mkdir -p /srv/apps/base-site/frontend  # not using sudo as srv/apps is glen glen
mkdir -p /srv/apps/fxhash/frontend

# Minimal index pages you can customize anytime:
cat > /srv/apps/base-site/frontend/index.html << 'HTML'
<!doctype html><meta charset="utf-8">
<title>gtpwebdev.xyz</title>
<h1>gtpwebdev.xyz</h1>
<p>Base site is online ✅</p>
HTML

cat > /srv/apps/fxhash/frontend/index.html << 'HTML'
<!doctype html><meta charset="utf-8">
<title>fxhash.gtpwebdev.xyz</title>
<h1>fxhash.gtpwebdev.xyz</h1>
<p>FXH placeholder is online ✅</p>
HTML`}
        expect={`Two directories with index.html placeholders ready to serve.`}
      />

      <Step
        n="3"
        title="Compose stack with Caddy (reverse proxy) + 2 file servers"
        what="One Caddy on 80/443; two internal Caddy 'file server' containers publishing static pages."
        why="Keeps a clean separation: front door vs. app services."
        cmd={`cat > /srv/docker-compose.yml << 'YAML'
services:
  caddy:
    image: caddy:2
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./reverse-proxy/Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
      - caddy_config:/config
    depends_on:
      - base
      - fxhash
    restart: unless-stopped

  # Lightweight static file server for the base domain (calling it base to keep it short)
  base:
    image: caddy:2
    command: ["caddy", "file-server", "--root", "/usr/share/caddy", "--listen", ":80"]
    volumes:
      - ./apps/base-site/site:/usr/share/caddy:ro
    restart: unless-stopped

  # Lightweight static file server for fxhash subdomain
  fxhash:
    image: caddy:2
    command: ["caddy", "file-server", "--root", "/usr/share/caddy", "--listen", ":80"]
    volumes:
      - ./apps/fxhash/site:/usr/share/caddy:ro
    restart: unless-stopped

volumes:
  caddy_data:
  caddy_config:
YAML`}
        expect={`docker-compose.yml with 3 services: caddy (front), base, fxhash.`}
        glenAdd={`This is all new. Section A8 covers yaml files and compose in some detail. For now, just go along with it!`}
      />

      <Step
        n="4"
        title="Write the Caddyfile (sites + ACME email)"
        what="Define hosts and where to proxy."
        why="Tells Caddy which domains to serve and which containers to route to."
        cmd={`cat > /srv/reverse-proxy/Caddyfile << 'CADDY'
{
  email you@gtpwebdev.xyz
  # Optional: increase logging during first setup
  # debug
}

# forward requests for gtpwebdev.xyz to the Docker service name: base (defined in /srv/docker-compose.yml) on port 80
gtpwebdev.xyz {
  reverse_proxy base:80
}

# forward requests for fxhash.gtpwebdev.xyz to the Docker service name: fxhash (defined in /srv/docker-compose.yml) on port 80
fxhash.gtpwebdev.xyz {
  reverse_proxy fxhash:80
}
CADDY`}
        expect={`Two site blocks. Each host proxies to the matching internal service by Docker DNS name.`}
      />

      <Step
        n="5"
        title="Start the stack and optionally watch logs"
        what="Bring everything up and verify certificate issuance."
        why="Confirms ACME flow succeeds and sites are reachable over HTTPS."
        cmd={`cd /srv
docker compose up -d
docker compose logs -f caddy`}
        expect={`Logs showing “obtaining certificate” then “certificate obtained” for both hosts.`}
      />

      <Step
        n="6"
        title="Quick verification"
        what="Confirm HTTPS works end-to-end."
        why="Ensures Caddy is terminating TLS and serving the right backend."
        cmd={`# Simplest test - just put the addresses in the brower, or...

# From your laptop:
curl -I https://gtpwebdev.xyz
curl -I https://fxhash.gtpwebdev.xyz

# Expect: HTTP/2 200 (or 301 then 200), valid certificate chain.`}
        expect={`Both domains respond over HTTPS with your placeholder pages.`}
      />

      <Step
        n="7"
        title="Turn on Cloudflare proxy"
        what="Flip to orange cloud once HTTPS works; set SSL/TLS to Full (strict)."
        why="Enables CDN/DDoS protection while keeping end-to-end encryption (Cloudflare ↔ Caddy)."
        cmd={`# Cloudflare Dashboard:
- DNS records → switch A/AAAA to Proxied (orange)
- SSL/TLS → Mode: Full (strict)
- (Optional) Edge redirects/HTTP→HTTPS can stay off; Caddy already handles it.`}
        expect={`Traffic will route: Browser → Cloudflare → Caddy → your services.`}
        glenAdd={`This adds various benefits - filtering junk traffic, caching for static files, performance features, hides origin IP. Note, always safer to go grey on proxy, add in Caddyfile, wait for Caddy to issue the cert, then add proxy.`}
      />

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
        Troubleshooting
      </Typography>
      <Code>{`# Check container health
docker compose ps
docker compose logs caddy
docker compose logs base
docker compose logs fxhash

# Common issues
- ACME challenge fails:
  * DNS not resolving to your IP(s) yet → wait a minute & recheck
  * Port 80 blocked by firewall or host → open 80/tcp and 443/tcp
  * Cloudflare proxy enabled too early → set DNS only (grey), retry

- 502 Bad Gateway:
  * Backend container not running or wrong service name/port
  * Fix, then: docker compose restart caddy

- IPv6:
  * If AAAA exists, ensure UFW IPv6 is enabled (IPV6=yes) and 80/443 allowed`}</Code>

      <Divider sx={{ my: 2 }} />

      <Typography variant="body2" color="text.secondary">
        Result: Caddy is live on ports 80/443 with automatic HTTPS for both{" "}
        <code>gtpwebdev.xyz</code> and <code>fxhash.gtpwebdev.xyz</code>,
        proxying to two placeholder site containers. Replace <code>base</code>{" "}
        and <code>fxhash</code> services with your real apps later without
        touching the front proxy.
      </Typography>
    </Box>
  );
};

export default Section7_CaddySetup;
