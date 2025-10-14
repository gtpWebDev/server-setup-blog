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
        <StepChip label={`A3.${n}`} />
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

const Section3_InstallDocker = () => {
  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: { xs: 2, sm: 3, md: 4 } }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        A3 — Install Docker (Engine, CLI & Compose)
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Turn the server into a clean, repeatable app platform using containers.
        Follow the steps exactly (Ubuntu 24.04 LTS).
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Step
        n="1"
        title="Remove any old Docker bits (safe if none present)"
        what="Clear out Ubuntu’s older docker packages if they exist."
        why="Avoid conflicts before installing from Docker’s official repo."
        cmd={`sudo apt remove -y docker docker-engine docker.io containerd runc || true`}
        expect={`Either 'not installed' or a quick removal; no errors needed to proceed.`}
      />

      <Step
        n="2"
        title="Install prerequisites"
        what="Tools for https repositories and managing keys."
        why="Required to add Docker’s official apt repository cleanly."
        cmd={`sudo apt update
sudo apt install -y ca-certificates curl gnupg`}
        expect={`Packages install successfully; no prompts beyond normal output.`}
      />

      <Step
        n="3"
        title="Add Docker’s official GPG key"
        what="Fetch and store Docker’s signing key in the system keyring."
        why="apt uses this key to verify Docker packages are authentic."
        cmd={`sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg`}
        expect={`A new file at /etc/apt/keyrings/docker.gpg; no errors.`}
      />

      <Step
        n="4"
        title="Add Docker’s apt repository"
        what="Tell apt where to get Docker packages."
        why="So we can install and update Docker from the official source."
        cmd={`echo \
"deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | \
sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update`}
        expect={`'Get:... download.docker.com ...' appears in apt update output.`}
      />

      <Step
        n="5"
        title="Install Docker Engine, CLI, containerd & Compose plugin"
        what="Core Docker runtime and tools."
        why="This is the actual container engine and the compose command."
        cmd={`sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin`}
        expect={`Packages install; systemd units created for docker and containerd.`}
      />

      <Step
        n="6"
        title="Enable and start Docker"
        what="Make Docker start now and on reboot."
        why="Containers should survive reboots without manual steps."
        cmd={`sudo systemctl enable --now docker
sudo systemctl status docker --no-pager`}
        expect={`Service active (running).`}
      />

      <Step
        n="7"
        title='Allow your user ("glen") to run docker without sudo'
        what="Add glen to the docker group."
        why="Quality of life; standard practice on single-host setups."
        cmd={`sudo usermod -aG docker glen
# Open a NEW SSH session to refresh group membership:
# (from your local machine)
# ssh glen@YOUR.SERVER.IP

# Then verify:
docker version
docker compose version`}
        expect={`Both commands work without sudo and print client/server versions.`}
      />

      <Step
        n="8"
        title="Quick test (hello-world)"
        what="Run a tiny container to confirm everything works."
        why="Proves networking, image pulls, and runtime are healthy."
        cmd={`docker run --rm hello-world`}
        expect={`A message explaining Docker works; container exits and cleans up.`}
      />

      <Divider sx={{ my: 2 }} />

      <Typography variant="body2" color="text.secondary">
        Result: Docker Engine is installed and enabled; your user can run Docker
        and Compose without sudo. Next we’ll create our project folders and
        bring up the reverse proxy and a hello app.
      </Typography>
    </Box>
  );
};

export default Section3_InstallDocker;
