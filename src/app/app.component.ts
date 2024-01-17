import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	title = 'Angular15App';
	date1:any = new Date();
	date2:any = new Date();
	minDate = new Date();
}
