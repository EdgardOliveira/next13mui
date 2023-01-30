import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { ReactNode } from "react";

interface IConfirmationDialogProps {
  id: string;
  title: string;
  children: ReactNode;
  classes?: Record<"paper", string>;
  keepMounted: boolean;
  open: boolean;
  cancelButtonText?: string;
  confirmButtonText?: string;
  onClose: (value?: string) => void;
}

export default function ConfirmationDialog(props: IConfirmationDialogProps) {
  const {
    children,
    open,
    title,
    cancelButtonText,
    confirmButtonText,
    onClose,
    ...other
  } = props;

  const handleCancel = () => {
    onClose("cancel");
  };

  const handleOk = () => {
    onClose("ok");
  };

  return (
    <Dialog
      //   disableBackdropClick
      disableEscapeKeyDown
      maxWidth="xs"
      aria-labelledby="confirmation-dialog-title"
      open={open}
      //   TransitionComponent={Transition}
      {...other}
    >
      <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel} color="primary">
          {cancelButtonText || "Cancelar"}
        </Button>
        <Button onClick={handleOk} color="primary">
          {confirmButtonText || "Ok"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
