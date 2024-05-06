import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MessageComponent } from './message/message.component';
import { DialogAddMemberComponent } from './dialog-add-member/dialog-add-member.component';
import { CustomDialogService } from '../../services/custom-dialog.service';
import { DialogShowMembersComponent } from './dialog-show-members/dialog-show-members.component';
import { DialogEditChannelComponent } from './dialog-edit-channel/dialog-edit-channel.component';
import { MessageService } from '../../firebase.service/message.service';
import { Message } from '../../interfaces/message.interface';
import { FormsModule } from '@angular/forms';
import { User } from '../../interfaces/user.interface';
import { Channel } from '../../interfaces/channel.interface';
import { ChannelTypeEnum } from '../../shared/enums/channel-type.enum';
import { UserService } from '../../firebase.service/user.service';
import { ChannelFirebaseService } from '../../firebase.service/channelFirebase.service';
import { user } from '@angular/fire/auth';
import { channel } from 'diagnostics_channel';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [CommonModule, MessageComponent, FormsModule],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss',
})
export class ChannelComponent {
  @Input() channelType: 'main' | 'direct' | 'thread' | 'new' = 'main';
  @Output() closeThreadEvent = new EventEmitter<boolean>();

  messageInput: string = '';

  // TODO: replace dummy data
  // 
  // currentUser: User = this.userService.currentUser;
  // {
  //   id: 'user_01',
  //   name: 'Max Mustermann',
  //   email: 'max@mustermann.de',
  //   password: 'password',
  //   logged_in: true,
  //   is_typing: false,
  //   profile_img: '/assets/img/avatar-1.jpg',
  //   // last_channel: string,
  // };
  currentUser: User = this.userService.currentUser;
  // users: User[] = this.userService.allUsers;
  // TODO: replace with userService.users
  // users: User[] = [
  //   {
  //     id: 'user_01',
  //     name: 'User 01',
  //     email: 'user@01.de',
  //     password: 'password1',
  //     logged_in: true,
  //     is_typing: false,
  //     profile_img: '/assets/img/avatar-1.jpg',
  //   },
  //   {
  //     id: 'user_02',
  //     name: 'User 02',
  //     email: 'user@02.de',
  //     password: 'password2',
  //     logged_in: false,
  //     is_typing: false,
  //     profile_img: '/assets/img/avatar-2.jpg',
  //   },
  //   {
  //     id: 'user_03',
  //     name: 'User 03',
  //     email: 'user@03.de',
  //     password: 'password3',
  //     logged_in: true,
  //     is_typing: false,
  //     profile_img: '/assets/img/avatar-3.jpg',
  //   },
  // ];

  currentChannel: Channel = 
  this.channelService.currentChannel;
  // {
  //   id: this.channelService.currentChannel.id,
  //   name: this.channelService.currentChannel.name,
  //   description: this.channelService.currentChannel.description,
  //   created_at: this.channelService.currentChannel.created_at,
  //   creator: this.channelService.currentChannel.creator, // 'user_id'
  //   members: this.channelService.currentChannel.members,
  //   active_members: this.channelService.currentChannel.active_members,
  //   channel_type: this.channelService.currentChannel.channel_type as ChannelTypeEnum,
  // }


// alle user die im channel sind
  channelMembers = this.currentChannel.members;
  users: User[] = this.userService.allUsers.filter(user => this.channelMembers.includes(user.id)); 

  // currentChannel: Channel = this.channelService.currentChannel;


  // message: Message = this.messageService.message;
  // {
  //   user_id: '',
  //   channel_id: '', // channel_02
  //   message: {
  //     text: 'Text',
  //     attachements: [],
  //   },
  //   created_at: 0,
  //   modified_at: 0,
  //   is_deleted: false,
  //   last_reply: 0,
  // };

  messages: Message[] = this.messageService.messages;
  // this.messageService.messages;

  message: Message = {
    user_id: '',
    channel_id: this.currentChannel.id,
    message: {
      text: '',
      attachements: [],
    },
    created_at: 0,
    modified_at: 0,
    is_deleted: false,
    last_reply: 0,
  };

  // lastChannelId = this.currentUser.last_channel || ''; // starter channel für jeden?


  currentDate: string = '1970/01/01';

  constructor(
    public customDialogService: CustomDialogService,
    public messageService: MessageService,
    public userService : UserService,
    public channelService : ChannelFirebaseService,
    public route: ActivatedRoute
  ) {
    // this.messageService.getMessagesFromChannel(this.currentChannel.id);
  }

