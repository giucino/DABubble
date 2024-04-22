import { Component, inject } from '@angular/core';
import { MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login-snackbar',
  standalone: true,
  imports: [],
  templateUrl: './login-snackbar.component.html',
  styleUrl: './login-snackbar.component.scss'
})
export class LoginSnackbarComponent {
  snackBarRef = inject(MatSnackBarRef);
}
