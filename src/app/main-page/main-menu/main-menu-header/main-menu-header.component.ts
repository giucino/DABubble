import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-main-menu-header',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './main-menu-header.component.html',
  styleUrl: './main-menu-header.component.scss',
})
export class MainMenuHeaderComponent {}
