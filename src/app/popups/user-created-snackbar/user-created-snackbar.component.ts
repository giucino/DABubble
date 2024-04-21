import { Component, inject } from '@angular/core';
import { MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-created-snackbar',
  standalone: true,
  imports: [],
  templateUrl: './user-created-snackbar.component.html',
  styleUrl: './user-created-snackbar.component.scss'
})
export class UserCreatedSnackbarComponent {
  snackBarRef = inject(MatSnackBarRef);
}
