import {
  AfterContentInit,
  Component,
  inject,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {PageEnum} from "./enums/page.enum";
import {FactoryService} from "./services/factory.service";
import {PageManagementService} from "./services/page-management.service";
import {TicketInfoService} from "./services/ticket-info.service";
import {HandleErrorService} from "./services/handle-error.service";
import {AutoSubmitService} from "./services/auto-submit.service";
import * as Sentry from "@sentry/angular-ivy";

@Component({
  selector: "app-new-upg",
  templateUrl: "./new-upg.component.html",
  styleUrls: ["./new-upg.component.scss"],
})
export class NewUpgComponent implements OnInit, AfterContentInit {
  @ViewChild("container", {read: ViewContainerRef, static: true})
  container: ViewContainerRef;
  private activatedRoute = inject(ActivatedRoute);
  private pageManagementService = inject(PageManagementService);
  private autoSubmitService = inject(AutoSubmitService);
  private ticketInfoService = inject(TicketInfoService);
  public handleErrorService = inject(HandleErrorService);
  public loadingApis: boolean = true;

  constructor() {
    Sentry.setTag('module', 'UPG-Front-Module')
  }

  async ngOnInit(): Promise<void> {
    this.ticketInfoService.ticket = this.activatedRoute.snapshot.params["ticket"];
    //We need ticketInfo in the root because maybe we need to go to merchant from anyWhere with fallbackUrl, and we need ttl in card.
    await this.ticketInfoService.get();
    this.autoSubmitService.setConfigToAutoSubmit(
      this.autoSubmitService.autoSubmitFrom(
        this.activatedRoute,
        this.ticketInfoService.state.features
      )
    );
    this.loadingApis = false;
    this.setComponentLoadedContainer();
    this.start().then();
  }

  ngAfterContentInit(): void {
    //Whenever the user goes offline, we will transfer her/him to the offline page.
    this.handleErrorService.listenToNetworkStatusChanges();
  }

  private async start(): Promise<void> {
    const page: PageEnum = await this.getPageQueryParam();
    this.pageManagementService.implement(page);
  }

  private async getPageQueryParam(): Promise<PageEnum> {
    let page = this.activatedRoute.snapshot.queryParams["page"];
    if (!page) {
      page = PageEnum.TERMS_AND_CONDITIONS;
    }
    return page;
  }

  private setComponentLoadedContainer(): void {
    FactoryService.container = this.container;
  }

}
