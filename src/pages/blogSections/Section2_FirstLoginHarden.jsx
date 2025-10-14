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

const Step = ({ n, title, what, why, cmd, expect, glenAdd = `` }) => (
  <Card variant="outlined" sx={{ mb: 2 }}>
    <CardContent>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
        <StepChip label={`A2.${n}`} />
        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
          {title}
        </Typography>
      </Stack>

      {what && (
        <Typography variant="body2" sx={{ mt: 0.5 }}>
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

const Section2_FirstLoginHarden = () => {
  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: { xs: 2, sm: 3, md: 4 } }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        A2.1 — First Login & First Level Server Protection
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Create a non-root admin user, patch the system, enable a simple
        firewall, protect SSH, and set the timezone. Copy–paste step by step.
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Step
        n="1"
        title="SSH in as root"
        what="Open your first session on the server."
        why="We need root access to create your real user."
        cmd={`ssh root@YOUR.SERVER.IP`}
        expect={`A prompt like: root@gtpwebdev-apps:~#`}
        glenAdd={`This method of logging into the root will be irrelevant soon. `}
      />

      <Step
        n="2"
        title='Create user "glen" and grant sudo'
        what="Add a non-root admin account."
        why="Daily admin via sudo is safer and auditable."
        cmd={`adduser glen
usermod -aG sudo glen`}
        expect={`User added; 'glen' is now in the sudo group.`}
      />

      <Step
        n="3"
        title="Install your SSH key for glen"
        what="Allow key-based login for the new user."
        why="We will disable password logins next."
        cmd={`install -d -m 700 /home/glen/.ssh
cp /root/.ssh/authorized_keys /home/glen/.ssh/
chown -R glen:glen /home/glen/.ssh
chmod 600 /home/glen/.ssh/authorized_keys`}
        expect={`No errors. /home/glen/.ssh/authorized_keys exists.`}
        glenAdd={`Following this it's possible to login as ssh glen@YOUR.SERVER.IP`}
      />

      <Step
        n="4"
        title="Update packages & add security tools"
        what="Patch the system and enable automatic security updates."
        why="Start from a secure, current baseline."
        cmd={`apt update && apt upgrade -y
apt install -y ufw fail2ban unattended-upgrades
dpkg-reconfigure --priority=low unattended-upgrades`}
        expect={`Packages upgraded; unattended-upgrades enabled.`}
        glenAdd={`ufw is a simple firewall, fail2ban watches logins`}
      />

      <Step
        n="5"
        title="Set timezone"
        what="Match server logs to your local time."
        why="Cleaner debugging and audit trails."
        cmd={`timedatectl set-timezone Europe/London
timedatectl`}
        expect={`Time zone: Europe/London`}
      />

      <Step
        n="6"
        title="Enable firewall (UFW)"
        what="Open only the ports we need now."
        why="Reduce attack surface from day one."
        cmd={`ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw limit OpenSSH
ufw --force enable
ufw status verbose`}
        expect={`Status: active; rules for 22, 80, 443 present (OpenSSH rate-limited).`}
        glenAdd={`This configures the firewall to allow web traffic and secure SSH access and then enables it. The SSH service will now be e.g. 192.168.1.10:22 - this is the secure shell through which I communicate remotely with the server; the Web Server (HTTP) will be 192.168.1.10:80 - used by web servers such as node.js; the secure web server e.g. 192.168.1.10.443 - for encrypted web traffic with SSL/TLS certificates using https.`}
      />

      <Step
        n="7"
        title="Enable Fail2ban for SSH"
        what="Auto-ban repeated failed logins."
        why="Adds protection beyond UFW rate limits."
        cmd={`Copy the fail2ban config to a local file which preseves the .conf file but takes priority:
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

Edit the .local file:
sudo nano /etc/fail2ban/jail.local

Replace the [sshd] section with:
          
[sshd]
enabled   = true
port      = ssh
backend   = systemd
banaction = ufw
maxretry  = 5
findtime  = 10m
bantime   = 1h

Save the changes, and restart fil2ban:
sudo systemctl restart fail2ban`}
        expect={`fail2ban-server active (running).`}
        glenAdd={`fail2ban works with the firewall to stop suspicious behaviour such as repeated attempts to login.`}
      />

      <Step
        n="8"
        title="Lock down SSH"
        what="Disable password auth and root SSH."
        why="Force key-only auth; root is a common attack target."
        cmd={`sed -i 's/^#\\?PasswordAuthentication .*/PasswordAuthentication no/' /etc/ssh/sshd_config
sed -i 's/^#\\?PermitRootLogin .*/PermitRootLogin no/' /etc/ssh/sshd_config
systemctl reload ssh`}
        expect={`No output; SSH daemon reloaded.`}
        glenAdd={`IMPORTANT: check that your user login works before doing this or it could lockout access entirely.`}
      />

      <Step
        n="9"
        title='Test login as "glen" (keep root session open)'
        what="Verify you can log in before closing root."
        why="Safety in case of typos or key issues."
        cmd={`# On your computer, in a NEW terminal
ssh glen@YOUR.SERVER.IP`}
        expect={`Prompt like: glen@gtpwebdev-apps:~$  → then you can close the root session.`}
      />

      <Divider sx={{ my: 2 }} />

      <Typography variant="body2" color="text.secondary">
        Result: non-root sudo user, automatic security updates, UFW (22/80/443)
        with SSH rate-limit, Fail2ban active, password logins disabled, root SSH
        disabled, timezone set to Europe/London. Ready for A3 — Docker.
      </Typography>
    </Box>
  );
};

export default Section2_FirstLoginHarden;
