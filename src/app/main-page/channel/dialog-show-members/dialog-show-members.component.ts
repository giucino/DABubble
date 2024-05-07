import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../firebase.service/user.service';
import { ChannelFirebaseService } from '../../../firebase.service/channelFirebase.service';
import { Channel } from '../../../interfaces/channel.interface';
import { CustomDialogService } from '../../../services/custom-dialog.service';
import { DialogAddMemberComponent } from '../dialog-add-member/dialog-add-member.component';

@Component({
  selector: 'app-dialog-show-members',
  standalone: true,
  imports: [MatDialogModule, FormsModule],
  templateUrl: './dialog-show-members.component.html',
  styleUrl: './dialog-show-members.component.scss',
})
export class DialogShowMembersComponent {
  currentChannel: Channel = 
  this.channelService.currentChannel;

  constructor(
    public dialogRef: MatDialogRef<DialogShowMembersComponent>,
    public customDialogService: CustomDialogService,

    public userService: UserService,
    public channelService: ChannelFirebaseService,

  ) {}

  openAddUserDialog(button: HTMLElement) {
    const component = DialogAddMemberComponent;
    this.customDialogService.openDialogAbsolute(button, component, 'right');
    this.dialogRef.close();
  }
}
