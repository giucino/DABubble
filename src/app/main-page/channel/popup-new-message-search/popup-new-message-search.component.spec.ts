import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupNewMessageSearchComponent } from './popup-new-message-search.component';

describe('PopupNewMessageSearchComponent', () => {
  let component: PopupNewMessageSearchComponent;
  let fixture: ComponentFixture<PopupNewMessageSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupNewMessageSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopupNewMessageSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
