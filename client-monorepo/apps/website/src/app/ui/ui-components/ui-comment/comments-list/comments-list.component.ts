import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserComment } from '../../../../api/clients/models/content/comment';
import { UiCommentComponent } from '../ui-comment/ui-comment.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-comments-list',
  templateUrl: './comments-list.component.html',
  styleUrls: ['./comments-list.component.scss'],
  standalone: true,
  imports: [NgFor, UiCommentComponent],
})
export class CommentsListComponent {
  @Input()
  comments!: UserComment[];

  @Output()
  replyClick = new EventEmitter<UserComment>();

  onReply(comment: UserComment) {
    this.replyClick.emit(comment);
  }
}
