import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import RedButton from '../redButton/RedButton';



export default function LoadingModal() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
      {/* Modal Content */}
      <div className="flex flex-col items-center bg-white px-36 py-36">
        {/* Spinner */}
        <div className="animate-spin rounded-full h-24 w-24 border-t-8 border-figma-red border-solid"></div>
        {/* Loading Text */}
        <p className="mt-4 text-black text-lg font-semibold">Loading Memory ...</p>
        <p className="mt-4 text-black text-lg font-semibold">If you are a Cyborg</p>

      </div>
    </div>
  );
}