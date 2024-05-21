import { Directive, Input, HostListener, ElementRef } from '@angular/core';
import { ProfileService } from '../../services/profile.service';

@Directive({
  selector: '[appOpenProfile]',
  standalone: true,
})
export class OpenProfileDirective {
  @Input() userId!: string;
  @Input() button!: HTMLElement;

  constructor(
    private profileService: ProfileService,
    private elRef: ElementRef
  ) {}

  @HostListener('click')
  onClick(): void {
    const element = this.button || this.elRef.nativeElement;
    this.profileService.openProfile(this.userId, element);
  }
}
