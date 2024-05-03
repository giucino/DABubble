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
import { Channel } from '../../../../interfaces/channel.interface';
import { ChannelTypeEnum } from '../../../../shared/enums/channel-type.enum';

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
    const searchTerm = this.searchInput ? this.searchInput.trim() : '';
    this.filteredUsers = this.userService.allUsers.filter((user) => {
      return user.name
        .split(' ')
        .some((part: string) =>
          part.toLowerCase().startsWith(searchTerm.toLowerCase())
        );
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
    if (!this.channelService.currentChannel.id) {
      console.error(
        'Keine Channel-ID verfügbar zum Aktualisieren der Mitglieder.'
      );
      return;
    }

    let memberIds: string[];
    if (this.selectedOption === 'all') {
      memberIds = this.userService.allUsers.map((user) => user.id);
    } else {
      memberIds = this.selectedUsers
        .map((user) => user.id)
        .filter((id): id is string => id !== undefined);
    }

    this.channelService
      .updateChannelMembers(this.channelService.currentChannel.id, memberIds)
      .then(() => {
        console.log(
          'Mitgliederliste erfolgreich aktualisiert für Channel ID:',
          this.channelService.currentChannel.id
        );
        this.dialogRef.close();
      })
      .catch((error) => {
        console.error('Fehler beim Aktualisieren der Mitgliederliste:', error);
      });
  }
}
