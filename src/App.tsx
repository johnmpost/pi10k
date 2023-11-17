import { CssBaseline, CssVarsProvider } from "@mui/joy";
import { Pi } from "./app/PiDisplay";
import { GlobalReactogenProvider } from "./app/globalState";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ErrorPage } from "./app/ErrorPage";
import { ConfigPage } from "./app/ConfigPage";

const router = createBrowserRouter([
  { path: "/", element: <Pi></Pi>, errorElement: <ErrorPage /> },
  { path: "config", element: <ConfigPage /> },
]);

export const App = () => {
  return (
    <GlobalReactogenProvider>
      <CssVarsProvider defaultMode="dark">
        <CssBaseline />
        <RouterProvider router={router} />
      </CssVarsProvider>
    </GlobalReactogenProvider>
  );
};
