import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersToChannelComponent } from './users-to-channel.component';

describe('UsersToChannelComponent', () => {
  let component: UsersToChannelComponent;
  let fixture: ComponentFixture<UsersToChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersToChannelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsersToChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
