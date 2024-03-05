import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedUserTagComponent } from './selected-user-tag.component';

describe('SelectedUserTagComponent', () => {
  let component: SelectedUserTagComponent;
  let fixture: ComponentFixture<SelectedUserTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectedUserTagComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectedUserTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
