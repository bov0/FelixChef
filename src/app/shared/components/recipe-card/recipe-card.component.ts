import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Recipe } from '../../../core/recipe.model';
import { TEXTS } from '../../../i18n/texts';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  templateUrl: './recipe-card.component.html'
})
export class RecipeCardComponent {
  @Input({ required: true }) recipe!: Recipe;
  @Output() openVideo = new EventEmitter<string>();
  readonly texts = TEXTS.recipeCard;

  previewIngredients() {
    return this.recipe.ingredients.slice(0, 4);
  }

  handleCardClick(): void {
    this.openVideo.emit(this.recipe.youtubeUrl);
  }
}
