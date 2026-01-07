import { Directive } from "@angular/core";

@Directive({
    selector: '[googleAnalytics]',
    standalone: true,
    inputs: ['googleAnalytics'],
    host: {
        '[attr.googleAnalytics]': 'googleAnalytics',
    }
})
export class GoogleAnalyticsDirective {
}