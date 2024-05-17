import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { LogOutDialogComponent } from './log-out-dialog/log-out-dialog.component';
import { CustomDialogService } from '../../services/custom-dialog.service';
import { UserService } from '../../firebase.service/user.service';
import { MainMenuComponent } from '../main-menu/main-menu.component';
import { ChannelFirebaseService } from '../../firebase.service/channelFirebase.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-header',
  standalone: true,
  imports: [CommonModule, SearchBarComponent, MatCardModule, MainMenuComponent],
  templateUrl: './main-header.component.html',
  styleUrl: './main-header.component.scss',
})
export class MainHeaderComponent {
  anonymImg = 'assets/img/person.png';
  logoName: any = 'Dabbuble';
  
  constructor( private customDialogService: CustomDialogService,
    public userService: UserService, public channelService: ChannelFirebaseService) {
  }



  ngOnInit() {
    // this.changeName(this.channelService.currentChannel.id);
    // this.routeSub = this.activatedRoute.paramMap.subscribe(params => {
    //   const channelId = params.get('channelId');
    //   if (channelId) {
    //     this.changeName(channelId);
    //   }
    // });
  }

  changeName(channelId : string) {
    let channel = this.channelService.channels.find(channel => channel.id === channelId);
    let name = channel ? channel.name : 'DABubble';
    this.logoName = name;
  }

  openLogOutDialog(button: HTMLElement) {
    const component = LogOutDialogComponent;
    this.customDialogService.openDialogAbsolute(button, component, 'right');
  }

}
