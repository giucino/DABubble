import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEmojiPickerComponent } from './dialog-emoji-picker.component';

describe('DialogEmojiPickerComponent', () => {
  let component: DialogEmojiPickerComponent;
  let fixture: ComponentFixture<DialogEmojiPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogEmojiPickerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogEmojiPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
