import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const SnackbarAlert = ({ open, onClose, message }) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={onClose}
        >
            <Alert onClose={onClose} severity="success">
                {message}
            </Alert>
        </Snackbar>
    );
};

export default SnackbarAlert;
