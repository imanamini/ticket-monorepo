import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StepperService {

  constructor() {
  }

  private maxStep = undefined;
  private initialStep = 0;

  private currentStep = 0;
  private registerStepper = new BehaviorSubject<number>(0);

  registerStepperSource = this.registerStepper.asObservable();

  private updateSource(): void {
    this.registerStepper.next(this.currentStep);
  }

  getMaxStep(maxStep: number, initialStep: number): this {
    this.initialStep = initialStep;
    this.currentStep = initialStep;
    this.maxStep = maxStep;
    this.updateSource();
    return this;
  }

  nextStep(): void {
    this.currentStep += 1;
    if (this.maxStep && this.currentStep <= this.maxStep) {
      this.updateSource();
    } else {
      this.currentStep -= 1;
    }
  }

  previousStep(): void {
    this.currentStep -= 1;
    if (this.maxStep && this.currentStep <= this.maxStep && this.currentStep >= this.initialStep) {
      this.updateSource();
    } else {
      this.currentStep += 1;
    }
  }

  navigateToStep(step: number): void {
    if (this.maxStep && step <= this.maxStep) {
      this.currentStep = step;
      this.updateSource();
    }
  }
}
