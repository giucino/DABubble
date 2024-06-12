import { CommonModule } from '@angular/common';
import { Component, NgZone, ViewChild, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';
import { UserService } from '../../../firebase.service/user.service';
import { ChannelFirebaseService } from '../../../firebase.service/channelFirebase.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogAddMemberMobileComponent } from '../dialog-add-member-mobile/dialog-add-member-mobile.component';
import { CustomDialogService } from '../../../services/custom-dialog.service';
import { MessageService } from '../../../firebase.service/message.service';
import { Message } from '../../../interfaces/message.interface';
import { ThreadService } from '../../../services/thread.service';

@Component({
  selector: 'app-dialog-edit-channel',
  standalone: true,
  imports: [CommonModule, MatDialogModule, TextFieldModule, FormsModule],
  templateUrl: './dialog-edit-channel.component.html',
  styleUrl: './dialog-edit-channel.component.scss',
})
export class DialogEditChannelComponent implements OnInit {
  editChannelName: boolean = false;
  editChannelDescription: boolean = false;
  tempChannelName!: string;
  tempChannelDescription!: string;
  selectedUserId: string = '';
  channelExists: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DialogEditChannelComponent>,
    private _ngZone: NgZone,
    public userService: UserService,
    public channelService: ChannelFirebaseService,
    private router: Router,
    public customDialogService: CustomDialogService,
    public messageService: MessageService,
    public threadService: ThreadService,
  ) { }

  @ViewChild('autosize') autosize!: CdkTextareaAutosize;

  ngOnInit(): void {
    this.tempChannelName = this.channelService.currentChannel.name;
    this.tempChannelDescription =
      this.channelService.currentChannel.description;
  }


  openAddUserDialog(button: HTMLElement) {
    const component = DialogAddMemberMobileComponent;
    this.customDialogService.openDialogAbsolute({ button, component, position: 'mid', mobilePosition: 'bottom', maxWidth: '100dvw' });
  }


  getCreatorName(userId: string): string {
    const user = this.userService.getUser(userId);
    return user ? user.name : 'Unbekannter Benutzer';
  }


  triggerResize() {
    this._ngZone.onStable
      .pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }


  async updateEditedChannel(): Promise<void> {
      if (this.duplicateChannelName()) {
        this.channelExists = true;
        return;
      } else {
        this.changeChannelName();
      }
  }


  async changeChannelName(): Promise<void> {
    this.channelExists = false;
    this.channelService.currentChannel.name = this.tempChannelName;
    this.channelService.currentChannel.description = this.tempChannelDescription;
    await this.channelService.updateChannel(this.channelService.currentChannel);
    this.cancelEditing();
    this.dialogRef.close();
  }


  duplicateChannelName(): boolean {
    return this.channelService.channels.some(
      (channel) =>
        channel.name === this.tempChannelName &&
        channel.id !== this.channelService.currentChannel.id
    );
  }


  cancelEditing(): void {
    this.editChannelName = false;
    this.editChannelDescription = false;
  }


  async leaveChannel(): Promise<void> {
    if (!this.channelService.currentChannel || !this.channelService.currentChannel.id) {
      return;
    }
      if (this.channelService.currentChannel.members.length === 1){
        this.deleteChannelAndMessages();
      }
      await this.channelService.removeUserFromChannel(this.channelService.currentChannel.id, this.userService.currentUser.id);
      this.deleteUserFromThreadsOfChannel(this.channelService.currentChannel.id, this.userService.currentUser.id);
      this.userService.saveLastThread(this.userService.currentUser.id, '');
      this.threadService.closeThread();
      this.openNewChannel();
  }


  openNewChannel(){
    this.dialogRef.close();
    this.channelService.openNewChannel(this.userService.currentUser.id);
    this.router.navigate(['/main-page/' + this.channelService.currentChannel.id]);
  }


  deleteChannelAndMessages(){
    for (let thread of this.channelService.channels) {
      if (thread.name === this.channelService.currentChannel.name) {
        this.messageService.removeThreadMessagesFromChannel(thread.id);
        this.messageService.removeThreadMessagesFromChannel(this.channelService.currentChannel.id);
        this.channelService.deleteChannel(thread.id);
      }
    }
    this.messageService.removeMessagesFromEmptyChannel(this.channelService.currentChannel.id);
  }

  deleteUserFromThreadsOfChannel(channelId : string, userId : string) {
    let firstThreadMessages = this.messageService.allMessages.filter((message) => (message.channel_id == channelId && (message.thread_id && message.thread_id != '')));
    firstThreadMessages.forEach(async (message : Message) => {
      if (message.thread_id && message.thread_id != '') await this.channelService.removeUserFromChannel(message.thread_id, userId);
    })
  }
}
