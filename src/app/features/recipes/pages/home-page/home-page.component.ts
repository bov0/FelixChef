import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LayoutShellComponent } from '../../../../shared/layout-shell/layout-shell.component';
import { IngredientsService } from '../../../../core/ingredients.service';
import { IngredientOption } from '../../../../core/recipe.model';
import { RecipesService } from '../../../../core/recipes.service';
import { RecipeCardComponent } from '../../../../shared/components/recipe-card/recipe-card.component';
import { SortSelectComponent, SortOption } from '../../../../shared/components/sort-select/sort-select.component';
import { TEXTS } from '../../../../i18n/texts';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, LayoutShellComponent, RecipeCardComponent, SortSelectComponent],
  templateUrl: './home-page.component.html'
})
export class HomePageComponent {
  readonly recipes = signal<any[]>([]);
  readonly allIngredients = signal<IngredientOption[]>([]);
  readonly activeFilters = signal<string[]>([]);
  readonly selectedIngredient = signal<string>('');
  readonly texts = TEXTS;
  readonly sortOptions: SortOption[] = TEXTS.home.sortOptions;
  sortSelection: 'date-desc' | 'date-asc' | 'title-asc' | 'title-desc' = 'date-desc';

  updateSortSelection(value: string): void {
    this.sortSelection = value as 'date-desc' | 'date-asc' | 'title-asc' | 'title-desc';
  }

  readonly selectedIngredients = computed(() =>
    this.activeFilters()
      .map(id => this.allIngredients().find(ingredient => ingredient.id === id))
      .filter(Boolean) as IngredientOption[]
  );

  readonly pageSize = 6;
  readonly currentPage = signal(1);

  readonly filteredRecipes = computed(() => {
    const filters = this.activeFilters();
    const filtered = !filters.length
      ? this.recipes()
      : this.recipes().filter((recipe) =>
          filters.every(filterId =>
            recipe.ingredients.some((ingredient: any) => ingredient.ingredientId === filterId)
          )
        );

    return [...filtered].sort((left: any, right: any) => {
      switch (this.sortSelection) {
        case 'date-asc':
          return new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();
        case 'title-asc':
          return left.title.localeCompare(right.title, 'es');
        case 'title-desc':
          return right.title.localeCompare(left.title, 'es');
        case 'date-desc':
        default:
          return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
      }
    });
  });

  readonly paginatedRecipes = computed(() => {
    const recipes = this.filteredRecipes();
    const start = (this.currentPage() - 1) * this.pageSize;
    return recipes.slice(start, start + this.pageSize);
  });

  readonly pageCount = computed(() => Math.max(1, Math.ceil(this.filteredRecipes().length / this.pageSize)));

  constructor(
    private readonly recipesService: RecipesService,
    private readonly ingredientsService: IngredientsService
  ) {
    void this.loadData();
  }

  toggleFilter(ingredientId: string): void {
    const current = this.activeFilters();
    const next = current.includes(ingredientId)
      ? current.filter(id => id !== ingredientId)
      : [...current, ingredientId];

    this.activeFilters.set(next);
    this.selectedIngredient.set('');
    this.currentPage.set(1);
  }

  clearFilters(): void {
    this.activeFilters.set([]);
    this.selectedIngredient.set('');
    this.currentPage.set(1);
  }

  selectIngredient(event: Event): void {
    const ingredientId = (event.target as HTMLSelectElement).value;
    if (!ingredientId) {
      return;
    }

    this.toggleFilter(ingredientId);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.pageCount()) {
      return;
    }

    this.currentPage.set(page);
  }

  nextPage(): void {
    if (this.currentPage() < this.pageCount()) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }

  openRecipeVideo(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  private async loadData(): Promise<void> {
    const [recipes, ingredients] = await Promise.all([
      this.recipesService.listRecipes(),
      this.ingredientsService.listIngredients()
    ]);

    this.recipes.set(recipes);
    this.allIngredients.set(ingredients);
  }
}
