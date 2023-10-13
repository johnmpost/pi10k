import { Sheet } from "@mui/joy";
import { usePiReducer } from "./piModel";
import { handleKeypress } from "./piKeypressHandler";

export const Pi = () => {
  const [state, dispatch] = usePiReducer();

  return (
    <div
      style={{ height: "100vh" }}
      onKeyDown={handleKeypress(state, dispatch)}
      tabIndex={-1}
    >
      <Sheet sx={{ height: "100%" }}>
        <pre style={{ margin: 0 }}>{`state: ${JSON.stringify(
          state,
          null,
          2
        )}`}</pre>
      </Sheet>
    </div>
  );
};
