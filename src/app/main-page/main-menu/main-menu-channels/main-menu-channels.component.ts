import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { DynamicContentComponent } from '../../../shared/dynamic-content/dynamic-content.component';

@Component({
  selector: 'app-main-menu-channels',
  standalone: true,
  imports: [MatCardModule, MatExpansionModule, DynamicContentComponent],
  templateUrl: './main-menu-channels.component.html',
  styleUrl: './main-menu-channels.component.scss',
})
export class MainMenuChannelsComponent {
  panelOpenState = false;

}
