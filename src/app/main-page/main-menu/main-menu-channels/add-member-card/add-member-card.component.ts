import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {
  MatRadioModule,
  MAT_RADIO_DEFAULT_OPTIONS,
} from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../firebase.service/user.service';
import { User } from '../../../../interfaces/user.interface';
import { ChannelFirebaseService } from '../../../../firebase.service/channelFirebase.service';
import { UserManagementService } from '../../../../services/user-management.service';
import { CustomDialogService } from '../../../../services/custom-dialog.service';
import { ProfileService } from '../../../../services/profile.service';
import { DialogShowProfileComponent } from '../../../../shared/dialog-show-profile/dialog-show-profile.component';

@Component({
  selector: 'app-add-member-card',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatRadioModule, FormsModule],
  providers: [
    { provide: MAT_RADIO_DEFAULT_OPTIONS, useValue: { color: 'primary' } },
  ],
  templateUrl: './add-member-card.component.html',
  styleUrl: './add-member-card.component.scss',
})
export class AddMemberCardComponent {
  selectedOption: string = 'all';
  searchInput: string = '';
  filteredUsers: User[] = [];
  selectedUsers: User[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddMemberCardComponent>,
    public userService: UserService,
    public channelService: ChannelFirebaseService,
    public userManagementService: UserManagementService,
    public customDialogService: CustomDialogService,
    private profileService: ProfileService
  ) {}

  onFilterUsers(): void {
    this.filteredUsers = this.userManagementService.filterUsers(this.searchInput, this.selectedUsers);
  }

  onSelectUser(user: User): void {
    this.selectedUsers = this.userManagementService.selectUser(this.selectedUsers, user);
    this.searchInput = '';
    this.onFilterUsers(); 
  }

  onRemoveSelectedUser(user: User): void {
    this.selectedUsers = this.userManagementService.removeSelectedUser(this.selectedUsers, user);
    this.onFilterUsers(); 
  }

  onUpdateMembers(): void {
    let memberIds: string[];
    if (this.selectedOption === 'all') {
      memberIds = this.userManagementService.getAllUserIds();
    } else {
      memberIds = this.userManagementService.getMemberIds(this.selectedUsers);
    }

    const channelId = this.userManagementService.getCurrentChannelId();
    if (channelId) {
      this.userManagementService.updateMembers(channelId, memberIds)
        .then(() => this.dialogRef.close())
        .catch(error => console.error('Fehler beim Aktualisieren der Mitgliederliste:', error));
    } else {
      console.error('Keine Channel-ID verfügbar zum Aktualisieren der Mitglieder.');
    }
  }

  openUserProfile(userId: string, button: HTMLElement): void {
    this.profileService.setOwnProfileStatus(false);
    this.profileService.setViewingUserId(userId);

    const component = DialogShowProfileComponent;
    this.customDialogService.openDialogAbsolute(button, component, 'right');
    // this.dialogRef.close();
  }
}