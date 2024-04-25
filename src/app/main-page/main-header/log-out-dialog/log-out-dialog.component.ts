import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef} from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-log-out-dialog',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './log-out-dialog.component.html',
  styleUrl: './log-out-dialog.component.scss'
})
export class LogOutDialogComponent {
  @Output() showProfileClicked = new EventEmitter<void>();

  constructor(public dialogRef: MatDialogRef<LogOutDialogComponent>) {}

  // onNoClick(): void {
  //   this.dialogRef.close();
  //   console.log('Dialog closed'); 
  // }

  openCurrentUser(): void {
    this.showProfileClicked.emit();
    console.log('aktueller User', this.showProfileClicked);
    this.dialogRef.close();
  }

  logOut(): void {
    console.log('Log out');
    this.dialogRef.close();
  }
}
