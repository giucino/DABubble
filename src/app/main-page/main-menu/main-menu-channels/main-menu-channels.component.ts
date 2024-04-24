import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { DynamicContentComponent } from '../../../shared/dynamic-content/dynamic-content.component';
import { AddChannelCardComponent } from './add-channel-card/add-channel-card.component';
import { MatDialog } from '@angular/material/dialog';
import { CustomDialogService } from '../../../services/custom-dialog.service';

@Component({
  selector: 'app-main-menu-channels',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatExpansionModule,
    DynamicContentComponent,
  ],
  templateUrl: './main-menu-channels.component.html',
  styleUrl: './main-menu-channels.component.scss',
})
export class MainMenuChannelsComponent {
  // panelOpenState = false;
  isExpanded = true;

  constructor(private customDialogService : CustomDialogService) {}

  toggleExpansion() {
    this.isExpanded = !this.isExpanded;
  }

  // openDialog() {
  //   this.dialog.open(AddChannelCardComponent);
  // }

  // openDialog(): void {
  //   console.log('Opening dialog');
  //   const dialogRef = this.dialog.open(AddChannelCardComponent);

  //   dialogRef.afterClosed().subscribe((result) => {
  //     console.log('The dialog was closed');
  //   });
  // }

  openAddChannelDialog() {
    const component = AddChannelCardComponent;
    this.customDialogService.openDialog(component);
  }
}
