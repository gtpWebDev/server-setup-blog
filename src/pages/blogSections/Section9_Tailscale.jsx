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
        <StepChip label={`A9.${n}`} />
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

/* ------------------------- Section 9 main component --------------------- */

const Section9_Tailscale = () => {
  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: { xs: 2, sm: 3, md: 4 } }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        A9 — Private Access with Tailscale (SSH without public exposure)
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Tailscale creates a private, encrypted mesh between <i>your</i> devices.
        It gives this server a stable private address and name so you can SSH in
        privately (no public port 22 required, which are open to attack). Public
        websites via Caddy/Cloudflare are unaffected.
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Step
        n="1"
        title="Install and connect Tailscale (server)"
        what="Install the agent and link the server to your tailnet."
        why="This puts the server on your private network so only your devices can reach it."
        cmd={`curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up
# Follow the URL it prints → log in → approve the server`}
        expect={`tailscale up completes after you approve in the browser.`}
        glenAdd={`This uses outbound connections only — no extra public ports needed, so not open to attack.`}
      />

      <Step
        n="2"
        title="Confirm it worked"
        what="See your private addresses and devices."
        why="Verifies the server is on your tailnet and reachable."
        cmd={`tailscale status
tailscale ip -4    # e.g., 100.64.x.x
tailscale ip -6    # e.g., fd7a:...`}
        expect={`You see the server listed; it has stable private IPv4/IPv6 addresses.`}
      />

      <Step
        n="3"
        title="SSH privately over Tailscale (test before any firewall change)"
        what="Try logging in via the private Tailscale address or MagicDNS name."
        why="Proves you won’t lock yourself out when you later restrict public SSH."
        cmd={`# Using MagicDNS name (enable in Tailscale admin, see step 5):
ssh glen@gtpwebdev-apps

# Or using the Tailscale IPv4 from 'tailscale ip -4':
ssh glen@100.64.x.x`}
        expect={`SSH succeeds over the private network path.`}
      />

      <Step
        n="4"
        title="(Optional) Restrict SSH to Tailscale only"
        what="Allow SSH only on the Tailscale interface, block it on the public interface."
        why="Reduces attack surface on the public internet (no more bot scans on port 22)."
        cmd={`# Ensure UFW is IPv6-aware
grep -E '^IPV6=' /etc/default/ufw   # should show: IPV6=yes

# Allow SSH via Tailscale interface only:
sudo ufw allow in on tailscale0 to any port 22 proto tcp

# Block public SSH - everywhere except Tailscale:
sudo ufw deny 22/tcp

sudo ufw status verbose`}
        expect={`'22/tcp (v6)' allowed on tailscale0, denied on public. SSH still works via Tailscale.`}
        glenAdd={`Do this only AFTER step 3 succeeds. Keep a second terminal open in case of mistakes.`}
      />

      <Step
        n="5"
        title="MagicDNS & friendly name (nice to have)"
        what="Turn on MagicDNS in the Tailscale admin and give the server a clear hostname."
        why="Lets you SSH using a simple name instead of an IP."
        cmd={`# Set a friendly hostname on the server (optional):
sudo hostnamectl set-hostname newname
sudo tailscale up --reset --hostname=newname  # push the name change to tailscale


# In the Tailscale admin (the webpage):
# - Enable MagicDNS
# - Then use: ssh glen@myserver.your-tailnet.ts.net`}
        expect={`You can SSH to a memorable name instead of numbers.`}
      />

      <Step
        n="6"
        title="Uninstall/disable (if you ever want to back out)"
        what="Cleanly stop or remove Tailscale."
        why="Document the exit path."
        cmd={`# IMPORTANT: You must have a way in, so don't disable tailscale before re-introducing normal ssh access!
          
# If you previously denied 22/tcp:
sudo ufw delete deny 22/tcp

# Allow SSH publicly (adjust port if you moved it)
sudo ufw allow 22/tcp

# Now, make sure that sshd is running 
sudo systemctl enable --now ssh
sudo ss -tulpen | grep ':22 '

# And test it from a separate cmd window:
ssh glen@YOUR_SERVER_PUBLIC_IP

# Once confirmed, stop/disable/uninstall Tailscale:
sudo tailscale down
sudo systemctl disable --now tailscaled
sudo tailscale logout
sudo apt remove tailscale`}
        expect={`Tailscale quits and won’t start on boot; uninstall removes the package.`}
      />

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
        FAQs / Notes
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        • Public websites are unchanged: Browser → Cloudflare (optional) → Caddy
        → your apps. Tailscale is just your private admin path. • You can keep
        public SSH open if you want; Tailscale simply adds a safer, quieter
        alternative. • If SSH over Tailscale fails, re-run{" "}
        <code>sudo tailscale up</code> and check <code>tailscale status</code>.
        Don’t deny public SSH until your Tailscale SSH test works.
      </Typography>
    </Box>
  );
};

export default Section9_Tailscale;
