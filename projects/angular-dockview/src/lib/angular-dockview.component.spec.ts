import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularDockviewComponent } from './angular-dockview.component';

describe('AngularDockviewComponent', () => {
  let component: AngularDockviewComponent;
  let fixture: ComponentFixture<AngularDockviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AngularDockviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AngularDockviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
