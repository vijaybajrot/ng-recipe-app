import { Action } from '@ngrx/store';
import { Ingredient } from '../ingredient.model';

export enum IngredientActionTypes {
  ADD_INGREDIENT = '[INGREDIENT]/ADD',
}

export type IngredientActions = AddIngredient;

export class AddIngredient implements Action {
  readonly type = IngredientActionTypes.ADD_INGREDIENT;
  constructor(public payload: Ingredient) {}
}

// export const createIngredient = createAction('ingredient/create', (item: Ingredient) => {
//   return { payload: item };
// });
