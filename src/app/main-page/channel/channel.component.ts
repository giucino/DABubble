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
import { UserService } from '../../firebase.service/user.service';
import { ChannelFirebaseService } from '../../firebase.service/channelFirebase.service';
import { ActivatedRoute, Router } from '@angular/router';


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
  currentUser: User = this.userService.currentUser;


// alle user die im channel sind
  channelMembers = this.channelService.currentChannel.members;
  users: User[] = this.userService.allUsers.filter(user => this.channelMembers.includes(user.id)); 

  messages: Message[] = this.messageService.messages;
  message: Message = {
    user_id: '',
    channel_id: this.channelService.currentChannel.id,
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
  channelId : string = '';

  currentDate: string = '1970/01/01';

  constructor(
    public customDialogService: CustomDialogService,
    public messageService: MessageService,
    public userService : UserService,
    public channelService : ChannelFirebaseService,
    public route: ActivatedRoute,
    private router: Router,
  ) {
    this.channelId = this.route.snapshot.paramMap.get('channelId') || ''; //get url param
    this.router.navigateByUrl('/main-page/' + this.userService.currentUser.last_channel); // open last channel
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['channelId']) {
        this.channelService.unsubCurrentChannel = this.channelService.getCurrentChannel(params['channelId']);
        this.messageService.getMessagesFromChannel(params['channelId']);
        this.userService.saveLastChannel(this.userService.currentUser.id, params['channelId']); // save last channel
        console.log(this.channelService.currentChannel);
      }
    });
  }

  ngOnDestroy() {
    if(this.channelService.unsubCurrentChannel === typeof function () {}) {
      this.channelService.unsubCurrentChannel();
    }
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
    this.message.channel_id = this.channelService.currentChannel.id;
    this.messageService.addMessage(this.message);
    this.messageInput = '';
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
    let contact = this.channelService.currentChannel.members.find((member) => member != this.currentUser.id);
    if (contact) return this.userService.getUser(contact);
    else return this.currentUser;
  }

  getChannelCreationTime() {
    const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
    let date = new Date(this.channelService.currentChannel.created_at);
    let d: number | string = date.getDate();
    let m: number | string = date.getMonth();
    let y = date.getFullYear();
    if(this.convertToDate(new Date().getTime()) == this.convertToDate(this.channelService.currentChannel.created_at)) {
      return 'heute';
    } else {
      return 'am' + ' ' + d + '. ' + months[m] + ' ' + y;
    }
  }

  getTextareaPlaceholderText() {
    switch(this.channelService.currentChannel.channel_type) {
      case 'main' :
        return 'Nachricht an ' + '#' + this.channelService.currentChannel.name;
        break;
      case 'direct' :
        if (this.channelService.currentChannel.members.length == 2) {
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
