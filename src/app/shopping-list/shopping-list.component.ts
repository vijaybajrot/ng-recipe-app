import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Ingredient } from './ingredient.model';
import { ShoppingService } from './shopping.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[] = [];
  ingredientsSubscription!: Subscription;
  

  constructor(private shoppingService: ShoppingService) {}

  ngOnInit(): void {
    this.ingredients = this.shoppingService.getIngredients();
    this.ingredientsSubscription = this.shoppingService.ingredientsChanged.subscribe(
      (ingredients) => (this.ingredients = ingredients)
    );
  }
  editIngredient(i: number){
    this.shoppingService.editIngredient(i)
  }

  ngOnDestroy(): void {
    this.ingredientsSubscription.unsubscribe()
  }
  
}
