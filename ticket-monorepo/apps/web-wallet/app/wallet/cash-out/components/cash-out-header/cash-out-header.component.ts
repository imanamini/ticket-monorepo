import { Component, inject, Input, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { TacService } from '../../services/tac.service';
import { ScreenType } from '../../models/screen.type';
import { Location } from '@angular/common';
import { ScreenService } from '../../services/screen.service';
import {PATH} from "../../consts/cash-out-paths.const";

@Component({
  selector: 'cash-out-header',
  templateUrl: './cash-out-header.component.html',
  styleUrls: ['./cash-out-header.component.scss']
})
export class CashOutHeaderComponent implements OnInit {
  @Input() action: 'EXIT' | 'BACK' = 'EXIT';
  @Input() title: string = 'برداشت از کیف پول';
  private router = inject(Router);
  private tacService = inject(TacService);
  private location = inject(Location);
  private screenService = inject(ScreenService);
  public screenMode: ScreenType;
  private activatedRoute = inject(ActivatedRoute);
  @Input() customRedirectPath: string;

  ngOnInit() {
    this.screenMode = this.screenService.detectScreen();
  }

  public exit(): void {
    this.router.navigate(['/']);
  }

  public openTacEvent(): void {
    this.tacService.open();
  }

  public back() {
    if (this.customRedirectPath) {
      this.router.navigate(['../'+ this.customRedirectPath], { relativeTo: this.activatedRoute });
      return;
    }
    this.location.back();
  }
}
