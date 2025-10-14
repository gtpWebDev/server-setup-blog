import { Box, Container, Typography, Link } from "@mui/material";
import XIcon from "@mui/icons-material/X";

import { LINKS, COMPANY_NAME } from "../../constants/siteConstants"; // Import the constants file

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        marginTop: "auto", // Ensures footer stays at the bottom when content is short
        paddingY: { xs: 2, md: 4 },
        textAlign: "center",
        fontFamily: "'Bangers', cursive",
        boxShadow: "0 -4px 10px rgba(0, 0, 0, 0.3)",
        backgroundColor: "background.paper",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: { xs: 1, md: 3 },
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Link href={LINKS.twitter} target="_blank" color="secondary.main">
            <XIcon sx={{ fontSize: { xs: "1.3rem", md: "2rem" } }} />{" "}
          </Link>
        </Box>

        {/* Copyright Text */}
        <Typography
          variant="body2"
          sx={{
            marginTop: 2,
            color: "secondary.main",
            fontSize: { xs: "0.75rem", md: "1rem" },
          }}
        >
          &copy; {new Date().getFullYear()} {COMPANY_NAME} | All Rights Reserved
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
