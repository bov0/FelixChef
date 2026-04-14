import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AdminPageComponent } from './admin-page.component';
import { RecipesService } from '../../../../core/recipes.service';
import { IngredientsService } from '../../../../core/ingredients.service';
import { YoutubeMetadataService } from '../../../../core/youtube-metadata.service';
import { Recipe, IngredientOption } from '../../../../core/recipe.model';
import { ActivatedRoute } from '@angular/router';
import { convertToParamMap } from '@angular/router';

describe('AdminPageComponent', () => {
  let component: AdminPageComponent;
  let fixture: ComponentFixture<AdminPageComponent>;
  let recipesService: jasmine.SpyObj<RecipesService>;
  let ingredientsService: jasmine.SpyObj<IngredientsService>;
  let youtubeMetadataService: jasmine.SpyObj<YoutubeMetadataService>;

  const mockIngredients: IngredientOption[] = [
    { id: '1', name: 'Salt', icon: '🧂' },
    { id: '2', name: 'Sugar', icon: '🍬' }
  ];

  const mockRecipes: Recipe[] = [
    {
      id: '1',
      title: 'Test Recipe',
      description: 'Test',
      youtubeUrl: 'https://youtube.com/watch?v=test',
      thumbnailUrl: 'https://img.youtube.com/vi/test/hqdefault.jpg',
      createdAt: new Date().toISOString(),
      ingredients: []
    }
  ];

  beforeEach(async () => {
    const recipesSpy = jasmine.createSpyObj('RecipesService', [
      'listRecipes',
      'createRecipe',
      'updateRecipe',
      'deleteRecipe'
    ]);
    const ingredientsSpy = jasmine.createSpyObj('IngredientsService', [
      'listIngredients',
      'createIngredient',
      'deleteIngredient'
    ]);
    const youtubeMetadataSpy = jasmine.createSpyObj('YoutubeMetadataService', ['getVideoMetadata']);

    recipesSpy.listRecipes.and.returnValue(Promise.resolve(mockRecipes));
    ingredientsSpy.listIngredients.and.returnValue(Promise.resolve(mockIngredients));
    youtubeMetadataSpy.getVideoMetadata.and.returnValue(Promise.resolve({}));

    await TestBed.configureTestingModule({
      imports: [AdminPageComponent],
      providers: [
        { provide: RecipesService, useValue: recipesSpy },
        { provide: IngredientsService, useValue: ingredientsSpy },
        { provide: YoutubeMetadataService, useValue: youtubeMetadataSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({}) } }
        }
      ]
    }).compileComponents();

    recipesService = TestBed.inject(RecipesService) as jasmine.SpyObj<RecipesService>;
    ingredientsService = TestBed.inject(IngredientsService) as jasmine.SpyObj<IngredientsService>;
    youtubeMetadataService = TestBed.inject(YoutubeMetadataService) as jasmine.SpyObj<YoutubeMetadataService>;
    fixture = TestBed.createComponent(AdminPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load ingredients and recipes on init', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    expect(ingredientsService.listIngredients).toHaveBeenCalled();
    expect(recipesService.listRecipes).toHaveBeenCalled();
    expect(component.ingredients()).toEqual(mockIngredients);
    expect(component.adminRecipes()).toEqual(mockRecipes);
  });

  it('should check if ingredient is selected', () => {
    component.selectedIngredients.set([{ ingredientId: '1', name: 'Salt', icon: '🧂', quantity: '' }]);
    expect(component.isSelected('1')).toBe(true);
    expect(component.isSelected('2')).toBe(false);
  });

  it('should initialize with proper default values', () => {
    expect(component.title).toBe('');
    expect(component.youtubeUrl).toBe('');
    expect(component.description).toBe('');
    expect(component.newIngredientName).toBe('');
    expect(component.newIngredientIcon).toBe('');
  });

  it('should start with editor tab active', () => {
    expect(component.activeTab()).toBe('editor');
  });

  it('should have canSubmit computed property', () => {
    component.title = '';
    expect(component.canSubmit()).toBe(false);

    component.title = 'Valid Title';
    expect(component.canSubmit()).toBe(false);
  });

  it('should have correct error and message signals', () => {
    expect(component.error()).toBe('');
    expect(component.message()).toBe('');
  });
});
