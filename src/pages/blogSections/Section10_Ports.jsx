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
        <StepChip label={`A10.${n}`} />
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

/* ------------------------- Section 10 main component --------------------- */

const Section10_Ports = () => {
  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: { xs: 2, sm: 3, md: 4 } }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        A10 — Quick Reference: Ports 22, 80, 443
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Three ports you use all the time. Keep this handy when checking
        firewalls or debugging connectivity.
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Step
        n="1"
        title="SSH — Port 22/TCP"
        what="Remote shell access (OpenSSH server)."
        why="How you manage the box. Can be public, or private via Tailscale."
        cmd={`# UFW: allow or rate-limit public SSH
sudo ufw allow 22/tcp
# or:
sudo ufw limit 22/tcp

# (If using Tailscale-only SSH later)
sudo ufw allow in on tailscale0 to any port 22 proto tcp
sudo ufw deny 22/tcp`}
        expect={`You can SSH in. If 'limit' is used, brute-force is rate-limited.`}
        glenAdd={`Keys-only auth + no root login recommended. Port can be changed (e.g., 2222) if you want fewer bot hits.`}
      />

      <Step
        n="2"
        title="HTTP — Port 80/TCP"
        what="Unencrypted web traffic + Let’s Encrypt HTTP-01 challenge."
        why="Caddy listens here to redirect HTTP→HTTPS and solve ACME challenges."
        cmd={`# UFW: must be open for ACME and redirects
sudo ufw allow 80/tcp`}
        expect={`Visiting http://... gets redirected to https://... by Caddy.`}
        glenAdd={`Even if your site is 'HTTPS-only', port 80 should stay open for ACME and clean redirects.`}
      />

      <Step
        n="3"
        title="HTTPS — Port 443/TCP (and UDP for HTTP/3)"
        what="Encrypted web traffic (TLS). Primary port for your sites."
        why="Caddy terminates TLS here and reverse-proxies to your containers."
        cmd={`# UFW: open TCP 443; UDP 443 enables HTTP/3/QUIC
sudo ufw allow 443/tcp
sudo ufw allow 443/udp   # optional but recommended for HTTP/3`}
        expect={`https://gtpwebdev.xyz and https://fxhash.gtpwebdev.xyz serve normally.`}
        glenAdd={`Cloudflare proxy also uses 443. With proxy ON, set SSL/TLS mode to "Full (strict)".`}
      />

      <Step
        n="4"
        title="Quick checks & diagnostics"
        what="Confirm listeners, firewall, and external reachability."
        why="Fast way to spot what's blocked or misconfigured."
        cmd={`# 1) Who's listening locally (Caddy/sshd)?
sudo ss -tulpen | egrep ':(22|80|443) '

# 2) Firewall rules
sudo ufw status verbose

# 3) From your laptop: do ports answer?
curl -I http://gtpwebdev.xyz       # expect 301 → https
curl -I https://gtpwebdev.xyz      # expect HTTP/2 200
# Cloudflare proxied? also OK — response still shows 200

# 4) Certificate sanity (optional)
echo | openssl s_client -connect gtpwebdev.xyz:443 -servername gtpwebdev.xyz 2>/dev/null | openssl x509 -noout -dates -issuer`}
        expect={`You see services bound on 22/80/443, UFW allows them, and curl returns expected status codes.`}
      />

      <Divider sx={{ my: 2 }} />

      <Typography variant="body2" color="text.secondary">
        Summary: <b>22/tcp</b> = SSH (public or via Tailscale), <b>80/tcp</b> =
        HTTP redirects & ACME, <b>443/tcp</b> = HTTPS (plus <b>443/udp</b> for
        HTTP/3). Caddy binds 80/443; sshd binds 22. Keep 80/443 open; decide for
        22 based on your comfort (public hardened vs Tailscale-only).
      </Typography>
    </Box>
  );
};

export default Section10_Ports;
