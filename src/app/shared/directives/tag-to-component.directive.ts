import { ChangeDetectorRef, ComponentRef, Directive, ElementRef, HostListener, Input, Renderer2, SimpleChange, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { UserService } from '../../firebase.service/user.service';
import { ProfileButtonComponent } from '../profile-button/profile-button.component';

@Directive({
  selector: '[appTagToComponent]',
  standalone: true
})
export class TagToComponentDirective {

  // @Input() dynamicHost! : ViewContainerRef;
  @Input() message: string = '';
  isViewInitialized : boolean = false;

  constructor(
    private viewContainer: ViewContainerRef,
    // private template : TemplateRef<Object>,
    private elementRef : ElementRef,
    public userService : UserService,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,

  ) { }

  ngAfterViewInit() {
    this.loadDynamicComponents();
    this.cdr.detectChanges();
    this.isViewInitialized = true;
  }

  ngOnChanges() {
    if(this.isViewInitialized) {
      this.loadDynamicComponents();
      this.cdr.detectChanges();
      // console.log('triggered', this.message)
    }

  }

  loadDynamicComponents() {
    let container = this.elementRef.nativeElement;
    this.userService.allUsers.forEach(user => {
      const regex = new RegExp(`@${user.id}`, 'g');
      container.innerHTML = container.innerHTML.replace(regex, `<span class="dynamic-user" data-userid="${user.id}">${user.name}</span>`);
    });

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

  // TODO: move to own directive?
  @HostListener('paste', ['$event'])
  handlePaste(event: ClipboardEvent): void {
    // Prevent the default paste behavior
    event.preventDefault();

    // Get the text from the clipboard
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    const text = clipboardData.getData('text');

    // Insert the text into the contenteditable div
    document.execCommand('insertText', false, text);
  }

}
