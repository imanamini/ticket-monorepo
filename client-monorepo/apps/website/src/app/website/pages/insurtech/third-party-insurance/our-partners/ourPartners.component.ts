import {AfterViewInit, ChangeDetectionStrategy, Component, Input, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SwiperOptions} from "swiper/types";
import {partnerItem} from "./partnerItem.mode";
import {SwiperDirective} from "../../../../../ui/ui-directive/swiper.directive";
import SwiperCore from 'swiper';
import {Autoplay, Navigation, Pagination} from "swiper/modules";

SwiperCore.use([Autoplay, Navigation, Pagination]);

@Component({
    selector: 'app-our-partners',
    standalone: true,
    imports: [CommonModule, SwiperDirective],
    templateUrl: './ourPartners.component.html',
    styleUrl: './ourPartners.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OurPartnersComponent implements AfterViewInit{
    @Input() title: string;
    @Input() subtitle: string;
    @Input() partnerItems: partnerItem[];

    @ViewChild('swiper', { static: false }) swiperDirective: any;


    config: SwiperOptions = {
        slidesPerView: 'auto',
        spaceBetween: 40,
        loop: true,
        roundLengths: true,
        watchSlidesProgress: true,
        centerInsufficientSlides: true,
        grabCursor: true,

        autoplay: {
            delay: 3000,             // time (ms) between slides
            disableOnInteraction: false,
            pauseOnMouseEnter: true, // optional, if you want mouse‑hover pause
        }
    };


    constructor() {
    }

    ngAfterViewInit(): void {
        this.swiperDirective.swiper.autoplay.start();
    }

}
