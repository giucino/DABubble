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
  users: User[] = this.userService.allUsers.filter(user => this.channelMembers.includes(user.id));
  messageCreator: User | undefined = undefined;
  messages: Message[] = this.messageService.messages;
  editableMessage: Message = JSON.parse(JSON.stringify(this.message));

  constructor(
    public messageService: MessageService,
    public userService: UserService,
    public channelService: ChannelFirebaseService,
    public threadService: ThreadService,
  ) {
    // this.messageService.getMessagesFromChannel(this.currentChannel.id);
    // messageService.messages = this.
  }

  ngOnInit() {
    this.messageCreator = this.getUser(this.message.user_id);
    this.editableMessage = JSON.parse(JSON.stringify(this.message));
  }

  isCurrentUser(): boolean {
    return this.currentUser.id === this.message.user_id;
  }

  getUser(user_id: string) {
    return this.users.find((user) => user.id == user_id);
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
    // console.log(this.message);
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
      this.threadService.openThread();
    }
    console.log('Messages', this.messageService.messages);
    console.log('MessagesThread', this.messageService.messagesThread);
  }
}
