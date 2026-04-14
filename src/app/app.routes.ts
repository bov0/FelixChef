import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/recipes/pages/home-page/home-page.component').then((m) => m.HomePageComponent),
    title: 'FelixChef | Recetas'
  },
  {
    path: 'recipes/:id',
    loadComponent: () =>
      import('./features/recipes/pages/recipe-detail-page/recipe-detail-page.component').then(
        (m) => m.RecipeDetailPageComponent
      ),
    title: 'FelixChef | Detalle'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login-page/login-page.component').then((m) => m.LoginPageComponent),
    title: 'FelixChef | Login'
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/admin/pages/admin-page/admin-page.component').then((m) => m.AdminPageComponent),
    title: 'FelixChef | Panel'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
