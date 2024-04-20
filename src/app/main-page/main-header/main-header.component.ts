import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { SearchBarComponent } from './search-bar/search-bar.component';

@Component({
  selector: 'app-main-header',
  standalone: true,
  imports: [CommonModule, MatCardModule, SearchBarComponent],
  templateUrl: './main-header.component.html',
  styleUrl: './main-header.component.scss'
})
export class MainHeaderComponent {

}
