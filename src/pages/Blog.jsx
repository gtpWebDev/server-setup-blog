import React from "react";
import {
  AppBar,
  Box,
  Container,
  Divider,
  Grid,
  Link as MUILink,
  List,
  ListItemButton,
  Toolbar,
  Typography,
} from "@mui/material";

import {
  Section1_ServerCreation,
  Section2_FirstLoginHarden,
  Section3_InstallDocker,
} from "./blogSections";

const sections = [
  {
    id: "stage-a1",
    title: "Stage A1 - Server Creation",
    content: <Section1_ServerCreation />,
  },
  {
    id: "stage-a2",
    title: "Stage A2 - First Login & Harden",
    content: <Section2_FirstLoginHarden />,
  },
  {
    id: "stage-a3",
    title: "Stage A3 - Install Docker",
    content: <Section3_InstallDocker />,
  },
];

const SectionStructure = ({ id, section }) => {
  return (
    <Box id={id} sx={{ scrollMarginTop: 96 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        {section.title}
      </Typography>
      <Box>{section.content}</Box>
      <Divider sx={{ mt: 2 }} />
    </Box>
  );
};

const BlogPage = () => {
  return (
    <BlogPageContent sections={sections}>
      {sections.map((section, index) => (
        <SectionStructure key={index} id={section.id} section={section} />
      ))}
    </BlogPageContent>
  );
};

const BlogPageContent = ({ sections = [], children }) => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <AppBar color="default" elevation={0} position="sticky">
          <Toolbar>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              How to set up a server from scratch
            </Typography>
          </Toolbar>
        </AppBar>

        <Grid container spacing={3} sx={{ mt: 3 }}>
          {/* Sidebar / TOC */}
          <Grid size={2}>
            <Box
              sx={{
                position: { md: "sticky" },
                top: { md: 88 },
                p: 2,
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <Typography variant="overline" color="text.secondary">
                Contents
              </Typography>
              <Divider sx={{ my: 1 }} />
              <List dense disablePadding>
                {sections.map((s) => (
                  <ListItemButton
                    key={s.id}
                    component={MUILink}
                    href={`#${s.id}`}
                    underline="hover"
                  >
                    <Typography variant="body2">{s.title}</Typography>
                  </ListItemButton>
                ))}
                {sections.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    Add section links via the <code>sections</code> prop.
                  </Typography>
                )}
              </List>
            </Box>
          </Grid>

          {/* Main Content */}
          <Grid size={10}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {children}
            </Box>
          </Grid>
        </Grid>

        <Box
          component="footer"
          sx={{ py: 4, borderTop: 1, borderColor: "divider" }}
        >
          <Container maxWidth="lg">
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} — Server Setup Blog
            </Typography>
          </Container>
        </Box>
      </Box>
    </Container>
  );
};

export default BlogPage;
