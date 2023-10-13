import { CssBaseline, CssVarsProvider } from "@mui/joy";
import { Pi } from "./Pi";

export const App = () => {
  return (
    <CssVarsProvider>
      <CssBaseline />
      <Pi></Pi>
    </CssVarsProvider>
  );
};
