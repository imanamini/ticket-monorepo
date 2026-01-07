import {Component, EventEmitter, inject, Output} from '@angular/core';
import {HINT_TEXT} from "./user-card-hint.const";
import {UserCardHintService} from "./user-card-hint.service";

@Component({
  selector: 'app-user-card-hint',
  templateUrl: './user-card-hint.component.html',
  styleUrls: ['./user-card-hint.component.scss']
})
export class UserCardHintComponent {
  public hintText: string = HINT_TEXT;
  @Output() readAll: EventEmitter<boolean> = new EventEmitter<boolean>();
  private userCardHintService = inject(UserCardHintService);
  public done(): void {
    this.userCardHintService.setState();
    this.readAll.emit(true);
  }
}

