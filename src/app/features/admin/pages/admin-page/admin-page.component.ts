import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LayoutShellComponent } from '../../../../shared/layout-shell/layout-shell.component';
import { IngredientsService } from '../../../../core/ingredients.service';
import { IngredientOption, Recipe, RecipeIngredient } from '../../../../core/recipe.model';
import { RecipesService } from '../../../../core/recipes.service';
import { YoutubeMetadataService } from '../../../../core/youtube-metadata.service';
import { extractYoutubeId, getYoutubeThumbnail } from '../../../../core/youtube.utils';
import { AdminRecipeRowComponent } from '../../../../shared/components/admin-recipe-row/admin-recipe-row.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { TEXTS } from '../../../../i18n/texts';

type AdminTab = 'editor' | 'recipes' | 'ingredients';
type IngredientDraft = { name: string; icon: string };

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LayoutShellComponent,
    AdminRecipeRowComponent,
    ConfirmDialogComponent
  ],
  templateUrl: './admin-page.component.html'
})
export class AdminPageComponent {
  title = '';
  youtubeUrl = '';
  description = '';
  newIngredientName = '';
  newIngredientIcon = '';

  readonly message = signal('');
  readonly error = signal('');
  readonly ingredientWarning = signal('');
  readonly shouldShakeIngredients = signal(false);
  readonly ingredients = signal<IngredientOption[]>([]);
  readonly selectedIngredients = signal<RecipeIngredient[]>([]);
  readonly adminRecipes = signal<Recipe[]>([]);
  readonly activeTab = signal<AdminTab>('editor');
  readonly editingRecipeId = signal<string | null>(null);

  readonly duplicateEmojiDialogOpen = signal(false);
  readonly duplicateNameDialogOpen = signal(false);
  readonly deleteIngredientDialogOpen = signal(false);
  readonly deleteRecipeDialogOpen = signal(false);
  readonly duplicateEmojiMatches = signal<string[]>([]);
  readonly duplicateNameMatches = signal<string[]>([]);
  readonly ingredientPendingDelete = signal<IngredientOption | null>(null);
  readonly recipePendingDelete = signal<Recipe | null>(null);
  readonly texts = TEXTS.admin;
  readonly messages = TEXTS.messages;

  private pendingIngredientDraft: IngredientDraft | null = null;
  private lastMetadataVideoId = '';

  readonly canSubmit = computed(
    () =>
      this.title.trim().length > 0 &&
      this.isYoutubeUrlValid() &&
      this.selectedIngredients().length > 0
  );

  constructor(
    private readonly recipesService: RecipesService,
    private readonly ingredientsService: IngredientsService,
    private readonly youtubeMetadataService: YoutubeMetadataService
  ) {
    void this.loadIngredients();
    void this.loadRecipes();
  }

  isSelected(ingredientId: string): boolean {
    return this.selectedIngredients().some((ingredient) => ingredient.ingredientId === ingredientId);
  }

  toggleIngredient(ingredient: IngredientOption): void {
    if (this.isSelected(ingredient.id)) {
      this.removeIngredient(ingredient.id);
      return;
    }

    this.selectedIngredients.update((items) => [
      ...items,
      {
        ingredientId: ingredient.id,
        name: ingredient.name,
        icon: ingredient.icon,
        quantity: ''
      }
    ]);

    if (this.selectedIngredients().length > 0) {
      this.ingredientWarning.set('');
      this.shouldShakeIngredients.set(false);
    }
  }

  updateQuantity(ingredientId: string, quantity: string): void {
    this.selectedIngredients.update((items) =>
      items.map((ingredient) =>
        ingredient.ingredientId === ingredientId ? { ...ingredient, quantity } : ingredient
      )
    );
  }

  removeIngredient(ingredientId: string): void {
    this.selectedIngredients.update((items) =>
      items.filter((ingredient) => ingredient.ingredientId !== ingredientId)
    );
  }

  async onYoutubeUrlChange(value: string): Promise<void> {
    this.youtubeUrl = value;

    const videoId = extractYoutubeId(this.youtubeUrl.trim());
    if (!videoId || videoId === this.lastMetadataVideoId) {
      return;
    }

    this.lastMetadataVideoId = videoId;

    const metadata = await this.youtubeMetadataService.getVideoMetadata(this.youtubeUrl.trim());
    if (!metadata) {
      return;
    }

    if (!this.title.trim()) {
      this.title = metadata.title;
    }
  }

  async submit(): Promise<void> {
    this.error.set('');
    this.ingredientWarning.set('');
    this.message.set('');

    if (!this.canSubmit()) {
      if (this.selectedIngredients().length === 0) {
        this.ingredientWarning.set(this.messages.selectIngredientRequired);
        this.triggerIngredientShake();
      }

      this.error.set(this.messages.fillRequiredFields);
      return;
    }

    const draft = {
      title: this.title.trim(),
      youtubeUrl: this.youtubeUrl.trim(),
      ingredients: this.selectedIngredients().map((ingredient) => ({
        ...ingredient,
        quantity: ingredient.quantity.trim()
      })),
      description: this.description.trim()
    };

    const result = this.editingRecipeId()
      ? await this.recipesService.updateRecipe(this.editingRecipeId()!, draft)
      : await this.recipesService.createRecipe(draft);

    if (result.error) {
      this.error.set(result.error);
      return;
    }

    this.message.set(
      this.editingRecipeId() ? this.messages.recipeUpdated : this.messages.recipeSaved
    );
    this.resetForm();
    await this.loadRecipes();
    this.activeTab.set('recipes');
  }

  async loadRecipes(): Promise<void> {
    this.adminRecipes.set(await this.recipesService.listRecipes());
  }

