import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LayoutShellComponent } from '../../../../shared/layout-shell/layout-shell.component';
import { Recipe } from '../../../../core/recipe.model';
import { RecipesService } from '../../../../core/recipes.service';
import { TEXTS } from '../../../../i18n/texts';

@Component({
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink, LayoutShellComponent],
  templateUrl: './recipe-detail-page.component.html'
})
export class RecipeDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly recipesService = inject(RecipesService);

  readonly recipe = signal<Recipe | null>(null);
  readonly texts = TEXTS.recipeDetail;

  constructor() {
    void this.loadRecipe();
  }

  private async loadRecipe(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.recipe.set(null);
      return;
    }

    this.recipe.set(await this.recipesService.getRecipeById(id));
  }
}
