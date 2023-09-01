import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoryEvent } from 'src/app/models/enums/Categories/CategoryEvent';
import { GetCategoriesResponse } from 'src/app/models/interfaces/Categories/GetCategoriesResponse';
import { DeleteCategoryAction } from 'src/app/models/interfaces/Categories/event/DeleteCategoryAction';
import { EditCategoryAction } from 'src/app/models/interfaces/Categories/event/EditCategoryAction';

@Component({
  selector: 'app-categories-table',
  templateUrl: './categories-table.component.html',
  styleUrls: [],
})
export class CategoriesTableComponent {
  @Input() categories: Array<GetCategoriesResponse> = [];
  @Output() categoryEvent = new EventEmitter<EditCategoryAction>();
  @Output() deleteCategoryEvent = new EventEmitter<DeleteCategoryAction>();

  categorySelected!: GetCategoriesResponse;
  addCategoryAction = CategoryEvent.ADD_CATEGORY_ACTION;
  editCategoryAction = CategoryEvent.EDIT_CATEGORY_ACTION;

  handleCategoryEvent(
    action: string,
    id?: string,
    categoryName?: string
  ): void {
    if (action && action !== '') {
      this.categoryEvent.emit({ action, id, categoryName });
    }
  }

  handleDeleteCategoryEvent(category_id: string, categoryName: string): void {
    if (category_id !== '' && categoryName !== '') {
      this.deleteCategoryEvent.emit({ category_id, categoryName });
    }
  }
}
