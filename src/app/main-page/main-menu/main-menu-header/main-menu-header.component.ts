import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ChannelFirebaseService } from '../../../firebase.service/channelFirebase.service';
import { Router, RouterModule} from '@angular/router';


@Component({
  selector: 'app-main-menu-header',
  standalone: true,
  imports: [CommonModule, MatCardModule, RouterModule],
  templateUrl: './main-menu-header.component.html',
  styleUrl: './main-menu-header.component.scss',
})
export class MainMenuHeaderComponent {

  constructor( public router: Router,
  ) {}

  openNewChannel() {
  }
}
