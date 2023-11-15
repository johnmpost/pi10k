import { CssBaseline, CssVarsProvider } from "@mui/joy";
import { Pi } from "./app/PiDisplay";
import { GlobalStateProvider } from "./app/GlobalStateProvider";

export const App = () => {
  return (
    <GlobalStateProvider>
      <CssVarsProvider defaultMode="dark">
        <CssBaseline />
        <Pi></Pi>
      </CssVarsProvider>
    </GlobalStateProvider>
  );
};
