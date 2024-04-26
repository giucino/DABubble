import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogShowProfileComponent } from '../../../shared/dialog-show-profile/dialog-show-profile.component';
import { CustomDialogService } from '../../../services/custom-dialog.service';
import { ProfileService } from '../../../services/profile.service';

@Component({
  selector: 'app-log-out-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './log-out-dialog.component.html',
  styleUrl: './log-out-dialog.component.scss',
})
export class LogOutDialogComponent {
  @Output() showProfileClicked = new EventEmitter<void>();

  constructor(
    public dialogRef: MatDialogRef<LogOutDialogComponent>,
    private customDialogService: CustomDialogService,
    private profileService: ProfileService
  ) {}

  openCurrentUser(button: HTMLElement) {
    this.profileService.setOwnProfileStatus(true); 
    const component = DialogShowProfileComponent;
    this.customDialogService.openDialogAbsolute(button, component, 'right');    
    this.showProfileClicked.emit();
    console.log('aktueller User', this.showProfileClicked);
    this.dialogRef.close();
  }

  logOut(): void {
    console.log('Log out');
    this.dialogRef.close();
  }
}
