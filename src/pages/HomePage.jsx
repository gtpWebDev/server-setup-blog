import { Box, Container, Button, Typography, Stack } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const PunkMainPage = ({ onAddTrades, onDeleteTrades }) => {
  return (
    <Box component="section" sx={{ py: { xs: 3, md: 5 } }}>
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Typography variant="h5" component="h1">
            Home Page
          </Typography>

          {/* Compact vertical nav list */}
          <Stack spacing={1} component="nav" aria-label="Primary punk tools">
            <Box
              sx={{
                p: 1.5,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1.5,
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                gap={1}
              >
                <Stack spacing={0.25}>
                  <Typography variant="subtitle1" component="h2">
                    Go to blog page
                  </Typography>
                </Stack>

                <Button
                  aria-label="Home"
                  component={RouterLink}
                  to="/blog"
                  color="secondary"
                  sx={{ fontSize: { xs: "small", md: "large" } }}
                >
                  Blog
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default PunkMainPage;
