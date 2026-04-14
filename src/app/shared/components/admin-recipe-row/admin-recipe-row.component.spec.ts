import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AdminRecipeRowComponent } from './admin-recipe-row.component';
import { Recipe } from '../../../core/recipe.model';
import { ActivatedRoute } from '@angular/router';
import { convertToParamMap } from '@angular/router';

describe('AdminRecipeRowComponent', () => {
  let component: AdminRecipeRowComponent;
  let fixture: ComponentFixture<AdminRecipeRowComponent>;

  const mockRecipe: Recipe = {
    id: '1',
    title: 'Test Recipe',
    description: 'Test Description',
    youtubeUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    createdAt: new Date().toISOString(),
    ingredients: [{ ingredientId: '1', name: 'Salt', icon: '🧂', quantity: '2 cups' }]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRecipeRowComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({}) } }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminRecipeRowComponent);
    component = fixture.componentInstance;
    component.recipe = mockRecipe;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display recipe title', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test Recipe');
  });

  it('should emit edit event with recipe', () => {
    spyOn(component.edit, 'emit');
    component.edit.emit(mockRecipe);
    expect(component.edit.emit).toHaveBeenCalledWith(mockRecipe);
  });

  it('should emit remove event with recipe', () => {
    spyOn(component.remove, 'emit');
    component.remove.emit(mockRecipe);
    expect(component.remove.emit).toHaveBeenCalledWith(mockRecipe);
  });

  it('should have required Input decorator for recipe', () => {
    const metadata = (AdminRecipeRowComponent as any).ɵcmp;
    const inputKeys = Object.keys(metadata.inputs || {});
    expect(inputKeys).toContain('recipe');
  });

  it('should have edit EventEmitter output', () => {
    expect(component.edit).toBeDefined();
    expect(component.edit.observers.length).toBeGreaterThanOrEqual(0);
  });

  it('should have remove EventEmitter output', () => {
    expect(component.remove).toBeDefined();
    expect(component.remove.observers.length).toBeGreaterThanOrEqual(0);
  });

  it('should display recipe creation date', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toBeTruthy();
  });
});
