import { CssBaseline, CssVarsProvider } from "@mui/joy";
import { Pi } from "./app/PiDisplay";
import { GlobalStateProvider } from "./app/globalState";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ErrorPage } from "./app/ErrorPage";

const router = createBrowserRouter([
  { path: "/", element: <Pi></Pi>, errorElement: <ErrorPage /> },
  { path: "config", element: <div>config page</div> },
]);

export const App = () => {
  return (
    <GlobalStateProvider>
      <CssVarsProvider defaultMode="dark">
        <CssBaseline />
        <RouterProvider router={router} />
      </CssVarsProvider>
    </GlobalStateProvider>
  );
};
