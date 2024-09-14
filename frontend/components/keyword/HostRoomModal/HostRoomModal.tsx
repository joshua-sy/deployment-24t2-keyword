import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import RedButton from '../redButton/RedButton';
import { relative } from 'path';

interface FormModalProps {
    onSubmit: (name: string) => void;
}

export default function HostRoomModal({ onSubmit }: FormModalProps) {
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
    const name = formJson.name as string;

    // Call the callback function with the name
    onSubmit(name);

    handleClose();
  };

  return (
    <React.Fragment>
        <RedButton onClick={handleClickOpen} label={"HOST ROOM"}/>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: handleSubmit
        }}
      >
        <DialogContent style = {{position: "relative", top: "8px"}}>
          <DialogContentText style = {{textAlign: "center"}}>
            Enter Name
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            placeholder="Scientist"
            fullWidth

          />
        </DialogContent>
        <DialogActions>
        <Button 
              onClick={handleClose}
              style={{ 
                position: 'absolute',
                top: '8px',
                right: '8px',
                minWidth: '30px', 
                padding: '0', 
                fontSize: '16px', 
                color: 'black', 
                backgroundColor: 'transparent' 
              }}
            >
              X
            </Button>

          <Button onClick={handleClickOpen} type="submit" style = {{right: '4px', color: 'white', backgroundColor: '#E04E4E', justifyContent: 'center', position: 'relative', bottom: 0, width: '100%'}}>HOST</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}