import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../firebase.service/user.service';
import { User } from '../../../interfaces/user.interface';
import { ChannelService } from '../../../firebase.service/channel.service';
import { UserManagementService } from '../../../services/user-management.service';
import { Channel } from '../../../interfaces/channel.interface';

@Component({
  selector: 'app-dialog-add-member',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule],
  templateUrl: './dialog-add-member.component.html',
  styleUrl: './dialog-add-member.component.scss',
})
export class DialogAddMemberComponent implements OnInit {
  searchInput: string = '';
  filteredUsers: User[] = [];
  selectedUsers: User[] = [];
  newlyAddedUsers: User[] = [];
  currentChannel: Channel =
    this.channelService.currentChannel;

  constructor(
    public dialogRef: MatDialogRef<DialogAddMemberComponent>,
    public userService: UserService,
    public channelService: ChannelService,
    public userManagementService: UserManagementService,
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
}
