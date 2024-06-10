import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CursorPositionService {
  lastCursorPosition: number = 0;
  lastElement: any;

  constructor() {}

  setLastCursorPosition(container: HTMLElement) {
    this.lastCursorPosition = this.saveCursorPosition(container);
  }

  saveCursorPosition(container: HTMLElement): number {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return 0;
    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(container);
    preCaretRange.setEnd(range.startContainer, range.startOffset);
    const preCaretText = this.getTextWithLineBreaks(preCaretRange);
    this.lastElement = container;
    this.lastCursorPosition = preCaretText.length;
    return this.lastCursorPosition;
  }

  getTextWithLineBreaks(range: Range): string {
    const div = document.createElement('div');
    div.appendChild(range.cloneContents());
    return div.innerHTML
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/?p>/gi, '\n')
      .replace(/<\/?div>/gi, '\n')
      .replace(/&nbsp;/g, ' ')
      .replace(/<[^>]+>/g, '');
  }

  //#region  restore position
  restoreCursorPosition(container: HTMLElement): Range | null {

    if (!container.hasChildNodes()) this.addTextNodeToContainer(container);

    const range = document.createRange();
    const selection = window.getSelection();
    let charIndex = 0;
    let nodeStack: Node[] = [container];
    let node: Node | undefined;

    if(selection) {
      while ((node = nodeStack.pop()) != undefined) {
        if (node.nodeType === Node.TEXT_NODE) {
          const nextCharIndex = charIndex + node.textContent!.length;
          if (this.lastCursorPosition <= nextCharIndex) {
            let parentElement = node.parentElement;
            while (parentElement && parentElement !== container) {
              if (parentElement.classList.contains('tag')) return this.setRangeAfterParentElement(range, parentElement, selection);
              parentElement = parentElement.parentElement;
            }
            return this.setRange(range, node, charIndex, selection);
          }
          charIndex = nextCharIndex;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.nodeName === 'BR') charIndex++;
          for (let i = node.childNodes.length - 1; i >= 0; i--) nodeStack.push(node.childNodes[i]);
        }
      }
    }
   
    return null; // fail
  }

  addTextNodeToContainer(container: HTMLElement) {
    const textNode = document.createTextNode('');
    container.appendChild(textNode);
  }

  setRangeAfterParentElement(range : Range, parentElement: HTMLElement, selection: Selection) {
    range.setStartAfter(parentElement);
    range.setEndAfter(parentElement);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    return range;
  }

  setRange(range: Range, node: Node, charIndex: number, selection: Selection) {
    range.setStart(node, this.lastCursorPosition - charIndex);
    range.setEnd(node, this.lastCursorPosition - charIndex);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    return range;
  }


  //#endregion restore position
}
