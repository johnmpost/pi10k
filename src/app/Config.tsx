import {
  Box,
  Checkbox,
  Grid,
  Input,
  Link,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import { Link as RouterLink } from "react-router-dom";

export const Config = () => {
  return (
    <Sheet sx={{ height: "100vh", padding: 1 }}>
      <Stack
        paddingBottom={2}
        direction="row-reverse"
        justifyContent="space-between"
      >
        <Link
          variant="plain"
          underline="none"
          level="title-lg"
          component={RouterLink}
          to="/"
          paddingX={2}
          marginRight="0px"
        >
          Home
        </Link>
        <Typography level="h1">Config</Typography>
      </Stack>
      <Box maxWidth={500} mx="auto">
        <Grid container spacing={1}>
          <Grid xs={8}>
            <Typography level="h4">Number of Extra Digits to Show</Typography>
          </Grid>
          <Grid xs={4}>
            <Input type="number" />
          </Grid>
          <Grid xs={8}>
            <Typography level="h4">Quiz Lives</Typography>
          </Grid>
          <Grid xs={4}>
            <Input type="number" />
          </Grid>
          <Grid xs={8}>
            <Typography level="h4">Show Previous Digits</Typography>
          </Grid>
          <Grid xs={4}>
            <Stack height="100%" direction="row" alignItems="center">
              <Checkbox size="lg" />
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Sheet>
  );
};
