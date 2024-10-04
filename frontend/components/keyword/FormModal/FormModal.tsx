import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import RedButton from '../redButton/RedButton';
import { Box } from '@/node_modules/@mui/material/index';

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
    onSubmit(code.toUpperCase(), name.toUpperCase());

    handleClose();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.value = event.target.value.toUpperCase();
  };

  return (
    <React.Fragment>
      <RedButton onClick={handleClickOpen} label={"JOIN ROOM"} />
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: handleSubmit,
          style: {backgroundColor : "white", color: "black", borderRadius: "10px"}
        }}
      >
        <DialogContent style = {{position: "relative", top: "18px",}}>
          <DialogContentText style = {{textAlign: 'center'}}>
            Enter Room Code
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="code"
            name="code"
            placeholder = "1234"
            fullWidth
            inputProps={{ style: { textTransform: 'uppercase' }}}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogContent>
          <DialogContentText style = {{textAlign: 'center'}}>
            Enter Name
          </DialogContentText>

          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            fullWidth
            placeholder="Scientist"
            type = "text"
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
          <Button onClick={handleClickOpen} type="submit" 
          style = {
            {right: '4px',
             color: 'white',
              backgroundColor: "#E04E4E",
               justifyContent: 'center',
                position: 'relative',
                 bottom: 0,
                  width: '100%'}}>
            JOIN
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}