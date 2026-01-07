import { AfterViewInit, Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { StorageService } from '../../core/services/storage.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss', '../shared.style.scss']
})

export class ErrorComponent implements AfterViewInit {

  message = 'متاسفانه خطایی رخ داده!';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public storageService: StorageService,
  ) {
    this.route.paramMap
      .pipe(map(() => window.history.state)).subscribe(data => {
      if (data.errorText) {
        this.message = data.errorText;
      }
    });
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.backToPreviousPage();
  }

  ngAfterViewInit() {
  }

  cancel() {
    this.router.navigate(['cancel']);
  }

  backToPreviousPage() {
    window.history.go(-2);
  }

}
