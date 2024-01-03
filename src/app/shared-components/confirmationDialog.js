import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

function ConfirmationDialog({ open, title, message, onCancel, onConfirm }) {
    return (
        <Dialog open={open} onClose={onCancel}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>{message}</DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>Cancelar</Button>
                <Button onClick={onConfirm} color="error">
                    Eliminar
                </Button>
            </DialogActions>
        </Dialog>
    );
}

ConfirmationDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
};

export default ConfirmationDialog;