import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MessageComponent } from './message/message.component';

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [CommonModule, MessageComponent],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss'
})
export class ChannelComponent {

  @Input() channelType : 'main' | 'direct' | 'thread' | 'new' = 'direct';
  @Output() closeThreadEvent = new EventEmitter<boolean>();

  closeThread(value : boolean) {
    this.closeThreadEvent.emit(value);
  }
}
