import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ControlValueAccessor, UntypedFormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import moment from 'moment-timezone-all';
// import { FromEPOCDateTimePipe } from '@assist2/common/transforms-validators';
import { DateService } from './date.service';
import { isNil } from 'lodash';

const noop = () => {
};

@Component({
	selector: 'cal-field',
	templateUrl: 'cal-field.component.html',
	styleUrls: ['./cal-field.component.scss'],
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		/* eslint-disable */
		useExisting: forwardRef(() => CalFieldComponent),
		multi: true
	}, {
		provide: NG_VALIDATORS,
		/* eslint-disable */
		useExisting: forwardRef(() => CalFieldComponent),
		multi: true
	}]
})
export class CalFieldComponent implements OnChanges, ControlValueAccessor, AfterViewInit, Validator {
	dateFormat = DateService.DATE_US_FORMAT;
	@Input('value') innerValue: any;
	@Input('formattedVal') formattedValue: any;
	minDateInner: Date | undefined;
	maxDateInner: Date | undefined;
	bsConfig = {
		dateInputFormat: this.dateFormat,
		selectFromOtherMonth: true,
		keepDatesOutOfRules: true,
		adaptivePosition: true,
		containerClass: 'theme-default',
		showWeekNumbers: false
	};

	@Input('minDate')
	set minDate(minDate: Date) {
		// get date in EST
		this.minDateInner = this.getMinMaxDateFromEST(new Date());
	}

	@Input('maxDate')
	set maxDate(maxDate: Date) {
		this.maxDateInner = this.getMinMaxDateFromEST(maxDate);
	}

	@Input() placeholder: string = this.dateFormat;
	private _disabled: boolean = false;
	@Input('isDisabled')
	get disabled() {
		return this._disabled;
	}

	set disabled(val: boolean) {
		this._disabled = val;
		// this.hideCalendar();
	}
	@Input() name: string = 'calInput';
	@Input() required: boolean;
	@Output() dateChanged = new EventEmitter<any>();
	// public dateDisabled: { date: Date, mode: string }[];
	// public showDatePicker: boolean = false;
	@Output() datePickerShowing = new EventEmitter<boolean>();
	private onTouchedCallback: () => void = noop;
	private onChangeCallback: (_: any) => void = noop;
	private oldValue: number;
	@Output() componentViewInitialized = new EventEmitter<any>();
	@Input('componentName') componentName: string;
	@ViewChild('calInput') calInput: ElementRef;
	// // This is the MM/DD/YYYY 00:00:00 time value for the browser's timezone.  We need to pass
	// // this to the datepicker instead of the EST value; because the EST value will always translate
	// // to the day before for timezones west of EST and this will result in consistent dates showing
	// // up in the datepicker and text input for those timezones.  refer to D-12680 for example of the problem.
	// public valueForBrowserTZ: number;

	constructor(private _changeDetectorRef: ChangeDetectorRef) {
		this.innerValue = undefined;
	}

	ngAfterViewInit() {
		// IE throws an empty string event when a placeholder is set, so if you are checking for pristine this component will fail. In order to work around this you will need to implement a mark as
		// pristine call on this component in a setTimeOut in the calling .ts file.
		this.componentViewInitialized.emit(this.componentName);
	}

	ngOnChanges(changes: SimpleChanges): void {
		// trigger validation
		if (typeof this.innerValue !== 'undefined' && typeof this.oldValue !== 'undefined') {
			this.onChangeCallback(this.innerValue);
		}
		// this.oldValue = this.value;
	}

	// get value(): any {
	// 	console.log('get value -->' + this.innerValue);
	// 	return this.innerValue;
	// }

	// set value(val: any) {
	// 	console.log('set value -->' + val);
	// 	// ]]this.showDatePicker = false;
	// 	console.log('set value -->' + val);
	// 	if (val !== null && !isNaN(val) && this.formattedVal !== '') {
	// 		this.innerValue = val;
	// 		this.onChangeCallback(val);
	// 		this.dateChanged.emit(val);
	// 	} else if (isNaN(val) && this.formattedVal === '') {
	// 		this.innerValue = undefined;
	// 		this.onChangeCallback(undefined);
	// 		this.dateChanged.emit(undefined);
	// 	} else {
	// 		this.innerValue = undefined;
	// 		this.onChangeCallback(val);
	// 		this.dateChanged.emit(val);
	// 	}
	// 	this.datePickerShowing.emit(false);
	// }

	public get valid(): boolean {
		if (isNil(this.formattedVal) || this.formattedVal === '') {
			return true;
		}
		// if the format of the user entered value is not in MM/DD/YYYY format, then return false
		const momentDt = moment(this.formattedVal, this.dateFormat, true);
		return momentDt.isValid();
	}
	public get errors(): ValidationErrors | null {
		return this.valid ? null : {
			dateFormatError: {
				valid: false
			}
		};
	}
	public getError(errorCode: string, path?: string | (string | number)[]): any {
		const errors = this.errors;
		if (errors) {
			return errors[errorCode];
		}
	}
	public hasError(errorCode: string, path?: string | (string | number)[]): any {
		const errors = this.errors;
		if (errors) {
			return !!errors[errorCode];
		}
	}

	get formattedVal() {
		return this.formattedValue;
	}
	set formattedVal(val) {
		console.log(val);
		// if (val !== undefined) {
		this.formattedValue = val;
		this.innerValue = moment.tz(val, DateService.EST_TIMEZONE).toDate().getTime();
		this.onChangeCallback(val);
		this.dateChanged.emit(val);
		// }
	}
	writeValue(val: number) {
		// debugger;
		if (!isNil(val)) {
			this.innerValue = val;
			const date = moment(val);
			this.formattedVal = moment.tz(date, DateService.EST_TIMEZONE).format(this.dateFormat);
		} else {
			this.innerValue = undefined;
			this.formattedValue = undefined;
		}
	}
	setDisabledState(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}

	// showCalendar() {
	// 	if (!this.disabled) {
	// 		this.showDatePicker = !this.showDatePicker;
	// 		this.datePickerShowing.emit(this.showDatePicker);
	// 	}
	// }

	// public hideCalendar(event?: any) {
	// 	// this.showDatePicker = false;
	// 	// this.datePickerShowing.emit(false);
	// 	// // convert date to EST Day;
	// 	// if (event) {
	// 	// 	this.formattedVal = new FromEPOCDateTimePipe().transform(event);
	// 	// }
	// }

	inputChanged(val?: any) {
		// this.formattedVal = new FromEPOCDateTimePipe().transform(val);
	}

	// setValueForSelectedDate(val: any) {
	// 	// this is a number, why?
	// 	// this.value = moment.tz(DateService.getMomentDateString(val), DateService.EST_TIMEZONE).toDate().getTime();
	// 	// this is a moment date object -> why different than this.value??
	// 	const momentTZDate = moment(val, this.dateFormat, true);
	// 	this.valueForBrowserTZ = momentTZDate.isValid() ? momentTZDate : undefined;
	// }
	public validate({ value }: UntypedFormControl) {
		return this.errors;
	}

	registerOnChange(fn: any) {
		this.onChangeCallback = fn;
	}

	registerOnTouched(fn: any) {
		this.onTouchedCallback = fn;
	}

	// @HostListener('document:click') onClick(event: any) {

	// }

	// @HostListener('document:blur') onBlur() {
	// 	this.onTouchedCallback();
	// }

	private getMinMaxDateFromEST(dt: Date) {
		if (dt) {
			return new Date(moment.tz(dt, DateService.EST_TIMEZONE).format(this.dateFormat));
		}
		return undefined
	}
}
