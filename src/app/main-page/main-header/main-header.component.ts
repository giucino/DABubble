import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { LogOutDialogComponent } from './log-out-dialog/log-out-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-main-header',
  standalone: true,
  imports: [CommonModule, MatCardModule, SearchBarComponent],
  templateUrl: './main-header.component.html',
  styleUrl: './main-header.component.scss'
})
export class MainHeaderComponent {

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    console.log('Opening dialog');
    const dialogRef = this.dialog.open(LogOutDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

}
