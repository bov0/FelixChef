import { Injectable, inject } from '@angular/core';
import { IngredientOption } from './recipe.model';
import { SupabaseService } from './supabase.service';

const SAMPLE_INGREDIENTS: IngredientOption[] = [
  { id: 'pollo', name: 'Pollo', icon: '🍗' },
  { id: 'huevo', name: 'Huevo', icon: '🥚' },
  { id: 'patata', name: 'Patata', icon: '🥔' },
  { id: 'arroz', name: 'Arroz', icon: '🍚' },
  { id: 'pasta', name: 'Pasta', icon: '🍝' },
  { id: 'queso', name: 'Queso', icon: '🧀' },
  { id: 'tomate', name: 'Tomate', icon: '🍅' },
  { id: 'pescado', name: 'Pescado', icon: '🐟' }
];

@Injectable({ providedIn: 'root' })
export class IngredientsService {
  private readonly supabase = inject(SupabaseService);

  async listIngredients(): Promise<IngredientOption[]> {
    if (!this.supabase.client) {
      return SAMPLE_INGREDIENTS;
    }

    const { data, error } = await this.supabase.client
      .from('ingredients')
      .select('id, name, icon')
      .order('name', { ascending: true });

    if (error || !data) {
      return SAMPLE_INGREDIENTS;
    }

    return data.map((ingredient) => ({
      id: ingredient.id,
      name: ingredient.name,
      icon: ingredient.icon
    }));
  }

  async createIngredient(input: { name: string; icon: string }): Promise<{ error?: string }> {
    if (!this.supabase.client) {
      return { error: 'Configura Supabase para crear ingredientes reales.' };
    }

    const { error } = await this.supabase.client.from('ingredients').insert({
      id: this.slugify(input.name),
      name: input.name,
      icon: input.icon
    });

    if (error) {
      return { error: error.message };
    }

    return {};
  }

  async deleteIngredient(id: string): Promise<{ error?: string }> {
    if (!this.supabase.client) {
      return { error: 'Configura Supabase para eliminar ingredientes reales.' };
    }

    const { error } = await this.supabase.client.from('ingredients').delete().eq('id', id);

    if (error) {
      return { error: error.message };
    }

    return {};
  }

  private slugify(value: string): string {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
}
