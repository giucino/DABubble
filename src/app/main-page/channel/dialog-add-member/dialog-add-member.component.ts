import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../firebase.service/user.service';
import { User } from '../../../interfaces/user.interface';
import { ChannelFirebaseService } from '../../../firebase.service/channelFirebase.service';
import { UserManagementService } from '../../../services/user-management.service';
import { Channel } from '../../../interfaces/channel.interface';

@Component({
  selector: 'app-dialog-add-member',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule],
  templateUrl: './dialog-add-member.component.html',
  styleUrl: './dialog-add-member.component.scss',
})
export class DialogAddMemberComponent {
  searchInput: string = '';
  filteredUsers: User[] = [];
  selectedUsers: User[] = [];

  currentChannel: Channel = 
  this.channelService.currentChannel;

  channelMembers = this.currentChannel.members;
  users: User[] = this.userService.allUsers.filter(user => this.channelMembers.includes(user.id)); 


  constructor(
    public dialogRef: MatDialogRef<DialogAddMemberComponent>,
    public userService: UserService,
    public channelService: ChannelFirebaseService,
    public userManagementService: UserManagementService
  ) {}

  onFilterUsers(): void {
    this.filteredUsers = this.userManagementService.filterUsers(this.searchInput, this.selectedUsers);
  }

  onSelectUser(user: User): void {
    this.selectedUsers = this.userManagementService.selectUser(this.selectedUsers, user);
    this.searchInput = '';
  }

  onRemoveSelectedUser(user: User): void {
    this.selectedUsers = this.userManagementService.removeSelectedUser(this.selectedUsers, user);
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
    } else {
      console.error('Keine Channel-ID verfügbar zum Aktualisieren der Mitglieder.');
    }
  }
}
