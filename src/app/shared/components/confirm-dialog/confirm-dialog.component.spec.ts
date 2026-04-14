import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { convertToParamMap } from '@angular/router';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({}) } }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.open).toBe(false);
    expect(component.title).toBe('');
    expect(component.message).toBe('');
    expect(component.items).toEqual([]);
    expect(component.confirmLabel).toBe('Confirmar');
    expect(component.cancelLabel).toBe('Cancelar');
  });

  it('should display title when open is true', () => {
    component.open = true;
    component.title = 'Confirm Action';
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Confirm Action');
  });

  it('should display message when open is true', () => {
    component.open = true;
    component.message = 'Are you sure?';
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Are you sure?');
  });

  it('should emit confirm event when confirm button is clicked', () => {
    spyOn(component.confirm, 'emit');
    component.open = true;
    fixture.detectChanges();

    const buttons = debugElement.queryAll(By.css('button'));
    const confirmButton = buttons.find(btn => btn.nativeElement.textContent.includes(component.confirmLabel));

    if (confirmButton) {
      confirmButton.nativeElement.click();
    }

    expect(component.confirm.emit).toHaveBeenCalled();
  });

  it('should emit cancel event when cancel button is clicked', () => {
    spyOn(component.cancel, 'emit');
    component.open = true;
    fixture.detectChanges();

    const buttons = debugElement.queryAll(By.css('button'));
    const cancelButton = buttons.find(btn => btn.nativeElement.textContent.includes(component.cancelLabel));

    if (cancelButton) {
      cancelButton.nativeElement.click();
    }

    expect(component.cancel.emit).toHaveBeenCalled();
  });

  it('should display items when provided', () => {
    component.open = true;
    component.items = ['Item 1', 'Item 2', 'Item 3'];
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    component.items.forEach(item => {
      expect(compiled.textContent).toContain(item);
    });
  });

  it('should not show dialog when open is false', () => {
    component.open = false;
    fixture.detectChanges();

    const dialogContent = debugElement.query(By.css('[role="dialog"]'));
    expect(dialogContent).toBeFalsy();
  });

  it('should use custom button labels', () => {
    component.open = true;
    component.confirmLabel = 'Accept';
    component.cancelLabel = 'Reject';
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Accept');
    expect(compiled.textContent).toContain('Reject');
  });
});
