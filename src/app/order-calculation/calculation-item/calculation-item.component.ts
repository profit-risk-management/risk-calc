import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { GapPercentageListItem, PositionItem } from './calculation-item.models';
import { map, Subscription, tap } from 'rxjs';

@Component({
  selector: 'app-calculation-item',
  templateUrl: './calculation-item.component.html',
  styleUrls: ['./calculation-item.component.scss']
})
export class CalculationItemComponent implements OnInit, OnChanges, OnDestroy {
  @Input() risk = 0;
  @Input() position = 0;
  @Input() public form!: FormGroup;

  @Output()
  public deleteItem: EventEmitter<number> = new EventEmitter();

  public orderInfo!: PositionItem;

  public gapPercentageList: GapPercentageListItem[] = [{
    text: '10%',
    value: 0.1,
  }, {
    text: '15%',
    value: 0.15,
  }, {
    text: '20%',
    value: 0.2,
  }, {
    text: '25%',
    value: 0.25,
  }, {
    text: '30%',
    value: 0.3,
  }];

  private subs$: Subscription = new Subscription();

  get riskProfit(): FormGroup {
    return this.form.get('riskProfit') as FormGroup;
  }

  constructor(
    private fb: FormBuilder,
  ) {
  }

  public ngOnInit(): void {
    this.orderInfo = this.form.getRawValue();
    this.calculationSub();
  }

  public ngOnChanges(changes: SimpleChanges) {
    const riskInfo = changes['risk'].currentValue;

    if (riskInfo) {
      this.form.patchValue({
        risk: riskInfo
      })
    }
  }

  public delete(): void {
    this.deleteItem.emit(this.position);
  }

  public ngOnDestroy(): void {
    this.subs$.unsubscribe();
  }

  public get riskControls(): FormControl[] {
    return Object.keys(this.riskProfit.controls).map(
      (key) => this.riskProfit.get(key) as FormControl
    );
  }

  public get listOfRiskPropName(): string[] {
    return Object.keys(this.riskProfit.controls);
  }

  private calculationSub(): void {
    this.subs$.add(
      this.form.valueChanges
        .pipe(
          map((_) => this.form.getRawValue()),
          tap((position: PositionItem) => {
            const stopSize = this.stopCalc(position.price, position.stopPercentage);
            const gap = this.gapCalc(stopSize, position.gapPercentage);

            this.form.patchValue({
              stopSize,
              gap,
            }, {emitEvent: false, onlySelf: true});

            const riskProfitControl = this.form.get('riskProfit');
            Object.keys((riskProfitControl as FormGroup)?.controls)
              .forEach(key => {
                if (key && riskProfitControl) {
                  riskProfitControl.get(key)?.patchValue(
                    (stopSize * Number(key)), {emitEvent: false, onlySelf: true}
                  )
                }
              });

            this.orderInfo = this.form.getRawValue();
          })
        )
        .subscribe()
    )
  }

  private stopCalc(price: number, stopPercentage: number): number {
    return price * (stopPercentage / 100);
  }

  private gapCalc(stopSize: number, gapPercentage: number): number {
    return stopSize * gapPercentage;
  }
}
