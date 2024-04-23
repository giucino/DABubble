import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicContentComponent } from '../../../shared/dynamic-content/dynamic-content.component';

@Component({
  selector: 'app-main-menu-dm',
  standalone: true,
  imports: [CommonModule, DynamicContentComponent],
  templateUrl: './main-menu-dm.component.html',
  styleUrl: './main-menu-dm.component.scss',
})
export class MainMenuDmComponent {
  isExpanded = true;

  toggleExpansion() {
    this.isExpanded = !this.isExpanded;
  }
}
