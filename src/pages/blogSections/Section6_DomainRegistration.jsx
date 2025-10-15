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
        <StepChip label={`A6.${n}`} />
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

/* ------------------------- Section 6 main component --------------------- */

const Section6_DomainRegistration = () => {
  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: { xs: 2, sm: 3, md: 4 } }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        A6 — Domain Registration and DNS Setup (Cloudflare)
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Register your domain and configure DNS to point at your server. We’ll
        use Cloudflare for registration and DNS. This sets up{" "}
        <code>gtpwebdev.xyz</code> and <code>fxhash.gtpwebdev.xyz</code> with
        IPv4 (A) and, if available, IPv6 (AAAA). Caddy will handle HTTPS in the
        next section.
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Step
        n="1"
        title="Register your domain in Cloudflare"
        what="Buy and register your new domain inside Cloudflare Registrar."
        why="One place for registration, DNS, and optional proxy. Simple and cheap renewals."
        cmd={`1) Go to https://dash.cloudflare.com/registrar
2) Search and purchase: gtpwebdev.xyz (or your choice)
3) After purchase, open the domain → DNS → Records`}
        expect={`Your domain appears in Cloudflare 'Websites' with an empty/clean DNS zone ready to edit.`}
      />

      <Step
        n="2"
        title="Add IPv4 records (A)"
        what="Create A records that point to your server’s public IPv4 address."
        why="This lets browsers reach your server over IPv4."
        cmd={`Type | Name   | IPv4 address | Proxy              | TTL
-----|--------|--------------|-------------------|-----
A    | @      | 95.217.x.y   | DNS only (grey)   | Auto
A    | fxhash | 95.217.x.y   | DNS only (grey)   | Auto
CNAME| www    | @            | DNS only (grey)   | Auto  # optional`}
        expect={`nslookup gtpwebdev.xyz → 95.217.x.y
nslookup fxhash.gtpwebdev.xyz → 95.217.x.y`}
        glenAdd={`This sets up gtpwebdev.xyz, fxhash.gtpwebdev.xyz and makes www.gtpwebdev.xyz an alias of gtpwebdev.xyz. Proxy must be grey (DNS only) for initial HTTPS issuance by Caddy. We'll then come back to turn on the proxy for additional security when set-up.`}
      />

      <Step
        n="3"
        title="(Optional but recommended) Enable IPv6 with AAAA records"
        what="Add AAAA records pointing to your server’s IPv6 *host* address (not the /64 network)."
        why="Dual-stack support (IPv4+IPv6). Often faster routes and future-proofing."
        cmd={`# 1) Find your exact IPv6 host address on the server
ip -6 addr show | grep "scope global"    # look for something like:
# inet6 2a01:4f9:c010:a985::1/64 scope global

# 2) Use ONLY the address part in DNS (no /64):
Type | Name   | IPv6 address                  | Proxy            | TTL
-----|--------|-------------------------------|------------------|-----
AAAA | @      | 2a01:4f9:c010:a985::1         | DNS only (grey)  | Auto
AAAA | fxhash | 2a01:4f9:c010:a985::1         | DNS only (grey)  | Auto`}
        expect={`nslookup -type=AAAA gtpwebdev.xyz → 2a01:4f9:c010:a985::1
nslookup -type=AAAA fxhash.gtpwebdev.xyz → 2a01:4f9:c010:a985::1`}
        glenAdd={`Do NOT include "/64" in Cloudflare. That suffix describes the network range, not the host. The lookup will show what should go after :: - likely 1`}
      />

      <Step
        n="4"
        title="Confirm firewall allows HTTP(S) on IPv4 and IPv6"
        what="Ensure UFW is IPv6-enabled and ports 80/443 are open."
        why="Let’s Encrypt (via Caddy) must reach your server over port 80/443 for certificate issuance/renewal."
        cmd={`# Ensure UFW handles IPv6:
# sudo nano /etc/default/ufw   → check if IPV6=yes, if not, amend then:
sudo ufw reload

# Open HTTP/HTTPS (applies to v4 & v6 when IPV6=yes):
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw status`}
        expect={`UFW shows 80/tcp and 443/tcp ALLOW (v6 entries appear when IPv6 is enabled).`}
      />

      <Step
        n="5"
        title="Set Cloudflare SSL/TLS mode"
        what="Review SSL settings so they cooperate with Caddy."
        why="Prevents conflicts while Caddy obtains certificates."
        cmd={`Cloudflare → SSL/TLS → Overview:
Mode: Full (strict)
Always Use HTTPS: Off (Caddy will handle redirects later)
Edge Certificates: defaults are fine`}
        expect={`Cloudflare won't interfere with ACME challenges; Caddy will issue real certs next section.`}
        glenAdd={`I needed to change from Full to Full (strict).`}
      />

      <Step
        n="6"
        title="Verify DNS resolution"
        what="Confirm A and (if added) AAAA records are live."
        why="Catches typos before we move on to Caddy."
        cmd={`nslookup gtpwebdev.xyz
nslookup fxhash.gtpwebdev.xyz
nslookup -type=AAAA gtpwebdev.xyz
nslookup -type=AAAA fxhash.gtpwebdev.xyz`}
        expect={`IPv4 lookups return 95.217.x.y; IPv6 lookups return your 2a01:... address (if configured).`}
      />

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
        IPv6 quick facts
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        IPv6 is just the newer addressing system. If both A and AAAA exist,
        clients prefer IPv6 when available and fall back to IPv4 otherwise.
        Caddy and Let’s Encrypt work seamlessly with both. The only “gotcha” is
        to put <b>the host address only</b> in Cloudflare (e.g.{" "}
        <code>2a01:4f9:c010:a985::1</code>) — <b>not</b> the network suffix{" "}
        <code>/64</code>.
      </Typography>

      <Code>{`Cloudflare DNS Summary
-------------------------------------
A     @        95.217.x.y           DNS only
A     fxhash   95.217.x.y           DNS only
AAAA  @        2a01:4f9:c010:a985::1  DNS only   # optional but recommended
AAAA  fxhash   2a01:4f9:c010:a985::1  DNS only   # optional but recommended
CNAME www      @                     DNS only`}</Code>

      <Divider sx={{ my: 2 }} />

      <Typography variant="body2" color="text.secondary">
        Result: <code>gtpwebdev.xyz</code> and <code>fxhash.gtpwebdev.xyz</code>{" "}
        resolve to your server over IPv4 (and IPv6 if configured). Proxy remains
        off (grey cloud) so Caddy can obtain certificates next.
      </Typography>
    </Box>
  );
};

export default Section6_DomainRegistration;
