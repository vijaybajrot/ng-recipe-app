import { Ingredient } from "../shopping-list/ingredient.model";

export class Recipe {
  public id?: string

  constructor(
    id = null,
    public name: string,
    public desc: string,
    public imagePath: string,
    public ingredients: Ingredient[]
  ) {
      
  }
}
