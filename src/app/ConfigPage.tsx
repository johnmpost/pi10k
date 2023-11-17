import {
  Box,
  Button,
  Grid,
  IconButton,
  Input,
  Sheet,
  Stack,
  Switch,
  Typography,
} from "@mui/joy";
import { Link as RouterLink } from "react-router-dom";
import { useGlobalInvoke, useGlobalState } from "./globalState";
import { flow, pipe } from "fp-ts/lib/function";
import {
  NonNegativeInt,
  PositiveInt,
  curry2,
  doNothing,
  getTargetChecked,
  getTargetValue,
  isNonNegativeInt,
  isPositiveInt,
  updateProperty,
} from "./pureUtils";
import { useState } from "react";
import { Config } from "./types";
import { O } from "../exports";
import { sequenceS } from "fp-ts/lib/Apply";
import { not } from "fp-ts/lib/Predicate";
import { eqConfig } from "./typeUtils";
import { Home } from "@mui/icons-material";

type Form = {
  showExtraDigitsCount: string;
  quizLives: string;
  showPreviousDigits: boolean;
};

const formToConfig = (form: Form): O.Option<Config> =>
  sequenceS(O.Applicative)({
    showExtraDigitsCount: pipe(
      form.showExtraDigitsCount,
      parseFloat,
      NonNegativeInt.decode,
      O.fromEither
    ),
    quizLives: pipe(
      form.quizLives,
      parseFloat,
      PositiveInt.decode,
      O.fromEither
    ),
    showPreviousDigits: O.some(form.showPreviousDigits),
  });

const configToForm = (config: Config) => ({
  showExtraDigitsCount: config.showExtraDigitsCount.toString(),
  quizLives: config.quizLives.toString(),
  showPreviousDigits: config.showPreviousDigits,
});

export const ConfigPage = () => {
  const { config } = useGlobalState();
  const invoke = useGlobalInvoke();
  const [form, setForm] = useState<Form>(configToForm(config));

  const updateField = updateProperty(setForm);

  const formIsChangedAndValid = pipe(
    form,
    formToConfig,
    O.map(not(curry2(eqConfig.equals)(config))),
    O.getOrElse(() => false)
  );

  return (
    <Sheet sx={{ height: "100vh", padding: 1 }}>
      <Stack
        paddingBottom={2}
        direction="row-reverse"
        alignItems="center"
        justifyContent="space-between"
      >
        <IconButton size="lg" component={RouterLink} to="/">
          <Home />
        </IconButton>
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
              error={!isNonNegativeInt(form.showExtraDigitsCount)}
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
              error={!isPositiveInt(form.quizLives)}
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
          <Grid xs={6} mt={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setForm(configToForm(config))}
            >
              Reset
            </Button>
          </Grid>
          <Grid xs={6} mt={2}>
            <Button
              fullWidth
              disabled={!formIsChangedAndValid}
              onClick={() =>
                pipe(
                  form,
                  formToConfig,
                  O.fold(doNothing, (newConfig) =>
                    invoke({ kind: "setConfig", newConfig })
                  )
                )
              }
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Sheet>
  );
};
