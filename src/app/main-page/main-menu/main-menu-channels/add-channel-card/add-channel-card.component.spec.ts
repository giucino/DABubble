import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChannelCardComponent } from './add-channel-card.component';

describe('AddChannelCardComponent', () => {
  let component: AddChannelCardComponent;
  let fixture: ComponentFixture<AddChannelCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddChannelCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddChannelCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
