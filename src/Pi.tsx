import { Sheet } from "@mui/joy";
import { usePiReducer } from "./piModel";

export const Pi = () => {
  const [state, dispatch] = usePiReducer();

  return (
    <Sheet sx={{ height: "100vh", marginTop: "0px" }}>
      <pre style={{ margin: 0 }}>{`state: ${JSON.stringify(
        state,
        null,
        2
      )}`}</pre>
    </Sheet>
  );
};
