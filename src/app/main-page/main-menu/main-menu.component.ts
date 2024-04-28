import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MainMenuHeaderComponent } from './main-menu-header/main-menu-header.component';
import { MainMenuChannelsComponent } from './main-menu-channels/main-menu-channels.component';
import { MainMenuDmComponent } from './main-menu-dm/main-menu-dm.component';
import { DynamicContentComponent } from '../../shared/dynamic-content/dynamic-content.component';
import { ChannelService } from '../../services/channel.service';
import { ChannelFirebaseService } from '../../firebase.service/channelFirebase.service';


@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [
    MatCardModule,
    MainMenuHeaderComponent,
    MainMenuChannelsComponent,
    MainMenuDmComponent,
    DynamicContentComponent
  ],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.scss',
})
export class MainMenuComponent implements OnInit {
  channelService = inject(ChannelService);
  channelFirebaseService = inject(ChannelFirebaseService);

  ngOnInit(): void {
    // this.channelFirebaseService.getChannels().subscribe((channels) => {
    //   this.channelService.channelsSig.set(channels);
    //   console.log(channels);
    // });
  }
}
