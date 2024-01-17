import { OnInit, AfterViewInit, Component, ViewChild } from '@angular/core';
import { CalFieldComponent } from './cal-field.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	date2 = new Date('01/01/2024');
	date3 = new Date('01/01/2024');
	title = 'Angular15App';
	minDate = new Date();
	maxDate = new Date('01/20/2024');
	appForm: FormGroup;
	disabled: boolean = false;
	required: boolean = false;
	ngOnInit(): void {
		this.appForm = new FormGroup({
			'calField': new FormControl(new Date())
		});
	}
	onSubmit() {
		console.log(this.appForm.value);
	}
	toggleDisableCalField() {
		if (!this.appForm.controls['calField'].disabled) {
			this.appForm.controls['calField'].disable();
		} else {
			this.appForm.controls['calField'].enable();
		}
	}
	ngModelChangeCalled(val: any) {
		console.log('ngModelChangeCalled' + val);
	}
	toggleValidate() {
		this.required = !this.required;
	}
}
