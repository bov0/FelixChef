import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Recipe } from '../../../core/recipe.model';
import { TEXTS } from '../../../i18n/texts';

@Component({
  selector: 'app-admin-recipe-row',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './admin-recipe-row.component.html'
})
export class AdminRecipeRowComponent {
  @Input({ required: true }) recipe!: Recipe;
  @Output() edit = new EventEmitter<Recipe>();
  @Output() remove = new EventEmitter<Recipe>();
  readonly texts = TEXTS.admin;
}
