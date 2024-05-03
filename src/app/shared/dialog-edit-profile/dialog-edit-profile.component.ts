import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../firebase.service/user.service';

@Component({
  selector: 'app-dialog-edit-profile',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './dialog-edit-profile.component.html',
  styleUrl: './dialog-edit-profile.component.scss',
})
export class DialogEditProfileComponent {
  constructor(public dialogRef: MatDialogRef<DialogEditProfileComponent>, public userService: UserService) {}


  saveUser() {
    this.dialogRef.close();
  }



}
