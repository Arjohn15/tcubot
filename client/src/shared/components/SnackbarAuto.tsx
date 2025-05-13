import { Alert, Snackbar, SnackbarCloseReason } from "@mui/material";
import { FC } from "react";

export type severity_type = "info" | "success" | "error";

interface SnackbarAutoProps {
  onClose: () => void;
  isOpen: boolean;
  message: string;
  severity: severity_type;
}

const SnackbarAuto: FC<SnackbarAutoProps> = ({
  onClose,
  isOpen,
  message,
  severity,
}) => {
  const handleCloseSnackBar = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    onClose();
  };
  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={5000}
      onClose={handleCloseSnackBar}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <Alert severity={severity} variant="filled" sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarAuto;
