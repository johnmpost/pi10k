import { usePiReducer } from "./piModel";

export const Pi = () => {
  const [state, dispatch] = usePiReducer();

  return (
    <>
      <div>{`mode: ${state.mode.kind}`}</div>
    </>
  );
};
