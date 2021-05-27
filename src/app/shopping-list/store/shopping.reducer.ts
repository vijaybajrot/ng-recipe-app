import { Ingredient } from '../ingredient.model';
import { IngredientActionTypes, IngredientActions } from './shopping.actions';

export type State = { ingredients: Ingredient[] };

const initialState: State = {
  ingredients: [new Ingredient('Salad', 10), new Ingredient('Salad', 10)],
};

export function shoppingReducer(state = initialState, action: IngredientActions) {
  switch (action.type) {
    case IngredientActionTypes.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, action.payload],
      };

    default:
      return state;
  }
}
