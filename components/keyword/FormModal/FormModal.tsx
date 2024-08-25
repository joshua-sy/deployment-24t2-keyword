import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import RedButton from '../redButton/RedButton';

interface FormModalProps {
    onSubmit: (roomCode: string, name: string) => void;
}

export default function FormModal({ onSubmit }: FormModalProps) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const code = formJson.code as string;
    const name = formJson.name as string;

    // Call the callback function with the room code and name
    onSubmit(code, name);

    handleClose();
  };

  return (
    <React.Fragment>
        <RedButton onClick={handleClickOpen} label={"JOIN ROOM"}/>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: handleSubmit
        }}
      >
        <DialogContent>
          <DialogContentText>
            Enter Room Code
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="code"
            name="code"
            label="Room Code"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogContent>
          <DialogContentText>
            Enter Name
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Name"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClickOpen} type="submit">JOIN</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}