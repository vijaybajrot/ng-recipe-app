import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Injectable, EventEmitter } from '@angular/core';
import { Ingredient } from '../shopping-list/ingredient.model';
import { Recipe } from './recipe.model';
import { map, take, tap } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  recipeSelected: EventEmitter<Recipe> = new EventEmitter();
  recipeChanged: Subject<void> = new Subject();
  private recipes: Recipe[] = [];

  constructor(private http: HttpClient, private authService: AuthService) {}

  getRecipes() {
    return this.syncRecipes();
  }

  syncRecipes() {
    return this.http
      .get<{ [k: string]: Recipe }>(
        'https://recipe-ng-app-7891d-default-rtdb.firebaseio.com/recipes.json'
      )
      .pipe(
        map((data) => {
          const dataArray: Recipe[] = [];
          for (const id in data) {
            dataArray.push({ ...data[id], id });
          }
          return dataArray;
        })
      );
  }

  getRecipeById(id: string) {
    return this.http
      .get<Recipe>(
        `https://recipe-ng-app-7891d-default-rtdb.firebaseio.com/recipes/${id}.json`
      )
      .pipe(
        map((recipe) => {
          if (recipe) {
            recipe.id = id;
            return recipe;
          }
          return recipe;
        })
      );
  }

  selectRecipe(recipe: Recipe) {
    this.recipeSelected.emit(recipe);
  }

  addRecipe(recipe: Recipe) {
    return this.http
      .post<{ name: string }>(
        'https://recipe-ng-app-7891d-default-rtdb.firebaseio.com/recipes.json',
        recipe
      )
      .pipe(
        map((res) => {
          recipe.id = res.name;
          return recipe;
        }),
        tap((recipe) => {
          this.recipeChanged.next();
        })
      );
  }

  updateRecipe(recipe: Recipe) {
    return this.http
      .put<any>(
        `https://recipe-ng-app-7891d-default-rtdb.firebaseio.com/recipes/${recipe.id}.json`,
        recipe
      )
      .pipe(
        tap(() => {
          this.recipeChanged.next();
        })
      );
  }

  removeRecipe(id: string) {
    this.recipes = this.recipes.filter((recipeItem: Recipe) => {
      return recipeItem.id !== id;
    });
    this.recipeChanged.next();
  }
}
