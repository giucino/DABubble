import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Message } from '../../../interfaces/message.interface';
import { User } from '../../../interfaces/user.interface';
import { MessageService } from '../../../firebase.service/message.service';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../firebase.service/user.service';
import { ChannelFirebaseService } from '../../../firebase.service/channelFirebase.service';
import { Channel } from '../../../interfaces/channel.interface';
import { ChannelTypeEnum } from '../../../shared/enums/channel-type.enum';
import { ThreadService } from '../../../services/thread.service';
import { DialogEmojiPickerComponent } from '../dialog-emoji-picker/dialog-emoji-picker.component';
import { CustomDialogService } from '../../../services/custom-dialog.service';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
})
export class MessageComponent {
  showMoreOptions: boolean = false;
  editMessage: boolean = false;
  @Input() channelType: 'main' | 'direct' | 'thread' | 'new' = 'main';
  @Input() message: Message = 
  {
    user_id: '',
    channel_id: '',
    thread_id: '',
    message: {
      text: '',
      reactions: [],
      attachements: [],
    },
    created_at: 0,
    modified_at: 0,
    is_deleted: false,
    total_replies: 0,
    last_reply: 0,
  };

  currentUser: User = this.userService.currentUser;
  currentChannel = this.channelService.currentChannel;
  channelMembers = this.currentChannel.members;
  messageCreator: User | undefined = undefined;
  // messages: Message[] = this.messageService.messages;
  editableMessage: Message = JSON.parse(JSON.stringify(this.message));

  attachementsData : any[] = [];

  constructor(
    public messageService: MessageService,
    public userService: UserService,
    public channelService: ChannelFirebaseService,
    public threadService: ThreadService,
    public customDialogService : CustomDialogService,
  ) {

  }

  ngOnInit() {
    this.messageCreator = this.getUser(this.message.user_id);
    this.editableMessage = JSON.parse(JSON.stringify(this.message));
    // get attachements data
    this.getAttachementsData();
  }

  ngOnChanges() {
    this.editableMessage = JSON.parse(JSON.stringify(this.message));
    if (this.attachementsData.length == 0) this.getAttachementsData();
  }

  async getAttachementsData() {
    const messageAttachementsPaths = this.message.message.attachements;
    if (messageAttachementsPaths) {
      this.attachementsData = [];
      messageAttachementsPaths.forEach(async (path) => {
        if (path != 'deleted') {
          const attachement = await this.messageService.getFileData(path);
          this.attachementsData.push(attachement);
        }
      })
    }
  }

  attachementData(path : string) {
    let attachementData = this.attachementsData.find((data) => data.path == path);
    return attachementData;
  }

  isCurrentUser(): boolean {
    return this.currentUser.id === this.message.user_id;
  }

  getUser(user_id: string) {
    return this.userService.allUsers.find((user) => user.id == user_id);
  }

  getTime(timeNumber: number) {
    let date = new Date(timeNumber);
    let h = this.addZero(date.getHours());
    let m = this.addZero(date.getMinutes());
    let time = h + ':' + m;
    return time;
  }

  addZero(i: any) {
    if (i < 10) {
      i = '0' + i;
    }
    return i;
  }

  updateMessage() {
    this.editableMessage.modified_at = new Date().getTime();
    this.messageService.updateMessage(this.editableMessage);
    this.editMessage = false;
    this.showMoreOptions = false;
  }

  getTimeDifferenceForLastReply(dateAsNumber: number) {
    let currentDate = new Date().getTime();
    let difference = 0;

    difference = currentDate - dateAsNumber;

    let seconds = Math.floor(difference / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);

    if (this.convertToDate(currentDate) == this.convertToDate(dateAsNumber)) {
      return this.getTime(dateAsNumber) + ' ' + 'Uhr';
    } else if (hours > 24 && hours < 48) {
      return 'Gestern';
    } else {
      return this.convertToDate(dateAsNumber);
    }
  }

  convertToDate(dateAsNumber: number) {
    let date = new Date(dateAsNumber);
    let d: number | string = date.getDate();
    let m: number | string = date.getMonth() + 1;
    let y: number | string = date.getFullYear();
    if (d < 10) d = '0' + d;
    if (m < 10) m = '0' + m;
    let result = d + '.' + m + '.' + y;
    return result;
  }

 async openThread(thread_id : string | undefined) {
    if(this.threadService.threadOpen) this.closeThread();
    if (thread_id == undefined || thread_id == '') {
      let newThread : Channel = {
        id: '',
        name: this.channelService.currentChannel.name,
        description: '',
        created_at: new Date().getTime(),
        creator: this.userService.currentUser.id, // 'user_id'
        members: [this.userService.currentUser.id],
        active_members: [],
        channel_type: ChannelTypeEnum.thread,
      }
      let newThreadId = await this.channelService.addChannel(newThread);
      this.userService.currentUser.last_thread = newThreadId;
      this.userService.saveLastThread(this.userService.currentUser.id,newThreadId);
      this.message.thread_id = newThreadId;
      this.messageService.updateMessage(this.message);
      this.threadService.openThread();
    } else {
      this.userService.currentUser.last_thread = thread_id;
      this.userService.saveLastThread(this.userService.currentUser.id,thread_id);
      this.threadService.openThread();
    }
  }

  closeThread() {
    this.userService.saveLastThread(this.userService.currentUser.id, '');
    this.threadService.closeThread();
  }


  deleteFile(path : string) {
    // remove file from storage
    this.messageService.deleteFile(path);
    // remove attachement path
    if (this.message.message.attachements) {
      const index = this.message.message.attachements.indexOf(path);
      if (index > -1) this.message.message.attachements[index] = 'deleted';
      this.message.modified_at = new Date().getTime();
      this.messageService.updateMessage(this.message);
    }
  }

  /* Edit Message */

  /* Dialog Emoji Picker */ 
  openDialogEmojiPicker(input : HTMLDivElement) {
    const component = DialogEmojiPickerComponent;
    const dialogRef = this.customDialogService.openDialog(component);
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.editableMessage.message.text += result;
        input.innerText = this.editableMessage.message.text;
      }
    })
  }


}

