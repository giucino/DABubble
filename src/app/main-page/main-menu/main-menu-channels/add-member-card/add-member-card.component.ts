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
    public channelService: ChannelFirebaseService
  ) {}

  filterUsers() {
    const searchTerm = this.searchInput ? this.searchInput.trim().toLowerCase() : '';
    this.filteredUsers = this.userService.allUsers.filter((user) => {
      const isPartOfNameMatched = user.name
        .split(' ')
        .some((part: string) => part.toLowerCase().startsWith(searchTerm));
  
      const isNotSelected = !this.selectedUsers.some(selected => selected.id === user.id);
      const isNotCreator = this.channelService.currentChannel.creator !== user.id;
  
      return isPartOfNameMatched && isNotSelected && isNotCreator;
    });
  }
  
  selectUser(user: User): void {
    if (!this.selectedUsers.find((u) => u.id === user.id)) {
      this.selectedUsers.push(user);
      this.searchInput = '';
    }
  }

  removeSelectedUser(user: User): void {
    this.selectedUsers = this.selectedUsers.filter((u) => u.id !== user.id);
  }

  handleMemberUpdate(): void {
    const channelId = this.getCurrentChannelId();
    if (!channelId) {
      console.error('Keine Channel-ID verfügbar zum Aktualisieren der Mitglieder.');
      return;
    }
    const memberIds = this.getMemberIds();
    this.updateMembers(channelId, memberIds);
  }

  getCurrentChannelId(): string | undefined {
    return this.channelService.currentChannel.id;
  }

  getMemberIds(): string[] {
    if (this.selectedOption === 'all') {
      return this.userService.allUsers.map(user => user.id).filter((id): id is string => id !== undefined);
    } else {
      return this.selectedUsers.map(user => user.id).filter((id): id is string => id !== undefined);
    }
  }

  updateMembers(channelId: string, memberIds: string[]): void {
    this.channelService.updateChannelMembers(channelId, memberIds)
      .then(() => {
        this.dialogRef.close();
      })
      .catch(error => {
        console.error('Fehler beim Aktualisieren der Mitgliederliste:', error);
      });
  }
}