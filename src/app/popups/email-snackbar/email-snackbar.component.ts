import { Component, inject } from '@angular/core';
import { MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-email-snackbar',
  standalone: true,
  imports: [],
  templateUrl: './email-snackbar.component.html',
  styleUrl: './email-snackbar.component.scss'
})
export class EmailSnackbarComponent {
  snackBarRef = inject(MatSnackBarRef);
}
