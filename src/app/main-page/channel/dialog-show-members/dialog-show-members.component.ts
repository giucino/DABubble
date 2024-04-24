import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-show-members',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './dialog-show-members.component.html',
  styleUrl: './dialog-show-members.component.scss'
})
export class DialogShowMembersComponent {

  constructor(public dialogRef : MatDialogRef<DialogShowMembersComponent>) {
    
  }

}
