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
        <StepChip label={`A4.${n}`} />
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

/* ------------------------- Section 4 main component --------------------- */

const Section4_FileStructure = () => {
  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: { xs: 2, sm: 3, md: 4 } }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        A4 — File Structure for Multi-App Server
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Create a clean, scalable layout under <code>/srv</code> for multiple
        apps (e.g. frontend, backend, Postgres, optional Redis, optional
        workers, and—if needed—MongoDB). Keep <code>/srv/secrets</code> and{" "}
        <code>/srv/reverse-proxy</code> root-owned.
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Step
        n="1"
        title="Create top-level /srv folders (one-time)"
        what="Make the standard directories and set ownership."
        why="Separates operational files from /home and keeps permissions sane."
        cmd={`sudo mkdir -p /srv/{apps,data,logs,backups,scripts,secrets,reverse-proxy}
sudo chown -R glen:glen /srv/{apps,data,logs,backups,scripts}
sudo chown -R root:root /srv/{secrets,reverse-proxy}
sudo chmod 700 /srv/secrets`}
        expect={`/srv is populated; glen owns working dirs; secrets/proxy are root-owned.`}
        glenAdd={`Although I have stopped root login, this is different from root access, which can be achieved through the use login. chmod 700 will be explained later in File Access Priviliges, but is a unix file permission that allows read, write and enter permission to its owner (root here) while everybody else can't even see the contents.`}
      />

      <Step
        n="2"
        title="Scaffold a new app"
        what="Create a repeatable skeleton for any app - when ready."
        why="Keeps code, data, logs, and backups tidy and isolated per app."
        cmd={`APP=myapp

# app home
mkdir -p /srv/apps/$APP/{frontend,backend,workers,migrations,ops}
touch /srv/apps/$APP/{docker-compose.yml,.env,README.md,ops/Makefile}

# persistent data (create what you use)
mkdir -p /srv/data/$APP/postgres/{data,init,conf,backups}
mkdir -p /srv/data/$APP/redis/{data,conf}
mkdir -p /srv/data/$APP/{uploads,cache}

# logs & backups
mkdir -p /srv/logs/$APP/{frontend,backend,workers,postgres,redis}
mkdir -p /srv/backups/$APP/{daily,weekly,monthly}

# secrets (root-owned)
sudo mkdir -p /srv/secrets/$APP/db
echo "# sensitive env vars" | sudo tee /srv/secrets/$APP/app.env >/dev/null
sudo touch /srv/secrets/$APP/db/{postgres.env,redis.env}
sudo chown -R root:root /srv/secrets/$APP && sudo chmod -R 600 /srv/secrets/$APP`}
        expect={`App directories exist; secrets are present but not world-readable.`}
        glenAdd={`This is not necessary at this stage, it would instead be done on preparing for hosting a new app. And you would of course add any additional directories necessary, for exmaple if mongodb was used instead of postgres.`}
      />

      <Step
        n="3"
        title="Add MongoDB (only for the app that needs it)"
        what="Create mongo-specific data/log/secret paths."
        why="Keeps Mongo neatly scoped to that one app."
        cmd={`APP=app-needing-mongo
mkdir -p /srv/data/$APP/mongo/{data,conf,backups}
mkdir -p /srv/logs/$APP/mongo
sudo touch /srv/secrets/$APP/db/mongo.env
sudo chown -R root:root /srv/secrets/$APP && sudo chmod -R 600 /srv/secrets/$APP`}
        expect={`Mongo folders created; mongo.env ready for credentials/URI.`}
      />

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
        High-level /srv scaffold
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Each major directory under /srv (apps, data, logs, backups, etc.)
        contains a subfolder for each application. This creates clear boundaries
        between apps, making it easy to manage, back up, and remove them
        independently. Every app follows the same predictable layout, keeping
        development, deployment, and maintenance consistent. This represents the
        top level of the file structure, before getting into specific app or
        database content.
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Shared or system-wide services (e.g. a central PostgreSQL or Redis
        instance) whould be placed in their own named directories such as
        /srv/data/postgres
      </Typography>

      <Code>{`/srv
├─ apps/                              # app homes (code, compose, ops)
│  └─ <app>/
│     ├─ docker-compose.yml           # compose file for this app
│     ├─ .env                         # non-sensitive env (safe for git ignore)
│     ├─ frontend/                    # frontend code or release artifacts
│     ├─ backend/                     # backend code or deploy scripts
│     ├─ workers/                     # schedulers/queuers/listeners
│     ├─ migrations/                  # DB migrations
│     └─ ops/                         # Makefile, scripts, docs
│
├─ data/                              # persistent volumes by app/service
│  └─ <app>/
│     ├─ postgres/                    # Postgres (if used)
│     │  ├─ data/                     # PGDATA
│     │  ├─ init/                     # *.sql / *.sql.gz run on first boot
│     │  ├─ conf/                     # postgresql.conf, pg_hba.conf (optional)
│     │  └─ backups/                  # optional raw dumps
│     ├─ redis/                       # Redis (optional)
│     │  ├─ data/                     # AOF / RDB
│     │  └─ conf/                     # redis.conf overrides (optional)
│     ├─ mongo/                       # Only for the app that needs MongoDB
│     │  ├─ data/                     # dbPath
│     │  ├─ conf/                     # mongod.conf (optional)
│     │  └─ backups/                  # mongodump archives (optional)
│     ├─ uploads/                     # user-generated files
│     └─ cache/                       # non-critical cache outside Redis
│
├─ logs/                              # centralized logs by app/service
│  └─ <app>/
│     ├─ frontend/
│     ├─ backend/
│     ├─ workers/
│     ├─ postgres/
│     ├─ redis/
│     └─ mongo/
│
├─ backups/                           # rotated backups (copy from data)
│  └─ <app>/
│     ├─ daily/
│     ├─ weekly/
│     └─ monthly/
│
├─ scripts/                           # operational scripts (backup, deploy)
│
├─ secrets/            (root:root, 700) # sensitive env/keys (mount read-only)
│  └─ <app>/
│     ├─ app.env                      # sensitive env for app services
│     └─ db/
│        ├─ postgres.env
│        ├─ redis.env
│        └─ mongo.env
│
└─ reverse-proxy/    (root:root)      # Traefik/Caddy/Nginx configs & ACME
`}</Code>

      <Divider sx={{ my: 2 }} />

      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Result: Predictable, repeatable layout for multiple apps with
        Postgres/Redis/Mongo as needed, tidy logs/backups, and secrets that stay
        locked down while still being mountable by Docker.
      </Typography>
      <Typography variant="body2" color="text.secondary">
        About mounts: We’ll wire containers to these folders later when we cover
        Docker Compose. For now, the goal of Section 4 is only to create a clear
        on-disk layout with correct ownership and permissions. Keep secrets
        root-only, keep app data/logs user-owned, and don’t mount anything yet.
      </Typography>
    </Box>
  );
};

export default Section4_FileStructure;
