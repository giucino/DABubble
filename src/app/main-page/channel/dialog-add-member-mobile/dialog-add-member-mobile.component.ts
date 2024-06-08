import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../firebase.service/user.service';
import { ChannelFirebaseService } from '../../../firebase.service/channelFirebase.service';
import { UserManagementService } from '../../../services/user-management.service';
import { CustomDialogService } from '../../../services/custom-dialog.service';
import { ProfileService } from '../../../services/profile.service';
import { DialogAddMemberComponent } from '../dialog-add-member/dialog-add-member.component';
import { Channel } from '../../../interfaces/channel.interface';
import { DialogShowProfileComponent } from '../../../shared/dialog-show-profile/dialog-show-profile.component';
import { User } from '../../../interfaces/user.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dialog-add-member-mobile',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule],
  templateUrl: './dialog-add-member-mobile.component.html',
  styleUrl: './dialog-add-member-mobile.component.scss'
})
export class DialogAddMemberMobileComponent {
  searchInput: string = '';
  filteredUsers: User[] = [];
  selectedUsers: User[] = [];
  newlyAddedUsers: User[] = [];

  currentChannel: Channel =
    this.channelService.currentChannel;

  constructor(
    public dialogRef: MatDialogRef<DialogAddMemberComponent>,
    public userService: UserService,
    public channelService: ChannelFirebaseService,
    public userManagementService: UserManagementService,
    public customDialogService: CustomDialogService,
    private profileService: ProfileService
  ) { }


  ngOnInit(): void {
    if (this.channelService.currentChannel && this.channelService.currentChannel.members) {
      this.selectedUsers = this.userService.getUsersByIds(this.channelService.currentChannel.members);
      this.newlyAddedUsers = [];
    }
  }


  onFilterUsers(): void {
    this.filteredUsers = this.userManagementService.filterUsers(this.searchInput, this.selectedUsers);
  }


  removeFilterUsers(): void {
    this.filteredUsers = [];
  }


  onSelectUser(user: User): void {
    this.selectedUsers = this.userManagementService.selectUser(this.selectedUsers, user);
    if (!this.newlyAddedUsers.find(u => u.id === user.id)) {
      this.newlyAddedUsers.push(user);
    }
    this.filteredUsers = this.filteredUsers.filter(u => u.id !== user.id);
    this.searchInput = '';
    this.onFilterUsers();
  }


  onRemoveSelectedUser(user: User): void {
    this.selectedUsers = this.userManagementService.removeSelectedUser(this.selectedUsers, user);
    this.newlyAddedUsers = this.newlyAddedUsers.filter(u => u.id !== user.id);
    this.onFilterUsers();
  }


  onUpdateMembers(): void {
    const memberIds = this.userManagementService.getMemberIds(this.selectedUsers);
    const channelId = this.userManagementService.getCurrentChannelId();
    if (channelId) {
      this.userManagementService.updateMembers(channelId, memberIds)
        .then(() => {
          this.dialogRef.close();
        })
        .catch(error => {
          console.error('Fehler beim Aktualisieren der Mitgliederliste:', error);
        });
    } 
  }


  openUserProfile(userId: string, button: HTMLElement): void {
    this.profileService.setOwnProfileStatus(false);
    this.profileService.setViewingUserId(userId);
    const component = DialogShowProfileComponent;
    this.customDialogService.openDialogAbsolute({ button, component, position: 'right', maxWidth: '500px' });
  }
}
