import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MainMenuHeaderComponent } from './main-menu-header/main-menu-header.component';
import { MainMenuDmComponent } from './main-menu-dm/main-menu-dm.component';
import { ChannelFirebaseService } from '../../firebase.service/channelFirebase.service';
import { SharedService } from '../../services/shared.service';
import { MainMenuChannelsComponent } from './main-menu-channels/main-menu-channels.component';

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MainMenuHeaderComponent,
    MainMenuDmComponent,
    MainMenuChannelsComponent
  ],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.scss',
})
export class MainMenuComponent{
  isMenuOpen: boolean = true;

  constructor(public channelService: ChannelFirebaseService, public sharedService: SharedService) {
    
  }

  ngOnInit(): void {
    // this.sharedService.backToChannels$.subscribe(() => {
    //   this.isMenuOpen = true;
    // });
    // this.sharedService.isMenuOpen$.subscribe((isOpen) => {
    //   this.isMenuOpen = isOpen;
    // });
  }

  openNewMessage(){
    // channel type 'new' öffnen
  }
}