import { CssBaseline, CssVarsProvider } from "@mui/joy";
import { Pi } from "./app/Pi";

export const App = () => {
  return (
    <CssVarsProvider defaultMode="dark">
      <CssBaseline />
      <Pi></Pi>
    </CssVarsProvider>
  );
};
