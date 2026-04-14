import { TestBed, ComponentFixture } from '@angular/core/testing';
import { SortSelectComponent, SortOption } from './sort-select.component';

describe('SortSelectComponent', () => {
  let component: SortSelectComponent;
  let fixture: ComponentFixture<SortSelectComponent>;

  const options: SortOption[] = [
    { value: 'date-desc', label: 'Fecha desc' },
    { value: 'date-asc', label: 'Fecha asc' },
    { value: 'title-asc', label: 'Titulo A-Z' },
    { value: 'title-desc', label: 'Titulo Z-A' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SortSelectComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SortSelectComponent);
    component = fixture.componentInstance;
    component.label = 'Ordenar por';
    component.mobileLabel = 'Fecha desc';
    component.options = options;
    component.value = 'date-desc';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit valueChange when selection changes', () => {
    spyOn(component.valueChange, 'emit');
    fixture.detectChanges();

    const select = fixture.nativeElement.querySelector('select') as HTMLSelectElement;
    select.value = 'title-asc';
    select.dispatchEvent(new Event('change'));

    expect(component.valueChange.emit).toHaveBeenCalledWith('title-asc');
  });

  it('should render all options', () => {
    fixture.detectChanges();
    const optionElements = fixture.nativeElement.querySelectorAll('option');
    expect(optionElements.length).toBe(4);
    expect(optionElements[0].textContent.trim()).toBe('Fecha desc');
  });
});
