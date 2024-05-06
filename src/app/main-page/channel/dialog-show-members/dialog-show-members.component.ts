import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../firebase.service/user.service';
import { User } from '../../../interfaces/user.interface';

@Component({
  selector: 'app-dialog-show-members',
  standalone: true,
  imports: [MatDialogModule, FormsModule],
  templateUrl: './dialog-show-members.component.html',
  styleUrl: './dialog-show-members.component.scss',
})
export class DialogShowMembersComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogShowMembersComponent>,
    public userService: UserService
  ) {}
}
