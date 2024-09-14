import * as React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

const options = [
  "CELEBRITIES",
  "FOOD CHAINS",
  "HISTORICAL PEOPLE",
  "MOVIES",
  "SHOWS",
  "MUSICIANS",
  "ATHLETES",
  "ANIMALS",
  "LOCATIONS",
  "CUSTOM",
  "RANDOM"
];

export default function CategoryDropDown({ onSelect }: { onSelect: (category: string) => void }) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const open = Boolean(anchorEl);

  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);  
  };

  const handleMenuItemClick = (event: React.MouseEvent<HTMLElement>, index: number) => {
    setSelectedIndex(index);
    setAnchorEl(null);
    onSelect(options[index]);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <List component="nav" aria-label="Device settings">
        <ListItemButton
          id="lock-button"
          aria-haspopup="listbox"
          aria-controls="lock-menu"
          aria-label="when device is locked"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClickListItem}
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '400px',
            margin: '0 auto',
            backgroundColor: 'rgba(224, 78, 78)',
            borderRadius: '0.5rem',
            border: '0.1rem solid black',
            boxShadow: '0 0 0.5rem 0.1rem rgba(0, 0, 0, 0.2)',
            '&:hover': { backgroundColor: 'rgba(224, 78, 78, 0.5)' },
          }}
        >
          <ListItemText
            primary="CATEGORY:"
            secondary={options[selectedIndex]}
            sx={{
              '& .MuiListItemText-primary': {
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.5rem',
                textAlign: 'center',
              },
              '& .MuiListItemText-secondary': {
                color: 'white',
                fontWeight: 'bold',
                textAlign: 'center',
              },
            }}
          />
        </ListItemButton>
      </List>
      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'lock-button',
          role: 'listbox',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: '#E04E4E',
            width: '400px', 
            border: '1px solid black',
          },
        }}
      >
        {options.map((option, index) => (
          <MenuItem
            key={option}
            selected={index === selectedIndex}
            onClick={(event) => handleMenuItemClick(event, index)}
            sx={{
              width: '100%', 
              backgroundColor: index === selectedIndex ? 'darkred' : 'transparent',  
              color: 'white', 
              '&:hover': { backgroundColor: index === selectedIndex ? 'darkred' : 'rgba(255, 255, 255, 0.2)' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
            }}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}