import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss'],
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[] = [];
  recipeSubscription!: Subscription;

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.fetchRecipes();
    this.recipeSubscription = this.recipeService.recipeChanged.subscribe(
      () => this.fetchRecipes()
    );
  }

  fetchRecipes() {
    this.recipeService.getRecipes().subscribe((recipes: Recipe[]) => {
      this.recipes = recipes;
    });
  }

  ngOnDestroy(): void {
    this.recipeSubscription.unsubscribe();
  }
}
