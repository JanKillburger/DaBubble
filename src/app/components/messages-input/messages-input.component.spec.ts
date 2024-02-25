import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesInputComponent } from './messages-input.component';

describe('MessagesInputComponent', () => {
  let component: MessagesInputComponent;
  let fixture: ComponentFixture<MessagesInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessagesInputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MessagesInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
