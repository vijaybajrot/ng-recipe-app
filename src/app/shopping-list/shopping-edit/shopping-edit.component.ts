import { ShoppingService } from './../shopping.service';
import {
  Component,
  ElementRef,
  OnInit,
  Output,
  ViewChild,
  EventEmitter,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from '../ingredient.model';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.scss'],
})
export class ShoppingEditComponent implements OnInit {
  @Output() ingredientAdded: EventEmitter<Ingredient> = new EventEmitter();
  @ViewChild('ingredientForm', { static: true }) ingredientForm!: NgForm;

  editIndex?: number;
  item?: Ingredient;
  editMode: boolean = false;
  editSubscription!: Subscription;

  constructor(public shoppingService: ShoppingService) {}

  ngOnInit(): void {
    this.editSubscription = this.shoppingService.$editIngredient.subscribe(
      (index: number) => {
        const item = this.shoppingService.getIngredient(index);
        this.editIndex = index;
        this.item = item;
        this.editMode = true;
        this.ingredientForm.setValue({
          name: item.name,
          amount: item.amount,
        });
      }
    );
  }

  onSubmit() {
    const { name, amount } = this.ingredientForm.value;
    const item = { name, amount };
    if (this.editMode === true && this.editIndex !== undefined) {
      this.shoppingService.updateIngredient(item, this.editIndex);
    } else {
      this.shoppingService.addIngredient(item);
    }
    this.clearForm();
  }

  clearForm() {
    this.ingredientForm.reset();
    this.editMode = false;
    this.editIndex = undefined;
  }

  onDelete() {
    if (this.editIndex !== undefined) {
      this.shoppingService.removeIngredient(this.editIndex);
    }
    this.clearForm();
  }
}
