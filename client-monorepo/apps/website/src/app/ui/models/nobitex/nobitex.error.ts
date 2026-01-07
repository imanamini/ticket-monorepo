export class NobitexError {
  static readonly 1007 = new NobitexError(1007, '', 'شماره موبایلی که وارد نموده اید باید شماره موبایل کاربر لاگین شده یکی باشد ');
  static readonly 1008 = new NobitexError(1008, '', 'شما قبلا این درخواست را انجام داده اید');
  static readonly Something_Went_Wrong = new NobitexError(0, 'Something Went Wrong', 'مشکلی پیش آمده لطفا مجددا امتحان نمایید');
  static readonly 1009 = new NobitexError(1009, 'shahkar not passed', 'شما استعلام شاهکار را نگرفته اید');
  static readonly 1010 = new NobitexError(1010, 'estimate not passed', '');
  static readonly 1011 = new NobitexError(1011, 'lock not passed', 'وثیقه شما تایید نشد');

  private constructor(
    public readonly code: number,
    public readonly enMessage: string,
    public readonly faMessage: string,
  ) {}

  getEnumByCode(code: number) {
    switch (code) {
      case NobitexError['1007'].code:
        return NobitexError['1007'];
        break;
      case NobitexError['1008'].code:
        return NobitexError['1008'];
        break;
      case NobitexError['1009'].code:
        return NobitexError['1009'];
        break;
      case NobitexError['1010'].code:
        return NobitexError['1010'];
        break;
      case NobitexError['1011'].code:
        return NobitexError['1011'];
        break;
    }
  }
}
