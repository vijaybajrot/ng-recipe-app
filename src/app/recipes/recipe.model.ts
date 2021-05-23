import { Ingredient } from "../shopping-list/ingredient.model";

export class Recipe {
  constructor(
    public id: string,
    public name: string,
    public desc: string,
    public imagePath: string,
    public ingredients: Ingredient[]
  ) {
      
  }
}
