import { computed, Injectable, signal } from '@angular/core';
import { DeliveryMethod } from '../models/delivery-method.enum';

@Injectable({
  providedIn: 'root'
})
export class FormStepService {
  private _currentStep = signal(0);
  currentStep = this._currentStep.asReadonly();
  private _deliveryMethod = signal(0);
  deliveryMethod = this._deliveryMethod.asReadonly();
  private readonly formTitle = {
    0: {
      0: 'لطفا روش دریافت خود را انتخاب کنید.'
    },
    [DeliveryMethod.DeliveryInPerson]: {
      1: 'شعبه مورد نظر خود را برای دریافت انتخاب کنید.',
      2: 'زمان مورد نظر را برای دریافت انتخاب کنید.'
    },
    [DeliveryMethod.DeliveryByCourier]: {
      1: `برای دریافت چک از پیک دیجی‌پی، لطفا آدرس مورد
      نظر خود را وارد کنید. حضور وام گیرنده چک
       جهت دریافت بسته از پیک دیجی‌پی الزامی است.`,
      2: 'زمان مورد نظر را برای دریافت انتخاب کنید.'
    },
    [DeliveryMethod.DeliveryByPost]: {
      1: `برای دریافت چک از  مامور پست، لطفا آدرس مورد
      نظر خود را وارد کنید. حضور وام گیرنده چک
      جهت دریافت بسته از مامور پست الزامی است.`
    }
  };

  currentStepTitle = computed(() => {
    return this.formTitle[this._deliveryMethod()][this.currentStep()];
  });

  stepsCount = computed(() => {
    return Object.keys(this.formTitle[this._deliveryMethod()]).length;
  });

  setCurrentStep(step: number) {
    this._currentStep.set(step);
  }

  setDeliveryMethod(method: number) {
    this._deliveryMethod.set(method);
  }

  nextStep() {
    this._currentStep.set(this._currentStep() + 1);
  }

  previousStep() {
    if (this.currentStep() === 0) {
      return;
    }
    this._currentStep.set(this._currentStep() - 1);
  }
}
