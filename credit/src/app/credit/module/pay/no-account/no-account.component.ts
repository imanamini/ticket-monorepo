import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-account',
  templateUrl: './no-account.component.html',
  styleUrls: ['./no-account.component.scss']
})
export class NoAccountComponent implements OnInit {
  title = 'عدم دسترسی به کیف اعتباری';
  message = 'فرآیند ثبت‌نام شما تکمیل نشده';
  description = [
    'از این رو، امکان استفاده از کیف اعتباری امکان‌پذیر نمی‌باشد.',
    'جهت اطلاع از وضعیت ثبت‌نام، به بخش دریافت وام در اپلیکیشن دیجی‌پی مراجعه فرمایید.'
  ];
  image = 'assets/pay/no-account-image.svg';


  constructor() { }

  ngOnInit() {
  }

  goToFailUrl() {
    window.location.replace('https://www.digikala.com/cart/');
  }
}
