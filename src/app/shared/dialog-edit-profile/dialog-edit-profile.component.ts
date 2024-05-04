import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../firebase.service/user.service';
import { UserAuthService } from '../../firebase.service/user.auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dialog-edit-profile',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule],
  templateUrl: './dialog-edit-profile.component.html',
  styleUrl: './dialog-edit-profile.component.scss',
})
export class DialogEditProfileComponent implements OnInit {
  editableName?: string;
  editableEmail?: string;

  constructor(
    public dialogRef: MatDialogRef<DialogEditProfileComponent>,
    public userService: UserService,
    public userAuth: UserAuthService
  ) {}

  ngOnInit(): void {
    this.editableName = this.userService.currentUser.name;
    this.editableEmail = this.userService.currentUser.email;
  }

  saveEditedUser(): void {
    this.dialogRef.close();
  }
}