  startEditing(recipe: Recipe): void {
    this.editingRecipeId.set(recipe.id);
    this.title = recipe.title;
    this.youtubeUrl = recipe.youtubeUrl;
    this.description = recipe.description;
    this.selectedIngredients.set(recipe.ingredients.map((ingredient) => ({ ...ingredient })));
    this.lastMetadataVideoId = extractYoutubeId(recipe.youtubeUrl) ?? '';
    this.message.set('');
    this.error.set('');
    this.activeTab.set('editor');
  }

  askDeleteRecipe(recipe: Recipe): void {
    this.recipePendingDelete.set(recipe);
    this.deleteRecipeDialogOpen.set(true);
  }

  async confirmDeleteRecipe(): Promise<void> {
    const recipe = this.recipePendingDelete();
    if (!recipe) {
      return;
    }

    this.deleteRecipeDialogOpen.set(false);
    const result = await this.recipesService.deleteRecipe(recipe.id);
    if (result.error) {
      this.error.set(result.error);
      return;
    }

    if (this.editingRecipeId() === recipe.id) {
      this.resetForm();
    }

    this.message.set(this.messages.recipeDeleted);
    this.recipePendingDelete.set(null);
    await this.loadRecipes();
  }

  cancelDeleteRecipe(): void {
    this.deleteRecipeDialogOpen.set(false);
    this.recipePendingDelete.set(null);
  }

  resetForm(): void {
    this.editingRecipeId.set(null);
    this.title = '';
    this.youtubeUrl = '';
    this.description = '';
    this.selectedIngredients.set([]);
    this.ingredientWarning.set('');
    this.shouldShakeIngredients.set(false);
    this.lastMetadataVideoId = '';
  }

  private triggerIngredientShake(): void {
    this.shouldShakeIngredients.set(true);
    setTimeout(() => this.shouldShakeIngredients.set(false), 360);
  }

  previewThumbnailUrl(): string {
    return getYoutubeThumbnail(this.youtubeUrl.trim());
  }

  isYoutubeUrlValid(): boolean {
    return Boolean(extractYoutubeId(this.youtubeUrl.trim()));
  }

  showYoutubeWarning(): boolean {
    return this.youtubeUrl.trim().length > 0 && !this.isYoutubeUrlValid();
  }

  async requestAddIngredient(): Promise<void> {
    this.error.set('');
    this.message.set('');

    const name = this.newIngredientName.trim();
    const icon = this.newIngredientIcon.trim();

    if (!name || !icon) {
      this.error.set(this.messages.fillIngredientFields);
      return;
    }

    this.pendingIngredientDraft = { name, icon };

    const emojiMatches = this.ingredients()
      .filter((ingredient) => ingredient.icon === icon)
      .map((ingredient) => `${ingredient.icon} ${ingredient.name}`);

    const loweredName = name.toLowerCase();
    const nameMatches = this.ingredients()
      .filter((ingredient) => {
        const existing = ingredient.name.toLowerCase();
        return existing.includes(loweredName) || loweredName.includes(existing);
      })
      .map((ingredient) => `${ingredient.icon} ${ingredient.name}`);

    this.duplicateEmojiMatches.set(emojiMatches);
    this.duplicateNameMatches.set(nameMatches);

    if (emojiMatches.length > 0) {
      this.duplicateEmojiDialogOpen.set(true);
      return;
    }

    if (nameMatches.length > 0) {
      this.duplicateNameDialogOpen.set(true);
      return;
    }

    await this.createPendingIngredient();
  }

  continueAfterEmojiWarning(): void {
    this.duplicateEmojiDialogOpen.set(false);

    if (this.duplicateNameMatches().length > 0) {
      this.duplicateNameDialogOpen.set(true);
      return;
    }

    void this.createPendingIngredient();
  }

  cancelDuplicateEmoji(): void {
    this.duplicateEmojiDialogOpen.set(false);
    this.pendingIngredientDraft = null;
  }

  continueAfterNameWarning(): void {
    this.duplicateNameDialogOpen.set(false);
    void this.createPendingIngredient();
  }

  cancelDuplicateName(): void {
    this.duplicateNameDialogOpen.set(false);
    this.pendingIngredientDraft = null;
  }

  askDeleteIngredient(ingredient: IngredientOption): void {
    this.ingredientPendingDelete.set(ingredient);
    this.deleteIngredientDialogOpen.set(true);
  }

  async confirmDeleteIngredient(): Promise<void> {
    const ingredient = this.ingredientPendingDelete();
    if (!ingredient) {
      return;
    }

    this.deleteIngredientDialogOpen.set(false);

    const result = await this.ingredientsService.deleteIngredient(ingredient.id);
    if (result.error) {
      this.error.set(result.error);
      return;
    }

    this.ingredientPendingDelete.set(null);
    this.message.set(this.messages.ingredientDeleted);
    await this.loadIngredients();
  }

  cancelDeleteIngredient(): void {
    this.deleteIngredientDialogOpen.set(false);
    this.ingredientPendingDelete.set(null);
  }

  private async createPendingIngredient(): Promise<void> {
    if (!this.pendingIngredientDraft) {
      return;
    }

    const ingredient = this.pendingIngredientDraft;
    const result = await this.ingredientsService.createIngredient(ingredient);
    if (result.error) {
      this.error.set(result.error);
      return;
    }

    this.pendingIngredientDraft = null;
    this.newIngredientName = '';
    this.newIngredientIcon = '';
    this.message.set(this.messages.ingredientCreated);
    this.duplicateEmojiMatches.set([]);
    this.duplicateNameMatches.set([]);
    await this.loadIngredients();
  }

  private async loadIngredients(): Promise<void> {
    this.ingredients.set(await this.ingredientsService.listIngredients());
  }
}
