import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter} from '@angular/core';
import { MessageComponent } from './message/message.component';
import { DialogAddMemberComponent } from './dialog-add-member/dialog-add-member.component';
import { CustomDialogService } from '../../services/custom-dialog.service'
import { DialogShowMembersComponent } from './dialog-show-members/dialog-show-members.component';
import { DialogEditChannelComponent } from './dialog-edit-channel/dialog-edit-channel.component';
import { MessageService } from '../../firebase.service/message.service';
import { Message } from '../../interfaces/message.interface';
import { FormsModule } from '@angular/forms';
import { User } from '../../interfaces/user.interface';
import { Channel } from '../../interfaces/channel.interface';

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [CommonModule, MessageComponent, FormsModule],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss'
})
export class ChannelComponent {

  @Input() channelType : 'main' | 'direct' | 'thread' | 'new' = 'main';
  @Output() closeThreadEvent = new EventEmitter<boolean>();
  
  messageInput : string = '';

  currentUser : User = {
    id: 'user_01',
    name: 'Max Mustermann',
    email: 'max@mustermann.de',
    password: 'password',
    logged_in: true,
    is_typing: false,
    profile_img: 'avatar-1.jpg',
    // last_channel: string,
  }

  currentChannel : Channel = {
    id: 'channel_01',
    name : 'Channel 01',
    description : 'Das ist Channel 01',
    created_at: 1714048300000,
    creator: 'user_01', // 'user_id'
    members: ['user_01', 'user_02', 'user_03'], 
    active_members: ['user_01', 'user_02'],
    channel_type: 'main',
  }

  message : Message = {
    user_id: '',
    channel_id: 'channel_02',
    message: {
        text: 'Text',
        attachements: [], 
    },
    created_at: 0,
    modified_at: 0,
    is_deleted: false,
  }

  constructor (public customDialogService: CustomDialogService, public messageService : MessageService) {

  }

  
  openAddUserDialog(button : HTMLElement) {
    const component = DialogAddMemberComponent;
    this.customDialogService.openDialogAbsolute(button,component, 'right');
  }

  openShowMembersDialog(button : HTMLElement) {
    const component = DialogShowMembersComponent;
    this.customDialogService.openDialogAbsolute(button,component,'right');
  }

  openEditChannelDialog(button : HTMLElement) {
    const component = DialogEditChannelComponent;
    this.customDialogService.openDialogAbsolute(button,component,'left');
  }

  closeThread(value : boolean) {
    this.closeThreadEvent.emit(value);
  }

  saveMessage() {
    this.message.user_id = this.currentUser.id || '';
    this.message.message.text = this.messageInput;
    this.message.created_at = new Date().getTime();
    this.message.modified_at = this.message.created_at;
    this.messageService.addMessage(this.message);
    this.messageInput = '';
  }
}
