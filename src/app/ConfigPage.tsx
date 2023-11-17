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
import { getTargetChecked, getTargetValue, updateProperty } from "./pureUtils";
import { useState } from "react";

export const ConfigPage = () => {
  const { config } = useGlobalState();
  const invoke = useGlobalInvoke();
  const [form, setForm] = useState({
    showExtraDigitsCount: config.showExtraDigitsCount.toString(),
    quizLives: config.quizLives.toString(),
    showPreviousDigits: config.showPreviousDigits,
  });

  const updateField = updateProperty(setForm);

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
            <Input
              type="number"
              value={form.showExtraDigitsCount}
              onChange={flow(
                getTargetValue,
                updateField("showExtraDigitsCount")
              )}
            />
          </Grid>
          <Grid xs={8}>
            <Typography level="h4">Quiz Lives</Typography>
          </Grid>
          <Grid xs={4}>
            <Input
              type="number"
              value={form.quizLives}
              onChange={flow(getTargetValue, updateField("quizLives"))}
            />
          </Grid>
          <Grid xs={8}>
            <Typography level="h4">Show Previous Digits</Typography>
          </Grid>
          <Grid xs={4}>
            <Stack height="100%" direction="row" alignItems="center">
              <Switch
                size="lg"
                checked={form.showPreviousDigits}
                onChange={flow(
                  getTargetChecked,
                  updateField("showPreviousDigits")
                )}
              />
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Sheet>
  );
};
