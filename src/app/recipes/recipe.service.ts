import { Subject } from 'rxjs';
import { Injectable, EventEmitter } from '@angular/core';
import { Ingredient } from '../shopping-list/ingredient.model';
import { Recipe } from './recipe.model';

import { nanoid } from 'nanoid';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  recipeSelected: EventEmitter<Recipe> = new EventEmitter();
  recipeChanged: Subject<Recipe[]> = new Subject();

  private recipes: Recipe[] = [
    new Recipe(
      nanoid(),
      'Rice Pulao',
      'Pressure cooker, basmati rice, green peas, french beans, star ',
      'https://www.whiskaffair.com/wp-content/uploads/2019/05/Veg-Pulao-1-3.jpg',
      [new Ingredient('Jeera', 1), new Ingredient('Ginger', 1)]
    ),
    new Recipe(
      nanoid(),
      'Matar Pneer',
      'Cottage cheese, green peas, cream, garam masala, ginger',
      'https://spicecravings.com/wp-content/uploads/2020/08/Matar-Paneer-2-500x500.jpg',
      [new Ingredient('Pneer', 1), new Ingredient('Matar', 20)]
    ),
  ];

  constructor() {}

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipeById(id: string) {
    return this.recipes.find((recipe) => recipe.id === id);
  }

  selectRecipe(recipe: Recipe) {
    this.recipeSelected.emit(recipe);
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipeChanged.next(this.recipes);
  }

  updateRecipe(recipe: Recipe, id: string) {
    this.recipes = this.recipes.map((recipeItem: Recipe) => {
      if (recipeItem.id === id) {
        recipeItem = recipe;
      }
      return recipeItem;
    });
    this.recipeChanged.next(this.recipes);
  }

  removeRecipe(id: string) {
    this.recipes = this.recipes.filter((recipeItem: Recipe) => {
      return recipeItem.id !== id;
    });
    this.recipeChanged.next(this.recipes);
  }
}
