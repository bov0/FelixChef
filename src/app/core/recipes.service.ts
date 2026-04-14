import { Injectable, inject } from '@angular/core';
import { Recipe, RecipeDraft, RecipeIngredient } from './recipe.model';
import { SupabaseService } from './supabase.service';
import { getYoutubeThumbnail } from './youtube.utils';

const SAMPLE_RECIPES: Recipe[] = [
  {
    id: 'sample-1',
    title: 'Tortilla de patatas jugosa',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    ingredients: [
      { ingredientId: 'huevo', name: 'Huevo', icon: '🥚', quantity: '5 unidades' },
      { ingredientId: 'patata', name: 'Patata', icon: '🥔', quantity: '4 medianas' }
    ],
    description:
      'Una receta clasica para ensenar el formato del post. Puedes sustituir este contenido por lo que venga desde Supabase.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-2',
    title: 'Pollo al horno con limon',
    youtubeUrl: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
    thumbnailUrl: 'https://img.youtube.com/vi/aqz-KE-bpKQ/hqdefault.jpg',
    ingredients: [
      { ingredientId: 'pollo', name: 'Pollo', icon: '🍗', quantity: '1 troceado' },
      { ingredientId: 'tomate', name: 'Tomate', icon: '🍅', quantity: '2 unidades' }
    ],
    description:
      'Otro ejemplo de receta con miniatura de YouTube, ingredientes con iconos y una descripcion breve para que veas el layout.',
    createdAt: new Date().toISOString()
  }
];

@Injectable({ providedIn: 'root' })
export class RecipesService {
  private readonly supabase = inject(SupabaseService);

  async listRecipes(): Promise<Recipe[]> {
    if (!this.supabase.client) {
      return SAMPLE_RECIPES;
    }

    const { data, error } = await this.supabase.client
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      return SAMPLE_RECIPES;
    }

    return data.map((recipe) => this.mapRecipe(recipe));
  }

  async getRecipeById(id: string): Promise<Recipe | null> {
    if (!this.supabase.client) {
      return SAMPLE_RECIPES.find((recipe) => recipe.id === id) ?? null;
    }

    const { data, error } = await this.supabase.client
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return this.mapRecipe(data);
  }

  async createRecipe(draft: RecipeDraft): Promise<{ error?: string }> {
    if (!this.supabase.client) {
      return { error: 'Configura Supabase para guardar recetas reales.' };
    }

    const { error } = await this.supabase.client.from('recipes').insert({
      title: draft.title,
      youtube_url: draft.youtubeUrl,
      thumbnail_url: getYoutubeThumbnail(draft.youtubeUrl),
      ingredients: draft.ingredients.map(
        (ingredient) => `${ingredient.icon} ${ingredient.name}: ${ingredient.quantity}`
      ),
      recipe_ingredients: draft.ingredients,
      description: draft.description
    });

    if (error) {
      return { error: error.message };
    }

    return {};
  }

  async updateRecipe(id: string, draft: RecipeDraft): Promise<{ error?: string }> {
    if (!this.supabase.client) {
      return { error: 'Configura Supabase para actualizar recetas reales.' };
    }

    const { error } = await this.supabase.client
      .from('recipes')
      .update({
        title: draft.title,
        youtube_url: draft.youtubeUrl,
        thumbnail_url: getYoutubeThumbnail(draft.youtubeUrl),
        ingredients: draft.ingredients.map(
          (ingredient) => `${ingredient.icon} ${ingredient.name}: ${ingredient.quantity}`
        ),
        recipe_ingredients: draft.ingredients,
        description: draft.description
      })
      .eq('id', id);

    if (error) {
      return { error: error.message };
    }

    return {};
  }

  async deleteRecipe(id: string): Promise<{ error?: string }> {
    if (!this.supabase.client) {
      return { error: 'Configura Supabase para eliminar recetas reales.' };
    }

    const { error } = await this.supabase.client.from('recipes').delete().eq('id', id);

    if (error) {
      return { error: error.message };
    }

    return {};
  }

  private mapRecipe(recipe: {
    id: string;
    title: string;
    youtube_url: string;
    thumbnail_url: string;
    ingredients?: string[] | null;
    recipe_ingredients?: RecipeIngredient[] | null;
    description: string;
    created_at: string;
  }): Recipe {
    const structuredIngredients =
      recipe.recipe_ingredients && recipe.recipe_ingredients.length > 0
        ? recipe.recipe_ingredients
        : (recipe.ingredients ?? []).map((ingredient, index) => ({
            ingredientId: `legacy-${index}`,
            name: ingredient,
            icon: '🍽️',
            quantity: ''
          }));

    return {
      id: recipe.id,
      title: recipe.title,
      youtubeUrl: recipe.youtube_url,
      thumbnailUrl: recipe.thumbnail_url,
      ingredients: structuredIngredients,
      description: recipe.description,
      createdAt: recipe.created_at
    };
  }
}