  ngOnInit() {
    // this.messageService.getMessagesFromChannel(this.currentChannel.id);
    // });
    this.loadMessagesForCurrentChannel();
  }

  loadMessagesForCurrentChannel() {
    // const channelId = this.currentChannel.id;
    // this.messages = this.messageService.currentChannelMessages.filter(message => message.channel_id === channelId);
    // this.messageService.getMessagesFromChannel(channelId).then(messages => {
    //   this.messages = messages.filter(message => message.channel_id === channelId);
    // });
  }
  

  openAddUserDialog(button: HTMLElement) {
    const component = DialogAddMemberComponent;
    this.customDialogService.openDialogAbsolute(button, component, 'right');
  }

  openShowMembersDialog(button: HTMLElement) {
    const component = DialogShowMembersComponent;
    this.customDialogService.openDialogAbsolute(button, component, 'right');
  }

  openEditChannelDialog(button: HTMLElement) {
    const component = DialogEditChannelComponent;
    this.customDialogService.openDialogAbsolute(button, component, 'left');
  }

  closeThread(value: boolean) {
    this.closeThreadEvent.emit(value);
  }

  saveMessage() {
    this.message.user_id = this.currentUser.id;
    this.message.message.text = this.messageInput;
    this.message.created_at = new Date().getTime();
    this.message.modified_at = this.message.created_at;
    this.message.channel_id = this.currentChannel.id;
    this.messageService.addMessage(this.message);
    this.messageInput = '';
    console.log(this.currentChannel) // richtige channel
    // this.messageService.getMessagesFromChannel(this.channelService.currentChannel?.id || '');
    // this.channelService.setCurrentChannel(this.channelService.currentChannel?.id || '');
  }

  isNewDate(date: number) {
    let currentDate = this.currentDate;
    let messageDate = this.convertToDate(date);
    this.currentDate = messageDate;
    return currentDate != messageDate;
  }

  getDateFormat(dateInput: number) {
    const weekdays = [
      'Sonntag',
      'Montag',
      'Dienstag',
      'Mittwoch',
      'Donnerstag',
      'Freitag',
      'Samstag',
    ];
    const months = [
      'Januar',
      'Februar',
      'März',
      'April',
      'Mai',
      'Juni',
      'Juli',
      'August',
      'September',
      'Oktober',
      'November',
      'Dezember',
    ];
    let d = new Date(dateInput);
    let date = d.getDate();
    let day: number | string = d.getDay();
    let month: number | string = d.getMonth() + 1;
    day = weekdays[day];
    month = months[month];
    let result = day + ',' + ' ' + date + ' ' + month;
    return result;
  }

  convertToDate(dateAsNumber: number) {
    let date = new Date(dateAsNumber);
    let d: number | string = date.getDate();
    let m: number | string = date.getMonth() + 1;
    let y: number | string = date.getFullYear();
    if (d < 10) d = '0' + d;
    if (m < 10) m = '0' + m;
    let result = y + '/' + m + '/' + d;
    return result;
  }

  // TODO: move to userService
  // getUser(user_id : string) {
  //   return this.users.find((user) => user.id == user_id);
  // }

  getDirectChannelUser() {
    let contact = this.currentChannel.members.find((member) => member != this.currentUser.id);
    if (contact) return this.userService.getUser(contact);
    else return this.currentUser;
  }

  getChannelCreationTime() {
    const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
    let date = new Date(this.currentChannel.created_at);
    let d: number | string = date.getDate();
    let m: number | string = date.getMonth();
    let y = date.getFullYear();
    if(this.convertToDate(new Date().getTime()) == this.convertToDate(this.currentChannel.created_at)) {
      return 'heute';
    } else {
      return 'am' + ' ' + d + '. ' + months[m] + ' ' + y;
    }
  }

  getTextareaPlaceholderText() {
    switch(this.currentChannel.channel_type) {
      case 'main' :
        return 'Nachricht an ' + '#' + this.currentChannel.name;
        break;
      case 'direct' :
        if (this.currentChannel.members.length == 2) {
          return 'Nachricht an ' + this.getDirectChannelUser()?.name;
        } else {
          return 'Nachricht an ' + 'dich';
        }
        break;
      case 'thread' : 
        return 'Antworten...';
        break;
      case 'new' : 
        return 'Starte eine neue Nachricht';
        break;
      default :
        return 'Starte eine neue Nachricht';
    }
  }
}
