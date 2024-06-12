import { ChangeDetectorRef, ComponentRef, Directive, ElementRef, Input, Renderer2, ViewContainerRef } from '@angular/core';
import { UserService } from '../../firebase.service/user.service';
import { ProfileButtonComponent } from '../profile-button/profile-button.component';

@Directive({
  selector: '[appTagToComponent]',
  standalone: true
})
export class TagToComponentDirective {

  @Input() message: string = '';
  isViewInitialized : boolean = false;

  constructor(
    private viewContainer: ViewContainerRef,
    private elementRef : ElementRef,
    public userService : UserService,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,

  ) { }

  
  ngAfterViewInit() {
    this.transformTagsIntoComponents();
    this.cdr.detectChanges();
    this.isViewInitialized = true;
  }


  ngOnChanges() {
    if(this.isViewInitialized) {
      this.transformTagsIntoComponents();
    }
  }


  transformTagsIntoComponents() {
    let container = this.transformTagIntoHTMLElement();
    // Replace placeholders with dynamic components
    const dynamicUserElements = container.querySelectorAll('.dynamic-user');
    dynamicUserElements.forEach((element: HTMLElement) => {
      const userId = element.getAttribute('data-userid');
      const userName = element.innerText;
      const componentRef: ComponentRef<ProfileButtonComponent> = this.viewContainer.createComponent(ProfileButtonComponent);
      componentRef.instance.userId = userId!;
      componentRef.instance.userName = userName;
      this.renderer.insertBefore(container, componentRef.location.nativeElement, element);
      this.renderer.removeChild(container, element);
    });
  }


  transformTagIntoHTMLElement() {
    let container = this.elementRef.nativeElement;
    this.userService.allUsers.forEach(user => {
      const regex = new RegExp(`@${user.id}`, 'g');
      container.innerHTML = container.innerHTML.replace(regex, `<span class="dynamic-user" data-userid="${user.id}">${user.name}</span>`);
    });
    return container;
  }


}
