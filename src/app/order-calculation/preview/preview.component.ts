import {ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PositionItem } from '../calculation-item/calculation-item.models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewComponent implements OnInit, OnChanges, OnDestroy {
  @Input() public isLong = true;
  @Input() public orderInfo!: PositionItem;

  public form: FormGroup = this.fb.group({
    stop: [0],
    entry: [0],
    take: this.fb.group({
      2: [{ value: 0, disabled: true }],
      3: [{ value: 0, disabled: true }],
      4: [{ value: 0, disabled: true }],
      5: [{ value: 0, disabled: true }],
    }),
    coinPosition: [{ value: 0, disabled: true }],
  });

  public title = 'Long';

  get takeProfit(): FormGroup {
    return this.form.get('take') as FormGroup;
  }

  private subs$: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
  ) {
  }

  public ngOnInit(): void {
    this.title = this.isLong ? 'Long' : 'Short';
  }

  public ngOnChanges(changes: SimpleChanges) {
    const orderInfo = changes['orderInfo'].currentValue;

    if (orderInfo) {
      this.title = this.isLong ? 'Long' : 'Short';
      this.calculate();
    }
  }

  public ngOnDestroy(): void {
    this.subs$.unsubscribe();
  }

  public get takeControls(): FormControl[] {
    return Object.keys(this.takeProfit.controls).map(
      (key) => this.takeProfit.get(key) as FormControl
    );
  }

  public get listOfTakeProfitPropName(): string[] {
    return Object.keys(this.takeProfit.controls);
  }

  private calculate(): void {
    let entry = 0;
    let stop = 0;

    if (this.isLong) {
      entry = this.orderInfo.price + this.orderInfo.gap;
      stop = entry - this.orderInfo.stopSize;
    } else {
      entry = this.orderInfo.price - this.orderInfo.gap;
      stop = entry + this.orderInfo.stopSize;
    }

    const coinPosition = this.coinPositionCalc(this.orderInfo.risk, this.orderInfo.stopSize);

    this.form.patchValue({
      entry,
      stop,
      coinPosition,
    }, { emitEvent: false, onlySelf: true });

    const takesControl = this.form.get('take');
    Object.keys((takesControl as FormGroup)?.controls)
      .forEach((key, index) => {
        if (key && takesControl) {
          // @ts-ignore
          const riskProfitItem = this.orderInfo.riskProfit[key]
          const value = this.isLong
              ? entry + riskProfitItem
              : entry - riskProfitItem;

          takesControl.get(key)?.patchValue(
              value,
              {emitEvent: false, onlySelf: true}
          )
        }
      });
  }

  private coinPositionCalc(risk: number, stop: number): number {
    if (risk === 0 || stop === 0) return  0;
    return risk / stop;
  }
}
