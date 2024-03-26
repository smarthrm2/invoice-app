import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AfterViewInit, Component, forwardRef, OnInit } from '@angular/core';

interface Term {
  label: string;
  value: number;
}

@Component({
  selector: 'app-select-payment-terms',
  templateUrl: './select-payment-terms.component.html',
  styleUrls: ['./select-payment-terms.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectPaymentTermsComponent),
      multi: true,
    },
  ],
})
export class SelectPaymentTermsComponent
  implements ControlValueAccessor, AfterViewInit
{
  selectIsOpen: boolean = false;

  onTouched = () => {};
  onChange = (val: number) => {};

  paymentTypes: Term[] = [
    { label: 'Cash', value: 1 },
    { label: 'Online', value: 2 },
    { label: 'Cheque', value: 3 },
    { label: 'Other', value: 4 },

  ];
  paymentStatus: Term[] = [
    { label: 'Paid', value: 1 },
    { label: 'Pending', value: 2 },
    { label: 'Partial', value: 3 }
  ];

  selectedPaymentType = this.paymentTypes[0].label;
  constructor() {}
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.onChange(this.paymentTypes[0].value);
    });
  }

  writeValue(val: number): void {
    if (val) {
      const term = this.paymentTypes.find((t) => t.value === val);
      if (term) {
        this.selectedPaymentType = term.label;
      }
      this.onChange(val);
    }
  }
  registerOnChange(fn: (val: number) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onPaymentTypeClick() {
    this.selectIsOpen = !this.selectIsOpen;
  }

  onBlur() {
    this.selectIsOpen = false;
  }

  onTypeChange(evt: Event) {
    const type = +(evt.target as HTMLInputElement).value;
    this.writeValue(type);
    const foundTerm = this.paymentTypes.find((term) => term.value === type);
    if (foundTerm) {
      this.selectedPaymentType = foundTerm.label;
    }
    this.onTouched();
  }
}
