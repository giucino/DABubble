import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appPasteAsText]',
  standalone: true,
})
export class PasteAsTextDirective {
  constructor() {}

  @HostListener('paste', ['$event'])
  handlePaste(event: ClipboardEvent): void {
    event.preventDefault();
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    const text = clipboardData.getData('text');
    document.execCommand('insertText', false, text);
  }
}
