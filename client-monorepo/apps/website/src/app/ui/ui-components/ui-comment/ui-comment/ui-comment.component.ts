import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserComment } from '../../../../api/clients/models/content/comment';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-ui-comment',
  templateUrl: './ui-comment.component.html',
  styleUrls: ['./ui-comment.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor],
})
export class UiCommentComponent {
  @Input()
  comment!: UserComment;

  @Input()
  isChild = false;

  @Output()
  replyClick = new EventEmitter<UserComment>();

  onReply(comment: UserComment) {
    this.replyClick.emit(comment);
  }
}
