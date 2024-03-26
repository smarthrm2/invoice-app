import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  NonNullableFormBuilder,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import { Observable, Subscription } from 'rxjs';


@Component({
  selector: 'app-misc-info-form',
  templateUrl: './misc-info-form.component.html',
  styleUrls: ['./misc-info-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => MiscInfoFormComponent),
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MiscInfoFormComponent),
      multi: true,
    },
  ],
})
export class MiscInfoFormComponent
  implements ControlValueAccessor, OnDestroy, Validator, OnInit
{
  onTouched = () => {};
  onChangeSub: Subscription = new Subscription();
  bp$!: Observable<string>;
  @Input() reset: Observable<boolean> | undefined;
  selectIsOpen:boolean = false;

  resetSub = new Subscription();
  paymentStatus: any[] = [
    { label: 'Paid', value: 1 },
    { label: 'Pending', value: 2 },
    { label: 'Partial', value: 3 }
  ];
  constructor(
    private fb: NonNullableFormBuilder,
  ) {}
  ngOnInit(): void {
    if (this.reset) {
      this.resetSub = this.reset.subscribe((reset) => {
        if (reset) {
          this.miscInfoForm.reset();
        }
      });
    }
    this.miscInfoForm.controls['paymentStatus'].setValue(this.paymentStatus[0]?.label);
  }

  validate(): ValidationErrors | null {
    return this.miscInfoForm.valid
      ? null
      : {
          message: 'All fields must be added',
        };
  }

  ngOnDestroy(): void {
    this.onChangeSub.unsubscribe();
    this.resetSub.unsubscribe();
  }

  miscInfoForm = this.fb.group({
    invoiceDate: [new Date(), [Validators.required]],
    paymentType: ['', [Validators.required]],
    paymentStatus: ['', [Validators.required]],
  });

  writeValue(val: any): void {
    if (val) {
      this.miscInfoForm.setValue(val, { emitEvent: false });
    }
  }
  writeValueStatus(val: number): void {
    if (val) {
      const term = this.paymentStatus.find((t) => t.value === val);
      if (term) {
        this.miscInfoForm.controls['paymentStatus'].setValue(term.label)
      }
    //  this.onChange(val);
    }
  }
  
  registerOnChange(fn: any): void {
    this.onChangeSub = this.miscInfoForm.valueChanges.subscribe(fn);
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.miscInfoForm.disable() : this.miscInfoForm.enable();
  }
  onPaymentTypeClick() {
    this.selectIsOpen = !this.selectIsOpen;
  }

  onBlur() {
    this.selectIsOpen = false;
  }

  onTypeChange(evt: Event) {
    const type = +(evt.target as HTMLInputElement)?.value;
    this.writeValueStatus(type);
    const foundTerm = this.paymentStatus.find((term) => term.value === type);
    if (foundTerm) {
      this.miscInfoForm.controls['paymentStatus'].setValue(foundTerm.label)
    }
   // this.onTouched();
  }
}
