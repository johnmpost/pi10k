import { useColorScheme } from "@mui/joy/styles";
import { IconButton } from "@mui/joy";
import { DarkMode, LightMode } from "@mui/icons-material";

export function ModeToggle() {
  const { mode, setMode: setJoyMode } = useColorScheme();

  return (
    <IconButton
      variant="plain"
      size="lg"
      color="neutral"
      onClick={() => {
        setJoyMode(mode === "dark" ? "light" : "dark");
      }}
    >
      {mode === "dark" ? <DarkMode /> : <LightMode />}
    </IconButton>
  );
}
