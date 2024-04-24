import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-add-member',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './dialog-add-member.component.html',
  styleUrl: './dialog-add-member.component.scss'
})
export class DialogAddMemberComponent {

  constructor(public dialogRef : MatDialogRef<DialogAddMemberComponent>) {
    
  }

}
