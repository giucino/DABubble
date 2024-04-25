import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogContent,
  MatDialogActions,
  MatDialogRef,
  MatDialogModule,
  MatDialog
} from '@angular/material/dialog';

@Component({
  selector: 'app-add-channel-card',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogModule
  ],
  templateUrl: './add-channel-card.component.html',
  styleUrl: './add-channel-card.component.scss',
})
export class AddChannelCardComponent {
  constructor(public dialogRef: MatDialogRef<AddChannelCardComponent>,
    public dialog: MatDialog,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
    console.log('Dialog closed');
  }

  createChannel() {
    console.log('Channel created');
    this.dialogRef.close();
  }
}
