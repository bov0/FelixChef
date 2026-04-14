import { convertToParamMap } from '@angular/router';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RecipeDetailPageComponent } from './recipe-detail-page.component';
import { RecipesService } from '../../../../core/recipes.service';
import { Recipe } from '../../../../core/recipe.model';

describe('RecipeDetailPageComponent', () => {
  let component: RecipeDetailPageComponent;
  let fixture: ComponentFixture<RecipeDetailPageComponent>;
  let recipesService: jasmine.SpyObj<RecipesService>;

  const mockRecipe: Recipe = {
    id: '1',
    title: 'Test Recipe',
    description: 'Delicious test recipe',
    youtubeUrl: 'https://youtube.com/watch?v=test',
    thumbnailUrl: 'https://img.youtube.com/vi/test/hqdefault.jpg',
    createdAt: new Date().toISOString(),
    ingredients: [
      { ingredientId: '1', name: 'Salt', icon: '🧂', quantity: '2 cups' },
      { ingredientId: '2', name: 'Sugar', icon: '🍬', quantity: '1 tbsp' }
    ]
  };

  beforeEach(async () => {
    const recipesSpy = jasmine.createSpyObj('RecipesService', ['getRecipeById']);
    recipesSpy.getRecipeById.and.returnValue(Promise.resolve(mockRecipe));

    await TestBed.configureTestingModule({
      imports: [RecipeDetailPageComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: '1' }) } }
        },
        { provide: RecipesService, useValue: recipesSpy }
      ]
    }).compileComponents();

    recipesService = TestBed.inject(RecipesService) as jasmine.SpyObj<RecipesService>;
    fixture = TestBed.createComponent(RecipeDetailPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load recipe on init', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    expect(recipesService.getRecipeById).toHaveBeenCalledWith('1');
    expect(component.recipe()).toEqual(mockRecipe);
  });

  it('should handle missing recipe id', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [RecipeDetailPageComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({}) } }
        },
        {
          provide: RecipesService,
          useValue: { getRecipeById: async () => null }
        }
      ]
    }).compileComponents();

    const newFixture = TestBed.createComponent(RecipeDetailPageComponent);
    newFixture.detectChanges();
    await newFixture.whenStable();

    expect(newFixture.componentInstance.recipe()).toBeNull();
  });

  it('should display recipe data when available', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test Recipe');
  });
})
