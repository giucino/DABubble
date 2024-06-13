import { Directive, Input, HostListener, ElementRef } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { UserService } from '../../firebase.service/user.service';

@Directive({
  selector: '[appOpenProfile]',
  standalone: true,
})
export class OpenProfileDirective {
  @Input() userId!: string;
  @Input() button!: HTMLElement;

  constructor(
    private profileService: ProfileService,
    private elRef: ElementRef,
    public userService: UserService
  ) {}

  @HostListener('click')
  async onClick(): Promise<void> { // Make the method async
    const user = await this.userService.getUser(this.userId); // Get the user
    if (user.email !== 'guest') { // Check if the user's email is not 'guest'
      const element = this.button || this.elRef.nativeElement;
      this.profileService.openProfile(this.userId, element);
    }
  }
}
