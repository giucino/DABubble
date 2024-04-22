import { Component } from '@angular/core';
import { ChannelComponent } from './channel/channel.component';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [ChannelComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {
  
  threadClosed :boolean = false;

  isThreadClosed(value : boolean) {
    this.threadClosed = value;
  }
}
