import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CursorPositionService {

  lastCursorPosition : number = 0;
  lastElement : any;

  constructor() { }

  setLastCursorPosition(container: HTMLElement) {
    this.lastCursorPosition = this.saveCursorPosition(container);
    // this.lastELemet = container;
  }


  saveCursorPosition(container: HTMLElement): number {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return 0;
    }
  
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
// Funktion zum Wiederherstellen der Position innerhalb eines Containers
// restoreCursorPosition(container: HTMLElement): Range | null {
//   if (!this.lastElement || this.lastCursorPosition == null) {
//     console.error('No valid last element or cursor position found.');
//     return null;
//   }

//   const range = document.createRange();
//   const selection = window.getSelection();
//   if (!selection) {
//     return null;
//   }

//   let charIndex = 0;
//   let nodeStack: Node[] = [container];
//   let node: Node | undefined;

//   while ((node = nodeStack.pop()) != undefined) {
//     if (node.nodeType === Node.TEXT_NODE) {
//       const nextCharIndex = charIndex + node.textContent!.length;
//       if (this.lastCursorPosition <= nextCharIndex) {
//         range.setStart(node, this.lastCursorPosition - charIndex);
//         range.setEnd(node, this.lastCursorPosition - charIndex);
//         break;
//       }
//       charIndex = nextCharIndex;
//     } else if (node.nodeType === Node.ELEMENT_NODE) {
//       if (node.nodeName === 'BR') {
//         charIndex++;
//       }
//       for (let i = node.childNodes.length - 1; i >= 0; i--) {
//         nodeStack.push(node.childNodes[i]);
//       }
//     }
//   }

//   range.collapse(true);
//   selection.removeAllRanges();
//   selection.addRange(range);

//   return range;
// }

restoreCursorPosition(container: HTMLElement): Range | null {
  if (!this.lastElement || this.lastCursorPosition == null) {
    console.error('No valid last element or cursor position found.');
    return null;
  }

  // create text node inside empty div
  if (!container.hasChildNodes()) {
    const textNode = document.createTextNode('');
    container.appendChild(textNode);
  }

  const range = document.createRange();
  const selection = window.getSelection();
  if (!selection) {
    return null;
  }

  let charIndex = 0;
  let nodeStack: Node[] = [container];
  let node: Node | undefined;

  while ((node = nodeStack.pop()) != undefined) {
    if (node.nodeType === Node.TEXT_NODE) {
      const nextCharIndex = charIndex + node.textContent!.length;
      if (this.lastCursorPosition <= nextCharIndex) {
        range.setStart(node, this.lastCursorPosition - charIndex);
        range.setEnd(node, this.lastCursorPosition - charIndex);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        return range;
      }
      charIndex = nextCharIndex;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.nodeName === 'BR') {
        charIndex++;
      }
      for (let i = node.childNodes.length - 1; i >= 0; i--) {
        nodeStack.push(node.childNodes[i]);
      }
    }
  }

  console.error('Failed to find a valid text node to restore the cursor position.');
  return null;
}

}
