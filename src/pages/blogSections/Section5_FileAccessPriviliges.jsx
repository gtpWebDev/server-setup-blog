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

const Step = ({ n, title, what, why, cmd, expect }) => (
  <Card variant="outlined" sx={{ mb: 2 }}>
    <CardContent>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
        <StepChip label={`A5.${n}`} />
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
    </CardContent>
  </Card>
);

/* ------------------------- Section 5 main component --------------------- */

const Section5_FileAccessPriviliges = () => {
  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: { xs: 2, sm: 3, md: 4 } }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        A5 — File Access & Permissions (Host + Docker)
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        A practical guide to who can read/write what across your host and
        containers. Root login is disabled; you operate as <code>glen</code>{" "}
        with <code>sudo</code> when needed.
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Step
        n="1"
        title="Ownership model"
        what="Keep working areas user-owned; lock down sensitive areas to root."
        why="Least privilege day-to-day; elevate only for risky operations."
        cmd={`# Working areas (owned by glen):
sudo chown -R glen:glen /srv/{apps,data,logs,backups,scripts}

# Sensitive areas (owned by root):
sudo chown -R root:root /srv/{secrets,reverse-proxy}
sudo chmod 700 /srv/secrets                  # only root can enter
# For ACME storage files (e.g., Traefik):
sudo chmod 600 /srv/reverse-proxy/traefik/letsencrypt/acme.json`}
        expect={`glen can manage code/data/logs; only root can access secrets and proxy certs.`}
      />

      <Step
        n="2"
        title="chmod quick reference"
        what="Understand octal permissions; directories behave slightly differently."
        why="You’ll set these constantly; mistakes leak secrets or break apps."
        cmd={`# Numbers map to rwx (4+2+1):
# 7 = rwx, 6 = rw-, 5 = r-x, 4 = r--, 0 = ---

# Common modes:
chmod 700 dir      # owner full; no group/others (best for secrets DIRS)
chmod 600 file     # owner read/write; no one else (best for secret FILES)
chmod 640 file     # owner rw, group r, others none (shared read-only)
chmod 644 file     # world-readable config/artifacts

# Directory semantics:
# r = list names; w = create/delete; x = cd/enter
# So to enter a directory you need 'x' on it.

# File semantice:
# r = read the file; w = modify the file; x = run a binary or script with a shebang

# Ownership levels:
# Owner - the single account that owns the file / directory. Usually its creator.
# Group - A named collection of users that can share access. Each file belongs to one group.
# Others - Everyone else on the system.

Note, sudo chown -R glen:glen is setting the [owner]:[group]

`}
      />

      <Step
        n="3"
        title="How Docker interacts with host permissions"
        what="Mounts are created by the Docker daemon (root). Access inside the container depends on the container user."
        why="Explains why root-owned secrets still work when mounted into containers."
        cmd={`# If the container runs as root (default):
# - It can read /srv/secrets mounted read-only, even if dir is 700 root:root.

# If the container runs as a non-root user (recommended):
# - It is treated like 'others' for perms inside the mount.
# - Ensure files are readable (e.g. 640) and adjust ownership/group as needed.

# Example: non-root container with read-only secret file
# (compose fragment)
services:
  api:
    image: myorg/app:latest
    user: "1000:1000"                  # run as non-root
    env_file:
      - /srv/secrets/myapp/app.env     # mounted by Docker, but see note below
    volumes:
      - /srv/secrets/myapp/app.env:/run/secrets/app.env:ro
      - /srv/data/myapp/uploads:/app/uploads
# Ensure the secret file on host is readable by 'others' OR by a shared group,
# or chown it to uid 1000 if you prefer:
# sudo chown 1000:1000 /srv/secrets/myapp/app.env
# sudo chmod 400 /srv/secrets/myapp/app.env   # read-only for that uid`}
        expect={`Root containers can read root-owned mounts; non-root need matching file ownership/permissions.`}
      />

      <Step
        n="4"
        title="Recommended patterns for secrets"
        what="Minimize exposure; mount only what you need; prefer files over env when possible."
        why="Reduces risk of accidental logging/leakage."
        cmd={`# 1) Keep secrets in root-owned directory; files mode 600 where possible
sudo install -m 700 -o root -g root -d /srv/secrets/myapp
sudo install -m 600 -o root -g root /path/to/app.env /srv/secrets/myapp/app.env

# 2) Mount specific files read-only into containers
# (avoid mounting the whole /srv/secrets)
# Compose snippet shown in A5.3

# 3) Non-root containers: align ownership to the runtime UID if needed
sudo chown 1000:1000 /srv/secrets/myapp/app.env
sudo chmod 400 /srv/secrets/myapp/app.env

# 4) Avoid putting secrets directly in env vars when possible
# (they end up in 'docker inspect' output and sometimes logs).`}
        expect={`Secret files remain tightly scoped and readable only by the container that needs them.`}
      />

      <Step
        n="5"
        title="Sharing files between apps/users safely"
        what="Use groups or ACLs; avoid world-readable where you can."
        why="Keeps least-privilege while enabling collaboration."
        cmd={`# Option A: shared Unix group (simple and fast)
sudo groupadd srvshare || true
sudo usermod -aG srvshare glen
sudo chgrp -R srvshare /srv/logs/shared
sudo chmod -R 2750 /srv/logs/shared
# 2 = setgid bit on directories -> new files inherit the group 'srvshare'.

# Option B: ACLs for precise per-path rules (if 'acl' is enabled on filesystem)
sudo setfacl -m u:glen:rX /srv/data/anotherapp/exports
sudo getfacl /srv/data/anotherapp/exports`}
        expect={`Only intended users can read shared paths; group inheritance keeps things tidy.`}
      />

      <Step
        n="6"
        title="Frontend vs Backend runtime users"
        what="Run app containers as non-root where feasible."
        why="Reduces blast radius if a process is compromised."
        cmd={`# Node/Nginx containers often provide a non-root user already.
# Example: run backend as uid 1000 and write logs to a user-owned mount.

services:
  backend:
    image: myorg/backend:latest
    user: "1000:1000"
    volumes:
      - /srv/logs/myapp/backend:/var/log/app
      - /srv/data/myapp/uploads:/app/uploads
    environment:
      - NODE_ENV=production

# Ensure host paths are writable by uid 1000:
sudo chown -R 1000:1000 /srv/{logs,data}/myapp`}
        expect={`Containers write to mounts without needing root; host paths remain controlled.`}
      />

      <Step
        n="7"
        title="Backups & logs: safe defaults"
        what="Keep backups readable only to you (and root); logs readable to you, not world."
        why="Backups often include data extracts; logs can contain tokens."
        cmd={`# Backups
sudo chown -R glen:glen /srv/backups
chmod -R 700 /srv/backups          # only your user (and root via sudo)

# Logs
sudo chown -R glen:glen /srv/logs
find /srv/logs -type d -exec chmod 750 {} \\;
find /srv/logs -type f -exec chmod 640 {} \\;`}
        expect={`Backups are private; logs aren’t world-readable but are usable by you and services.`}
      />

      <Step
        n="8"
        title="Troubleshooting checklist"
        what="Quick commands to diagnose permission issues."
        why="Saves time when a container says 'Permission denied'."
        cmd={`# 1) Who owns it? What are the perms?
ls -l /path     # list permissions for files in the directory
ls -ld /path    # list permissions for the directory


# 2) What user does the container run as?
docker compose exec <svc> id && whoami

# 3) Test access from inside the container shell
docker compose exec <svc> sh -lc 'ls -l /mounted/path && cat /mounted/path/file'

# 4) Align ownership (host) to container UID (carefully)
sudo chown -R 1000:1000 /srv/data/myapp/uploads

# 5) Directory execute bit missing?
chmod +x /parent/dirs                     # needed to cd into dirs

# 6) SELinux/AppArmor (less common on Ubuntu)
# If enabled, check denials or mount with appropriate labels/allow rules.`}
      />

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
        Quick Reference (copy/paste)
      </Typography>
      <Code>{`# Secrets: root-only directory and files
sudo chown -R root:root /srv/secrets && sudo chmod 700 /srv/secrets
sudo install -m 600 -o root -g root /tmp/app.env /srv/secrets/myapp/app.env

# Non-root container needs to read a secret file
sudo chown 1000:1000 /srv/secrets/myapp/app.env
sudo chmod 400 /srv/secrets/myapp/app.env

# App data/logs writable by non-root container
sudo chown -R 1000:1000 /srv/data/myapp /srv/logs/myapp

# Shared logs via group with setgid so new files inherit the group
sudo chgrp -R srvshare /srv/logs/shared && sudo chmod -R 2750 /srv/logs/shared`}</Code>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Result: predictable host permissions, minimal exposure of secrets, and
        containers that run with the lowest privileges needed to do their job.
      </Typography>
    </Box>
  );
};

export default Section5_FileAccessPriviliges;
