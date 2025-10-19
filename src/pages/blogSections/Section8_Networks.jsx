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
        <StepChip label={`AX.${n}`} />
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

/* ------------------------- Section X: Networks -------------------------- */

const Section8_Networks = () => {
  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: { xs: 2, sm: 3, md: 4 } }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        AX — Docker Networks (Plain-English Guide)
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        A Docker network is a private switchboard inside your server. Containers
        on the same network can talk to each other by name; containers not on
        that network cannot. We use this to let Caddy (public) reach apps, while
        keeping databases private.
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Step
        n="1"
        title="The pattern we use"
        what="One shared network for public-facing HTTP (frontend_net). One private network per app for internal services."
        why="Keeps routing simple for Caddy, and isolates databases/Redis so other apps can’t reach them."
        cmd={
          "Public network (shared once for all apps):\n" +
          "  frontend_net  → Caddy ↔ each app’s HTTP container\n\n" +
          "Private per-app networks (defined inside each app’s compose):\n" +
          "  myapp_net     → API ↔ Postgres ↔ Redis ↔ Worker (not visible to others)"
        }
      />

      <Step
        n="2"
        title="Create the shared public network (once)"
        what="Make a reusable Docker network which all public-facing app containers will join."
        why="Lets Caddy reverse-proxy to any app by container name, without exposing host ports."
        cmd={
          "docker network create frontend_net || true\n" +
          "docker network ls\n" +
          "docker network inspect frontend_net   # shows connected containers"
        }
        expect={"A network named 'frontend_net' exists and is ready to use."}
        glenAdd={
          "This just creates the network, the docker-compose.yml files will dictate what its purpose is."
        }
      />

      <Step
        n="3"
        title="Attach Caddy to the shared network"
        what="Give Caddy access to both its local services and the shared public network."
        why="Caddy needs to see: (a) your local placeholders (default network), (b) other apps on frontend_net."
        cmd={
          "services:\n" +
          "  caddy:\n" +
          "    image: caddy:2\n" +
          '    ports: ["80:80", "443:443"]\n' +
          "    volumes:\n" +
          "      - ./reverse-proxy/Caddyfile:/etc/caddy/Caddyfile:ro\n" +
          "      - caddy_data:/data\n" +
          "      - caddy_config:/config\n" +
          "    depends_on: [base, fxhash]\n" +
          "    restart: unless-stopped\n" +
          "    networks:\n" +
          "      - default        # it is implicit that every service in this compose file joins this network \n" +
          "      - frontend_net   # this will be the network that connects caddy to all the apps\n" +
          "\n" +
          "  base:\n" +
          "    image: caddy:2\n" +
          '    command: ["caddy","file-server","--root","/usr/share/caddy","--listen",":80"]\n' +
          "    volumes:\n" +
          "      - ./apps/base-site/site:/usr/share/caddy:ro\n" +
          "    restart: unless-stopped\n" +
          "\n" +
          "  fxhash:\n" +
          "    image: caddy:2\n" +
          '    command: ["caddy","file-server","--root","/usr/share/caddy","--listen",":80"]\n' +
          "    volumes:\n" +
          "      - ./apps/fxhash/site:/usr/share/caddy:ro\n" +
          "    restart: unless-stopped\n" +
          "\n" +
          "volumes:\n" +
          "  caddy_data:\n" +
          "  caddy_config:\n" +
          "\n" +
          "networks:\n" +
          "  frontend_net:\n" +
          "    external: true"
        }
        expect={
          "Caddy is now on both networks: default (for base/fxhash) and frontend_net (for other apps)."
        }
        glenAdd={
          "So all services in the same yml file can communicate with each other using the default network. If all apps were in this file there would be no need for frontend_net. However, frontend_net can now be used in other compose files to ensure caddy can communicate with them."
        }
      />

      <Step
        n="4"
        title="Attach each app’s HTTP container to frontend_net"
        what="Apps join the shared public network so Caddy can reach them by name."
        why="Avoids exposing app ports on the host; keeps a single secure entry point (Caddy)."
        cmd={
          'version: "3.9"\n' +
          "services:\n" +
          "  web:\n" +
          "    image: ghcr.io/owner/my-frontend:latest\n" +
          "    container_name: my-frontend-web\n" +
          '    expose: ["8080"]\n' +
          "    networks: [frontend_net]\n" +
          "\n" +
          "networks:\n" +
          "  frontend_net:\n" +
          "    external: true"
        }
        expect={
          "Caddy can reverse_proxy my-frontend-web:8080 over frontend_net without opening host ports."
        }
      />

      <Step
        n="5"
        title="Keep databases on private per-app networks"
        what="Define an internal-only network in each app’s compose for DB/Redis/worker."
        why="Prevents other apps from seeing or connecting to your DBs."
        cmd={
          "services:\n" +
          "  api:\n" +
          "    image: ghcr.io/owner/my-api:latest\n" +
          '    expose: ["3000"]\n' +
          "    networks: [frontend_net, myapp_net]\n" +
          "    environment:\n" +
          "      DATABASE_URL: postgresql://user:pass@postgres:5432/appdb\n" +
          "\n" +
          "  postgres:\n" +
          "    image: postgres:16-alpine\n" +
          "    networks: [myapp_net]\n" +
          "    environment:\n" +
          "      POSTGRES_USER: user\n" +
          "      POSTGRES_PASSWORD: pass\n" +
          "      POSTGRES_DB: appdb\n" +
          "\n" +
          "networks:\n" +
          "  frontend_net:\n" +
          "    external: true\n" +
          "  myapp_net: {}"
        }
        expect={
          "API can reach Postgres over myapp_net, but other apps cannot. Caddy reaches API over frontend_net."
        }
      />

      <Divider sx={{ my: 2 }} />

      <Typography variant="body2" color="text.secondary">
        Summary: <b>frontend_net</b> is the shared road between Caddy and your
        HTTP apps. Each app gets its own <b>private network</b> for databases
        and workers. This keeps routing simple and your data isolated.
      </Typography>
    </Box>
  );
};

export default Section8_Networks;
