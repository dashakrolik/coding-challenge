import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';

export const baseUrl = 'http://localhost:8080/api/v1.0';

export const MatDialogProvider = {
    provide: MAT_DIALOG_DEFAULT_OPTIONS,
    useValue: { hasBackdrop: false }
};
