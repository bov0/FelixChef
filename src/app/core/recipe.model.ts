export interface IngredientOption {
  id: string;
  name: string;
  icon: string;
}

export interface RecipeIngredient {
  ingredientId: string;
  name: string;
  icon: string;
  quantity: string;
}

export interface Recipe {
  id: string;
  title: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  ingredients: RecipeIngredient[];
  description: string;
  createdAt: string;
}

export interface RecipeDraft {
  title: string;
  youtubeUrl: string;
  ingredients: RecipeIngredient[];
  description: string;
}
