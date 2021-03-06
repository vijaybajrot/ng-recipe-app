import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { Recipe } from './../recipe.model';
import { RecipeService } from './../recipe.service';
import { Ingredient } from './../../shopping-list/ingredient.model';

type RecipeFormValues = {
  name: string;
  desc: string;
  imagePath: string;
  ingredients: Ingredient[];
};

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.scss'],
})
export class RecipeEditComponent implements OnInit {
  recipe!: Recipe;
  editMode: boolean = false;
  recipeForm!: FormGroup;
  isFetching = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.recipeService.getRecipeById(params.id).subscribe((recipe) => {
        if (recipe) {
          this.recipe = recipe;
          this.editMode = true;
        } else {
          this.editMode = false;
        }
        this.buildForm();
        this.isFetching = false;
      });
    });
  }

  buildForm() {
    let values: RecipeFormValues = {
      name: '',
      desc: '',
      imagePath: '',
      ingredients: [],
    };

    const ingredientControls: FormArray = new FormArray([]);

    if (this.editMode === true) {
      values.name = this.recipe.name;
      values.desc = this.recipe.desc;
      values.imagePath = this.recipe.imagePath;

      if (this.recipe.ingredients) {
        for (const ingredient of this.recipe.ingredients) {
          ingredientControls.push(
            new FormGroup({
              name: new FormControl(ingredient.name, Validators.required),
              amount: new FormControl(ingredient.amount, [
                Validators.required,
                Validators.pattern(/^[0-9]+$/),
              ]),
            })
          );
        }
      }
    } else {
      ingredientControls.push(
        new FormGroup({
          name: new FormControl(null, Validators.required),
          amount: new FormControl(null, [
            Validators.required,
            Validators.pattern(/^[0-9]+$/),
          ]),
        })
      );
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(values.name, Validators.required),
      desc: new FormControl(values.desc, Validators.required),
      imagePath: new FormControl(values.imagePath),
      ingredients: ingredientControls,
    });
  }

  addIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[0-9]+$/),
        ]),
      })
    );
  }

  removeIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  get ingredientControls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  hasError(fieldName: string) {
    const field = this.recipeForm.get(fieldName) as FormControl;
    if (!field) return false;

    return field.touched && !field.valid;
  }

  handleFile(event: any) {
    console.log(event);
    const file = event.target.files[0];
    console.log(file);
    this.recipeForm.patchValue({
      image: file.name,
    });
  }

  onSubmit() {
    const values: RecipeFormValues = this.recipeForm.value;

    console.log('this.recipe', this.recipe);

    if (this.editMode === true) {
      this.recipe.name = values.name;
      this.recipe.desc = values.desc;
      this.recipe.imagePath = values.imagePath;
      this.recipe.ingredients = values.ingredients;

      // Update
      this.recipeService.updateRecipe(this.recipe).subscribe(() => {
        this.router.navigate(['../'], { relativeTo: this.route });
      });
    } else {
      const recipe = new Recipe(
        null,
        values.name,
        values.desc,
        values.imagePath,
        values.ingredients
      );
      // Add
      this.recipeService.addRecipe(recipe).subscribe((recipe) => {
        console.log('added recipe', recipe);
        this.router.navigate(['../', recipe.id], { relativeTo: this.route });
      });
    }
  }

  onRemove() {
    if (this.recipe.id) {
      this.recipeService.removeRecipe(this.recipe.id);
      this.router.navigate(['../../'], { relativeTo: this.route });
    }
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
