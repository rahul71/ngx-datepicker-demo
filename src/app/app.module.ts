import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CalFieldComponent } from './cal-field.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyMinDateValidatorDirective } from './minDateValidator';

@NgModule({
	declarations: [
		AppComponent,
		CalFieldComponent,
		MyMinDateValidatorDirective
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		BsDatepickerModule.forRoot(),
		PopoverModule.forRoot()
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
