import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter} from '@angular/core';
import { MessageComponent } from './message/message.component';
import { DialogAddMemberComponent } from './dialog-add-member/dialog-add-member.component';
import { CustomDialogService } from '../../services/custom-dialog.service'
import { DialogShowMembersComponent } from './dialog-show-members/dialog-show-members.component';
import { DialogEditChannelComponent } from './dialog-edit-channel/dialog-edit-channel.component';

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [CommonModule, MessageComponent],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss'
})
export class ChannelComponent {

  @Input() channelType : 'main' | 'direct' | 'thread' | 'new' = 'main';
  @Output() closeThreadEvent = new EventEmitter<boolean>();

  constructor (public customDialogService: CustomDialogService) {

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
}
