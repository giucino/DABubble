import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MessageComponent } from './message/message.component';

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [CommonModule, MessageComponent],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss'
})
export class ChannelComponent {

  channelType : 'main' | 'direct' | 'thread' | 'new' = 'main';
}
