
import { Directive, forwardRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn } from '@angular/forms';


export function minDateValidator(minDate: any): ValidatorFn {
	return (control: AbstractControl): { [key: string]: any } | null => {
		let isValid: boolean = true;
		let myDate: Date;
		let myMinDate: Date;
		if (!minDate) {
			minDate = new Date();
		}
		if (typeof control.value !== 'undefined' && control.value !== null) {
			if (control.value.toString() === 'NaN') {
				isValid = false;
			} else if (!isNaN(parseFloat(control.value)) && isFinite(control.value)) {
				myDate = new Date(control.value);
				if (!isNaN(parseFloat(minDate)) && isFinite(minDate)) {
					myMinDate = new Date(minDate as number);
				} else if (minDate instanceof Date) {
					myMinDate = minDate;
				} else {
					// we have a date string
					myMinDate = new Date(minDate);
				}
				isValid = myDate >= myMinDate;
			} else if (typeof control.value === 'string' && new Date(control.value)) {
				myDate = new Date(control.value);
				myDate = new Date(myDate.getFullYear(), myDate.getMonth(), myDate.getDate(), 0, 0, 0);
				isValid = myDate >= minDate;
			} else {
				myDate = new Date(control.value.getFullYear(), control.value.getMonth(), control.value.getDate(), 0, 0, 0);
				isValid = myDate >= minDate;
			}
		}
		if (isValid) {
			return null;
		} else {
			return {
				minDate: true
			};
		}
	};
}


@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '[myMinDate][ngModel],[myMinDateValidator][ngModel],[myMinDateValidator][formControl],[myMinDateValidator][formControlName]',
	providers: [
		{
			/* eslint-disable */
			provide: NG_VALIDATORS, useExisting: forwardRef(() =>
				MyMinDateValidatorDirective), multi: true
		}
	]
})

export class MyMinDateValidatorDirective implements Validator, OnInit, OnChanges {

	validator: Function;
	@Input() myMinDate: any;

	constructor() {
	}

	ngOnInit() {
		this.validator = this.validatorGenFn(this.myMinDate);
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes['minDate'] && typeof (changes['minDate'].currentValue) !== 'undefined' && changes['minDate'].currentValue.toString() !== 'Invalid Date') {
			this.myMinDate = new Date(changes['minDate'].currentValue);
		}
	}

	validatorGenFn = function (minDate: Date | number) {
		return minDateValidator(minDate);
	};

	validate(control: AbstractControl) {
		return this.validator(control);
	}

	private DateMinusOne() {
		let result: Date;
		result = new Date();
		result.setDate(result.getDate());
		return result;
	}
}