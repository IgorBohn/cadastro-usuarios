import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { Info, Error, Warning, CheckCircle } from "@mui/icons-material";

type AlertDialogProps = {
  open: boolean;
  title: string;
  description: string;
  type?: "error" | "warning" | "success" | "info";
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  hideCancel?: boolean;
};

const iconMap = {
  info: <Info color="info" />,
  error: <Error color="error" />,
  warning: <Warning color="warning" />,
  success: <CheckCircle color="success" />,
};

export const AlertDialog: React.FC<AlertDialogProps> = ({
  open,
  title,
  description,
  type = "info",
  onClose,
  onConfirm,
  confirmText = "OK",
  cancelText = "Cancelar",
  hideCancel = false,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          {iconMap[type]}
          <Typography variant="h6">{title}</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {!hideCancel && (
          <Button onClick={onClose} color="inherit">
            {cancelText}
          </Button>
        )}
        {onConfirm && (
          <Button
            onClick={onConfirm}
            color={type === "error" ? "error" : "primary"}
            variant="contained"
          >
            {confirmText}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
