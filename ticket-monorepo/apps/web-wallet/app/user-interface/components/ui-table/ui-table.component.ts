import { Component, ContentChildren, QueryList } from '@angular/core';
import { TableRowMarkDirective } from './directives/table-row-mark.directive';

@Component({
  selector: 'ui-table',
  templateUrl: './ui-table.component.html',
  styleUrls: ['./ui-table.component.scss']
})
export class UiTableComponent {

  /**
   * Query for notices (errors, hints, etc.)
   */
  @ContentChildren(TableRowMarkDirective)
  rows: QueryList<TableRowMarkDirective>;
}
