import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../firebase.service/user.service';
import { ChannelFirebaseService } from '../../../firebase.service/channelFirebase.service';
import { Channel } from '../../../interfaces/channel.interface';
import { CustomDialogService } from '../../../services/custom-dialog.service';
import { DialogAddMemberComponent } from '../dialog-add-member/dialog-add-member.component';
import { OpenProfileDirective } from '../../../shared/directives/open-profile.directive';

@Component({
  selector: 'app-dialog-show-members',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule, OpenProfileDirective],
  templateUrl: './dialog-show-members.component.html',
  styleUrl: './dialog-show-members.component.scss',
})
export class DialogShowMembersComponent {
  currentChannel: Channel = this.channelService.currentChannel;

  constructor(
    public dialogRef: MatDialogRef<DialogShowMembersComponent>,
    public customDialogService: CustomDialogService,
    public userService: UserService,
    public channelService: ChannelFirebaseService
  ) {}


  openAddUserDialog() {
    const component = DialogAddMemberComponent;
    let button = document.getElementById('addMemberBtn');
    if(button) this.customDialogService.openDialogAbsolute({button, component,position : 'right', maxWidth : '554px'});
    this.dialogRef.close();
  }
  

  openUserProfile(): void {
    this.dialogRef.close();
  }
}
