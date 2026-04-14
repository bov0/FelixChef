import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RecipeCardComponent } from './recipe-card.component';
import { Recipe } from '../../../core/recipe.model';
import { ActivatedRoute } from '@angular/router';
import { convertToParamMap } from '@angular/router';

describe('RecipeCardComponent', () => {
  let component: RecipeCardComponent;
  let fixture: ComponentFixture<RecipeCardComponent>;

  const mockRecipe: Recipe = {
    id: '1',
    title: 'Test Recipe',
    description: 'Test Description',
    youtubeUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    createdAt: new Date().toISOString(),
    ingredients: [
      { ingredientId: '1', name: 'Salt', icon: '🧂', quantity: '2 cups' },
      { ingredientId: '2', name: 'Sugar', icon: '🍬', quantity: '1 tbsp' },
      { ingredientId: '3', name: 'Pepper', icon: '🌶️', quantity: '3 tbsp' },
      { ingredientId: '4', name: 'Oil', icon: '🫒', quantity: '1 tsp' },
      { ingredientId: '5', name: 'Garlic', icon: '🧄', quantity: '2 tsp' }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeCardComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({}) } }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeCardComponent);
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

  it('should preview first 4 ingredients', () => {
    const preview = component.previewIngredients();
    expect(preview.length).toBe(4);
    expect(preview).toEqual(mockRecipe.ingredients.slice(0, 4));
  });

  it('should emit openVideo when handleCardClick is called', () => {
    spyOn(component.openVideo, 'emit');
    component.handleCardClick();
    expect(component.openVideo.emit).toHaveBeenCalledWith(mockRecipe.youtubeUrl);
  });

  it('should have required Input decorator for recipe', () => {
    const metadata = (RecipeCardComponent as any).ɵcmp;
    const inputKeys = Object.keys(metadata.inputs || {});
    expect(inputKeys).toContain('recipe');
  });

  it('should handle empty ingredients list', () => {
    component.recipe = { ...mockRecipe, ingredients: [] };
    const preview = component.previewIngredients();
    expect(preview.length).toBe(0);
  });

  it('should handle ingredients with less than 4 items', () => {
    component.recipe = { ...mockRecipe, ingredients: mockRecipe.ingredients.slice(0, 2) };
    const preview = component.previewIngredients();
    expect(preview.length).toBe(2);
  });
});
