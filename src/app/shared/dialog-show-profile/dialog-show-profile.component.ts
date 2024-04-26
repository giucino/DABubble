import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ProfileService } from '../../services/profile.service';
import { DialogEditProfileComponent } from '../../shared/dialog-edit-profile/dialog-edit-profile.component';
import { CustomDialogService } from '../../services/custom-dialog.service';

@Component({
  selector: 'app-dialog-show-profile',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './dialog-show-profile.component.html',
  styleUrl: './dialog-show-profile.component.scss',
})
export class DialogShowProfileComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogShowProfileComponent>,
    private profileService: ProfileService,
    private customDialogService: CustomDialogService,

  ) {}

  isOwnProfile(): boolean {
    return this.profileService.getOwnProfileStatus();
  }

  editCurrentUser(button: HTMLElement) {
    const component = DialogEditProfileComponent;
    this.customDialogService.openDialogAbsolute(button, component, 'right');    
    this.dialogRef.close();
  }
}
