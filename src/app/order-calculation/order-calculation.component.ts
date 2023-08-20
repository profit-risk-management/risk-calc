import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-order-calculation',
  templateUrl: './order-calculation.component.html',
  styleUrls: ['./order-calculation.component.scss']
})
export class OrderCalculationComponent {
  public form: FormGroup = this.fb.group({
    risk: [0],
    calculatedStop:this.fb.array([this.createCalculatedStopGroup()]),
  });

  constructor(
    private fb: FormBuilder,
  ) {
  }

  public get calculatedStopForm(): FormArray {
    return this.form.get('calculatedStop') as FormArray;
  }

  public createCalculatedStopGroup(): FormGroup {
    return this.fb.group({
      price: [0],
      stopPercentage: [0.2],
      stopSize: [{ value: 0, disabled: true }],
      gapPercentage: [0.2],
      gap: [{ value: 0, disabled: true }],
      fee: [0.16],
      riskProfit: this.fb.group({
        2: [{ value: 0, disabled: true }],
        3: [{ value: 0, disabled: true }],
        4: [{ value: 0, disabled: true }],
        5: [{ value: 0, disabled: true }],
      }),
      risk: [0],
      isLongPosition: true,
    })
  }

  public addItem(): void {
    this.calculatedStopForm.push(this.createCalculatedStopGroup());
  }

  public delete(position: number): void {
    this.calculatedStopForm.removeAt(position);
  }
}
