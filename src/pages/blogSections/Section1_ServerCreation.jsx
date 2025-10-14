import React from "react";
import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Stack,
  Card,
  CardContent,
} from "@mui/material";

const Pill = ({ label }) => (
  <Chip
    label={label}
    size="small"
    sx={{ mr: 1, mb: 1, borderRadius: "999px", fontWeight: 500 }}
  />
);

const Section1_ServerCreation = () => {
  return (
    <>
      <Box sx={{ maxWidth: 900, mx: "auto", p: { xs: 2, sm: 3, md: 4 } }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          A1.1 Server Configuration — Decisions & Rationale
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          Provider & Plan
        </Typography>
        <Stack direction="row" flexWrap="wrap" sx={{ mb: 1 }}>
          <Pill label="Hetzner Cloud" />
          <Pill label="CPX31 (Dedicated vCPU)" />
          <Pill label="4 vCPU" />
          <Pill label="8 GB RAM" />
          <Pill label="160 GB NVMe" />
          <Pill label="~€13.60/mo" />
          <Pill label="~20 TB traffic" />
        </Stack>
        <Typography variant="body2" sx={{ mb: 3 }}>
          Chosen for excellent price/performance and predictable CPU (dedicated
          cores). Enough RAM and fast NVMe for Postgres, Redis, API, frontend,
          and workers on one box.
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          CPU Architecture
        </Typography>
        <List dense sx={{ mb: 2 }}>
          <ListItem disableGutters>
            <ListItemText
              primary="AMD (x86-64)"
              secondary="Maximum compatibility with Docker images and tooling. Fewer surprises than ARM for native modules."
            />
          </ListItem>
        </List>

        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          OS & Networking
        </Typography>
        <List dense sx={{ mb: 2 }}>
          <ListItem disableGutters>
            <ListItemText
              primary="Ubuntu 24.04 LTS"
              secondary="Stable, well-supported, lots of docs. Good default for servers."
            />
          </ListItem>
          <ListItem disableGutters>
            <ListItemText
              primary="Primary IPv4 (IPv6 optional)"
              secondary="IPv4 guarantees universal reachability and smooth SSL/DNS setup. IPv6 can stay enabled but not IPv6-only."
            />
          </ListItem>
          <ListItem disableGutters>
            <ListItemText
              primary="Location: EU (e.g., Falkenstein/Nürnberg)"
              secondary="Low latency from the UK and solid Hetzner data centers."
            />
          </ListItem>
        </List>

        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          Runtime & Ingress
        </Typography>
        <List dense sx={{ mb: 2 }}>
          <ListItem disableGutters>
            <ListItemText
              primary="Docker + Docker Compose"
              secondary="Simple, repeatable deployments. Each service isolated; easy to migrate later."
            />
          </ListItem>
          <ListItem disableGutters>
            <ListItemText
              primary="Caddy as reverse proxy"
              secondary="Automatic HTTPS with Let’s Encrypt; clean config; fast to set up."
            />
          </ListItem>
        </List>

        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          Data Layer
        </Typography>
        <List dense sx={{ mb: 2 }}>
          <ListItem disableGutters>
            <ListItemText
              primary="Postgres + Redis (containers)"
              secondary="Local to the app for Stage A. Good performance, minimal network hops."
            />
          </ListItem>
        </List>

        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          Ops Basics
        </Typography>
        <List dense sx={{ mb: 2 }}>
          <ListItem disableGutters>
            <ListItemText
              primary="Backups with Restic → Backblaze B2"
              secondary="Cheap, reliable off-site backups. Nightly DB dumps + retention policy."
            />
          </ListItem>
          <ListItem disableGutters>
            <ListItemText
              primary="Monitoring (add soon)"
              secondary="Prometheus + Grafana + Loki for metrics and logs. Gives visibility without leaving the box."
            />
          </ListItem>
          <ListItem disableGutters>
            <ListItemText
              primary="DNS (Cloudflare) & low TTL during cutovers"
              secondary="Keeps migrations painless. Flip DNS when moving services later."
            />
          </ListItem>
        </List>

        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          Migration-Friendly Practices
        </Typography>
        <List dense sx={{ mb: 3 }}>
          <ListItem disableGutters>
            <ListItemText
              primary="Everything via env vars & DNS"
              secondary="No hard-coded IPs. Makes moving services to another host a non-event."
            />
          </ListItem>
          <ListItem disableGutters>
            <ListItemText
              primary="Compose files split by concern"
              secondary="Reverse proxy, data, apps, monitoring in separate stacks. Easy to run subsets elsewhere."
            />
          </ListItem>
          <ListItem disableGutters>
            <ListItemText
              primary="(Optional) Tailscale/WireGuard"
              secondary="Private, stable internal names (e.g., postgres.tailnet) ready for Stage B."
            />
          </ListItem>
        </List>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Summary: A single AMD CPX31 server on Ubuntu with Docker, Caddy,
          Postgres, and Redis. Backed by Restic+B2 and clean DNS/env discipline.
          Cheap now, easy to scale later.
        </Typography>
      </Box>
      <Box sx={{ maxWidth: 900, mx: "auto", p: { xs: 2, sm: 3, md: 4 } }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          A1.2 SSH Keys
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Use the same GitHub key if you like. Add one key per computer. Public
          keys only.
        </Typography>

        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
              What we’re using
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              <Chip size="small" label="ed25519" />
              <Chip size="small" label="Windows + Other computer" />
              <Chip size="small" label="Hetzner SSH Keys" />
              <Chip size="small" label="Passwordless login" />
            </Stack>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Create or reuse a key (on your computer)
            </Typography>
            <Box
              component="pre"
              sx={{
                mt: 1,
                p: 1.5,
                borderRadius: 1,
                bgcolor: "background.default",
                overflow: "auto",
                fontSize: 13,
              }}
            >
              {`# Check for an existing key
    # Windows (PowerShell)
    dir $env:USERPROFILE\\.ssh
    
    # If needed, create one
    ssh-keygen -t ed25519 -C "you@example.com"`}
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Your public key is the <b>.pub</b> file (e.g.{" "}
              <code>id_ed25519.pub</code>). Never share the private key.
            </Typography>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Add keys to Hetzner
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              Console → <b>SSH Keys</b> → <b>Add SSH Key</b> → paste the entire{" "}
              <code>ssh-ed25519 ...</code> line. Select all relevant keys when
              creating the server.
            </Typography>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              First login
            </Typography>
            <Box
              component="pre"
              sx={{
                mt: 1,
                p: 1.5,
                borderRadius: 1,
                bgcolor: "background.default",
                overflow: "auto",
                fontSize: 13,
              }}
            >
              {`ssh root@YOUR.SERVER.IP
    # If your key has a non-default name:
    ssh -i ~/.ssh/your_key root@YOUR.SERVER.IP`}
            </Box>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Add a second computer later (to user "glen")
            </Typography>
            <Box
              component="pre"
              sx={{
                mt: 1,
                p: 1.5,
                borderRadius: 1,
                bgcolor: "background.default",
                overflow: "auto",
                fontSize: 13,
              }}
            >
              {`# On the server (as root or glen)
    mkdir -p /home/glen/.ssh && chmod 700 /home/glen/.ssh
    echo 'ssh-ed25519 AAAA... second-computer ...' >> /home/glen/.ssh/authorized_keys
    chown -R glen:glen /home/glen/.ssh
    chmod 600 /home/glen/.ssh/authorized_keys`}
            </Box>
          </CardContent>
        </Card>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body2" color="text.secondary">
          Bottom line: Keep one key per device, add each public key to Hetzner
          (or to <code>/home/glen/.ssh/authorized_keys</code>). Login is then
          just: <code>ssh glen@YOUR.SERVER.IP</code>.
        </Typography>
      </Box>

      <Box sx={{ maxWidth: 900, mx: "auto", p: { xs: 2, sm: 3, md: 4 } }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          A1.3 Other Server Options
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Quick choices made during Hetzner server creation. Keep it lean; aim
          for a simple, stable base.
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Row
          title="Primary IP"
          choice="IPv4 (enable IPv6 if offered)"
          color="success"
          note="IPv4 ensures universal reachability and smooth DNS/HTTPS. IPv6 can stay on, but avoid IPv6-only."
        />

        <Row
          title="Private Network"
          choice="No"
          color="default"
          note="Single server in Stage A; no benefit yet. We can attach a private network later in the same zone."
        />

        <Row
          title="Volumes (Block Storage)"
          choice="No"
          color="default"
          note="CPX31 already includes 160 GB NVMe. Add a Volume later only if you outgrow local disk or want detachable storage."
        />

        <Row
          title="Hetzner Firewall"
          choice="No (use UFW on server)"
          color="default"
          note="We’ll configure UFW locally for clarity and easy scripting. Hetzner firewall is optional for multi-server setups later."
        />

        <Row
          title="Backups (Hetzner snapshots)"
          choice="Optional (20% extra)"
          color="warning"
          note="Good safety net during early tinkering. Otherwise we’ll use Restic → Backblaze B2 for file-level backups."
        />

        <Row
          title="Placement Group"
          choice="None"
          color="default"
          note="Only relevant when you run multiple servers (spread for redundancy, cluster for low latency)."
        />

        <Row
          title="Labels"
          choice="Skipped"
          color="default"
          note="Purely organizational key/value tags. Add later if you want filters like project=personal-server, role=apps."
        />

        <Row
          title="Cloud-Init (User Data)"
          choice="Blank"
          color="default"
          note="We’re doing a hands-on setup to learn. Later you can automate these steps with a small cloud-init script."
        />

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
          What to note down
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Server name (<code>gtpwebdev-apps</code>), IPv4 address, plan/spec
          (CPX31: 4 vCPU / 8 GB / 160 GB NVMe), datacenter, which SSH keys are
          added, and whether Hetzner backups are enabled.
        </Typography>
      </Box>
    </>
  );
};

const Choice = ({ value = "Skip", color = "default" }) => (
  <Chip
    label={value}
    size="small"
    color={color}
    sx={{ borderRadius: "999px", fontWeight: 600 }}
  />
);

const Row = ({ title, choice, color, note }) => (
  <Card variant="outlined" sx={{ mb: 1.5 }}>
    <CardContent sx={{ py: 1.5 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 0.5 }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        <Choice value={choice} color={color} />
      </Stack>
      <Typography variant="body2" color="text.secondary">
        {note}
      </Typography>
    </CardContent>
  </Card>
);

export default Section1_ServerCreation;
