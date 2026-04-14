import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HomePageComponent } from './home-page.component';
import { RecipesService } from '../../../../core/recipes.service';
import { IngredientsService } from '../../../../core/ingredients.service';
import { Recipe, IngredientOption } from '../../../../core/recipe.model';
import { ActivatedRoute, Router } from '@angular/router';
import { convertToParamMap } from '@angular/router';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;
  let recipesService: jasmine.SpyObj<RecipesService>;
  let ingredientsService: jasmine.SpyObj<IngredientsService>;

  const mockRecipes: Recipe[] = [
    {
      id: '1',
      title: 'Test Recipe',
      description: 'Test Description',
      youtubeUrl: 'https://youtube.com/watch?v=test',
      thumbnailUrl: 'https://img.youtube.com/vi/test/hqdefault.jpg',
      createdAt: new Date().toISOString(),
      ingredients: []
    }
  ];

  const mockIngredients: IngredientOption[] = [
    { id: '1', name: 'Salt', icon: '🧂' },
    { id: '2', name: 'Sugar', icon: '🍬' }
  ];

  beforeEach(async () => {
    const recipesSpy = jasmine.createSpyObj('RecipesService', ['listRecipes']);
    const ingredientsSpy = jasmine.createSpyObj('IngredientsService', ['listIngredients']);

    recipesSpy.listRecipes.and.returnValue(Promise.resolve(mockRecipes));
    ingredientsSpy.listIngredients.and.returnValue(Promise.resolve(mockIngredients));

    await TestBed.configureTestingModule({
      imports: [HomePageComponent],
      providers: [
        { provide: RecipesService, useValue: recipesSpy },
        { provide: IngredientsService, useValue: ingredientsSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({}) } }
        }
      ]
    }).compileComponents();

    recipesService = TestBed.inject(RecipesService) as jasmine.SpyObj<RecipesService>;
    ingredientsService = TestBed.inject(IngredientsService) as jasmine.SpyObj<IngredientsService>;

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load recipes and ingredients on init', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    expect(recipesService.listRecipes).toHaveBeenCalled();
    expect(ingredientsService.listIngredients).toHaveBeenCalled();
    expect(component.recipes()).toEqual(mockRecipes);
    expect(component.allIngredients()).toEqual(mockIngredients);
  });

  it('should toggle filter', () => {
    component.toggleFilter('1');
    expect(component.activeFilters()).toEqual(['1']);

    component.toggleFilter('1');
    expect(component.activeFilters()).toEqual([]);
  });

  it('should clear filters', () => {
    component.activeFilters.set(['1']);
    component.clearFilters();
    expect(component.activeFilters()).toEqual([]);
  });

  it('should filter recipes by ingredient', () => {
    const recipesWithIngredient = [
      {
        ...mockRecipes[0],
        ingredients: [{ ingredientId: '1', name: 'Salt', icon: '🧂', quantity: '1 tsp' }]
      }
    ];
    component.recipes.set(recipesWithIngredient);
    component.toggleFilter('1');

    expect(component.filteredRecipes().length).toBeGreaterThan(0);
  });

  it('should paginate recipes 6 per page', () => {
    const manyRecipes = Array.from({ length: 14 }, (_, index) => ({
      id: String(index + 1),
      title: `Recipe ${index + 1}`,
      description: '',
      youtubeUrl: '',
      thumbnailUrl: '',
      createdAt: new Date(2024, 0, 1 + index).toISOString(),
      ingredients: []
    }));

    component.recipes.set(manyRecipes);
    component.clearFilters();

    expect(component.paginatedRecipes().length).toBe(6);
    expect(component.pageCount()).toBe(3);

    component.nextPage();
    expect(component.currentPage()).toBe(2);
    expect(component.paginatedRecipes()[0].id).toBe('8');

    component.nextPage();
    expect(component.currentPage()).toBe(3);
    expect(component.paginatedRecipes()[0].id).toBe('2');

    component.previousPage();
    expect(component.currentPage()).toBe(2);
  });

  it('should open recipe video', () => {
    spyOn(window, 'open');
    component.openRecipeVideo('https://youtube.com/watch?v=test');
    expect(window.open).toHaveBeenCalledWith('https://youtube.com/watch?v=test', '_blank', 'noopener,noreferrer');
  });

  it('should sort recipes by default (date-desc)', () => {
    const recipes = [
      {
        id: '1',
        title: 'Older Recipe',
        description: '',
        youtubeUrl: '',
        thumbnailUrl: '',
        createdAt: new Date(2024, 0, 1).toISOString(),
        ingredients: []
      },
      {
        id: '2',
        title: 'Newer Recipe',
        description: '',
        youtubeUrl: '',
        thumbnailUrl: '',
        createdAt: new Date(2024, 11, 31).toISOString(),
        ingredients: []
      }
    ];
    component.recipes.set(recipes);
    expect(component.filteredRecipes()[0].id).toBe('2');
  });
})
