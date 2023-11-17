import {
  Box,
  Grid,
  Input,
  Link,
  Sheet,
  Stack,
  Switch,
  Typography,
} from "@mui/joy";
import { Link as RouterLink } from "react-router-dom";
import { useGlobalInvoke, useGlobalState } from "./globalState";
import { flow } from "fp-ts/lib/function";
import { getTargetChecked } from "./pureUtils";
import { Config, GlobalAction } from "./types";

export const ConfigPage = () => {
  const { config } = useGlobalState();
  const invoke = useGlobalInvoke();

  const updateProperty =
    (invoke: (action: GlobalAction) => void) =>
    <K extends keyof Config>(key: K) =>
    (newValue: Config[K]) =>
      invoke({
        kind: "setConfig",
        newConfig: { ...config, [key]: newValue },
      });
  const test = updateProperty(invoke);

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
              <Switch
                size="lg"
                checked={config.showPreviousDigits}
                onChange={flow(getTargetChecked, test("showPreviousDigits"))}
              />
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Sheet>
  );
};
