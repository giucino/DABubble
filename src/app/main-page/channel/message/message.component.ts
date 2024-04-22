import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {

  isCurrentUser : boolean = true;
  showMoreOptions : boolean = false;
  editMessage : boolean = false;
  @Input() channelType : 'main' | 'direct' | 'thread' | 'new' = 'main';
  
}
