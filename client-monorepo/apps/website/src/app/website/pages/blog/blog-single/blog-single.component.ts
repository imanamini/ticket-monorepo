import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { BlogClient } from '../../../../api/clients/blog-client';
import { SeoService } from '../../../services/seo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogPost } from '../../../../api/clients/models/content/blog-post';
import { UserComment } from '../../../../api/clients/models/content/comment';
import { StorageInterface } from '@digipay/ng-storage';
import { StorageSchema } from '../../../../core/models/storage-schema';
import { DOCUMENT, NgClass, NgFor, NgIf, NgOptimizedImage } from '@angular/common';
import moment from 'jalali-moment';
import { JsonLDService } from '../../../../core/services/json-ld.service';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { UiCommentFormComponent } from '../../../../ui/ui-components/ui-comment/ui-comment-form/ui-comment-form.component';
import { CommentsListComponent } from '../../../../ui/ui-components/ui-comment/comments-list/comments-list.component';
import { UiButtonComponent } from '../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { DownloadAppLinkDirective } from '../../../../ui/ui-directive/download-app-link.directive';
import { BaseLayoutComponent } from '../../../layout/base-layout/base-layout.component';
import { delay, of } from 'rxjs';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';

@Component({
  selector: 'app-blog-single',
  templateUrl: './blog-single.component.html',
  styleUrls: ['./blog-single.component.scss'],
  standalone: true,
  imports: [
    BaseLayoutComponent,
    NgIf,
    NgFor,
    NgClass,
    DownloadAppLinkDirective,
    NgOptimizedImage,
    UiButtonComponent,
    CommentsListComponent,
    UiCommentFormComponent,
    PipesModule,
    NgxSpinnerModule,
  ],
})
export class BlogSingleComponent implements OnInit {
  post!: BlogPost;
  postCategories: { id: string; title: string; slug: string }[];

  comments: UserComment[] = [];

  replyingTo = '';

  replyingToId: string | null = null;

  loaded = false;
  selectedHeading: number | null = null;
  @ViewChild('commentForm', {
    static: false,
  })
  uiCommentForm!: ElementRef<HTMLDivElement>;

  commentFormErrors: string[] = [];

  commentFormSuccessMessage = '';

  submittingCommentForm = false;

  commentFormClearSignal = 0;

  tableOfContentItems = [];
  displayBreadCrumbs = true;

  constructor(
    private client: BlogClient,
    private seo: SeoService,
    private route: ActivatedRoute,
    @Inject('StorageInterface')
    public storage: StorageInterface<StorageSchema>,
    private router: Router,
    @Inject(DOCUMENT) private document: any,
    private jsonLDService: JsonLDService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((routeParams) => {
      if (routeParams['mag-slug']) {
        this.getPost(routeParams['mag-slug']);
      }
    });
  }

  generateTableOfContentItems() {
    const h2Elements = document.getElementsByTagName('h2');
    const items = [];
    for (let i = 0; i < h2Elements.length; i++) {
      items.push(h2Elements[i].innerText);
    }
    this.tableOfContentItems = items;
  }

  generateBreadCrumbSchema() {
    const entity = {
      '@type': 'BreadcrumbList',
      itemListElement: [],
    };

    const obj = [];
    let item = {
      '@type': 'ListItem',
      position: 1,
      name: 'مجله اینترنتی دیجی‌پی',
      item: this.document.location.origin + '/mag/',
    };
    obj.push(item);
    if (this.postCategories.length > 0) {
      this.postCategories.forEach(
        function (value, i) {
          item = {
            '@type': 'ListItem',
            position: i + 2,
            name: value.title,
            item: this.doc.location.origin + '/mag/' + value.slug + '/',
          };
          obj.push(item);
        },
        { doc: this.document },
      );
    }

    item = {
      '@type': 'ListItem',
      position: this.postCategories.length + 2,
      name: this.post.title,
      item: this.document.location.href,
    };
    obj.push(item);
    entity.itemListElement = obj;

    const entity2 = {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': this.document.location.href,
      },
      headline: this.post.title,
      image: this.post.image.url,
      publisher: {
        '@type': 'Organization',
        name: 'دیجی‌پی',
        logo: {
          '@type': 'ImageObject',
          url: this.document.location.origin + '/assets/images/logos/mydigipay-fa.svg',
        },
      },

      datePublished: moment.unix(this.post.createdAt.timestamp).format('YYYY-MM-DD'),
      dateModified: moment.unix(this.post.updatedAt.timestamp).format('YYYY-MM-DD'),
    };

    this.jsonLDService.insertSchema('custom', entity2);
  }

  onCommentReplyClick(comment: UserComment) {
    this.replyingTo = comment.authorName;
    this.replyingToId = comment.id;
    if (this.uiCommentForm && this.uiCommentForm.nativeElement) {
      this.uiCommentForm.nativeElement.scrollIntoView();
    }
  }

  onCancelReply() {
    this.replyingTo = '';
    this.replyingToId = null;
  }

  onCommentFormSubmit(formValue: any) {
    if (this.submittingCommentForm) {
      return;
    }

    this.submittingCommentForm = true;

    formValue.inReplyTo = this.replyingToId;
    this.commentFormSuccessMessage = '';
    this.commentFormErrors = [];

    this.client.submitCommentForPost(this.post.id, formValue).subscribe({
      next: (res) => {
        this.submittingCommentForm = false;
        this.commentFormSuccessMessage = res.info.message;
        this.commentFormClearSignal += 1;
        if (formValue.rememberMe) {
          this.storage.patch({
            userInfo: {
              email: formValue.email,
              name: formValue.author,
            },
          });
        } else {
          this.storage.patch({
            userInfo: {},
          });
        }
      },
      error: (e) => {
        this.submittingCommentForm = false;
        if (e?.error?.errors?.length > 0) {
          this.commentFormErrors = e.error.errors;
        }
        if (e.error?.info?.message) {
          this.commentFormErrors.push(e.error.info.message);
        }
      },
    });
  }

  isFileVideo(url: string) {
    const isVideo = ['.mpg', '.mp2', '.mpeg', '.mpe', '.mpv', '.mp4'];
    return isVideo.some((v) => url.includes(v));
  }

  scrollToItem(index: number) {
    this.selectedHeading = index;
    this.document.getElementsByTagName('h2')[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  generateBreadCrumbs() {
    if (this.post.category && this.post.category.parentId && this.post.category.parent) {
      this.postCategories = [this.post.category.parent, this.post.category];
    } else if (this.post.category && !this.post.category.parentId) {
      this.postCategories = [this.post.category];
    }
  }

  private getPost(slug: string) {
    this.client.getPostBySlug(slug).subscribe(
      (res) => {
        this.seo.setGlobalMetaTagsFromPage(res.post);
        this.post = res.post;
        // this.post.readTime = 13;
        // this.post.viewCount = 130;
        this.comments = res.comments;
        this.generateBreadCrumbs();
        this.generateBreadCrumbSchema();

        of('')
          .pipe(delay(500))
          .subscribe({
            next: () => {
              this.generateTableOfContentItems();
              this.loaded = true;
            },
          });
      },
      () => {
        let path = this.router.url;
        if (path.slice(-1) === '.') {
          path = path.substring(0, path.length - 1);
        }
        this.router.navigate([path], { skipLocationChange: true });
      },
    );
  }
}
