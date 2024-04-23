import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, ElementRef} from '@angular/core';
import { MessageComponent } from './message/message.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogAddMemberComponent } from '../dialog-add-member/dialog-add-member.component';

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [CommonModule, MessageComponent],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss'
})
export class ChannelComponent {

  @Input() channelType : 'main' | 'direct' | 'thread' | 'new' = 'main';
  @Output() closeThreadEvent = new EventEmitter<boolean>();
  dialogRef : MatDialogRef<DialogAddMemberComponent> | null = null;

  constructor (public dialog: MatDialog) {

  }

  openDialog(button : HTMLElement) {
    const rect = button.getBoundingClientRect();
    this.dialogRef = this.dialog.open(DialogAddMemberComponent, {
      panelClass: 'custom-dialog-anchorTopRight',
      position: {
        top: rect.bottom + 'px',
        left: rect.right + 'px',
      },
      
    });
    if (this.dialogRef) {
      window.addEventListener('resize', () => this.updateDialogPosition(button))
    }
  }

    // Funktion zum Aktualisieren der Dialogposition
    updateDialogPosition(button: HTMLElement): void {
      if (this.dialogRef) {
        const rect = button.getBoundingClientRect();
        this.dialogRef.updatePosition({
          top: rect.bottom + 'px',
          left: rect.right + 'px'
        });
      }
    }

  closeThread(value : boolean) {
    this.closeThreadEvent.emit(value);
  }
}
