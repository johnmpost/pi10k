import { Stack, Typography } from "@mui/joy";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export const ErrorPage = () => {
  const error = useRouteError();
  const errorMessage = isRouteErrorResponse(error)
    ? error.status === 404
      ? "404 Not Found. This page does not exist."
      : `${error.status} ${error.statusText}`
    : "Unknown Error";

  return (
    <Stack direction="column" alignItems="center" spacing={2} padding={2}>
      <Typography level="h1">Oops!</Typography>
      <Typography>{errorMessage}</Typography>
    </Stack>
  );
};
