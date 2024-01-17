import { Injectable } from '@angular/core';
import { Moment } from 'moment';
import moment from 'moment-timezone-all';

@Injectable()
export class DateService {
	public static DATE_TIME_FORMAT = 'YYYY-MM-DD hh:mm A'; // A: 12 hour clock
	public static DATE_FORMAT: string = 'YYYY-MM-DD';  // EU/International format -- do not use for user content
	public static DATE_TIME_US_FORMAT = 'MM/DD/YYYY hh:mm A';
	public static DATE_US_FORMAT = 'MM/DD/YYYY';
	public static EST_TIMEZONE = 'America/New_York';

	/**
	 * Convert date string or timestamp to an est complaint with a US date presentation
	 *
	 * @param dt Any date formatted as a date recognizable to the moment library
	 */
	public static dateToStringInEST(dt: string | number): string {
		if (dt) {
			return moment(dt).tz(DateService.EST_TIMEZONE).format(DateService.DATE_US_FORMAT);
		}
		return '';
	}

	// converts date in ms to EST in ms. Return current time on null or undefined
	public static getCurrentTimestampEstFromMs(timeInMs: number): number {
		if (!timeInMs) {
			return DateService.getCurrentTimestampEst();
		}

		return moment(timeInMs).tz(DateService.EST_TIMEZONE).toDate().getTime();
	}

	// returns today's EST date from a timestamp
	public static getCurrentDateInEstFromMs(timeInMs: number): Moment {
		return moment(timeInMs).tz(DateService.EST_TIMEZONE).format(DateService.DATE_US_FORMAT);
	}


	public static getCurrentTimestampEst(): number {
		return moment.tz(DateService.EST_TIMEZONE).toDate().getTime();
	}

	// returns today's EST dates timestamps with 00:00:00 as the time
	public static getCurrentDateTSInEST(): number {
		return DateService.getCurrentDateInEST().toDate().getTime();
	}

	// returns today's EST dates and current time
	public static getCurrentDateCurrentTimeInEST(): Date {
		const dateTimeMoment = moment.tz(new Date(), DateService.EST_TIMEZONE).format(DateService.DATE_TIME_FORMAT);
		return new Date(dateTimeMoment);

	}

	// returns today's EST date
	public static getCurrentDateInEST(): Moment {
		const date = moment.tz(new Date(), DateService.EST_TIMEZONE).format(DateService.DATE_FORMAT);
		return moment.tz(date + ' 00:00:00', DateService.EST_TIMEZONE);
	}

	public static getCurrentFYMInEST(): Moment {
		return DateService.getCurrentDateInEST().add(3, 'M');
	}

	public static getCurrentStartFiscalYearInEST(): Moment {
		const oct = moment('10-01', 'MM-DD', DateService.EST_TIMEZONE);
		const lastOct = oct < moment() ? oct : oct.subtract(1, 'years');
		return lastOct;
	}

	public static getCurrentPlusYearsInEST(years: number): Moment {
		return moment.tz(new Date(), DateService.EST_TIMEZONE).add(years, 'years');
	}

	public static addDays(startDate: any, days: any) {
		const dayInMilliSec = 60 * 60 * 24 * 1000;

		const newDate = startDate + (days * dayInMilliSec);
		return new Date(newDate);
	}

	public static subtractDays(startDate: number, days: number) {
		const dayInMilliSec = 60 * 60 * 24 * 1000;

		const newDate = startDate - (days * dayInMilliSec);
		return new Date(newDate);
	}

	// takes date string MM/DD/YYYY and returns a dateformat acceptable for moment js
	public static getMomentDateString(dateString: any) {
		if (!dateString || !dateString.split) {
			return dateString;
		} else {
			if (dateString.split('/').length !== 3) {
				return dateString;
			}
			const dtArray = dateString.split('/');
			if (dtArray[0].length === 1) {
				dtArray[0] = '0' + dtArray[0];
			}
			if (dtArray[1].length === 1) {
				dtArray[1] = '0' + dtArray[1];
			}
			return (dtArray[2] + '-' + dtArray[0] + '-' + dtArray[1] + ' 00:00:00');
		}
	}

	// check if date is in the last 12 months (present date included)
	public static isDateInLastTwelveMonths(date: Date) {
		const inputDate = moment(date).tz(DateService.EST_TIMEZONE);
		const oneYearAgo = moment().subtract(1, 'years');
		const currentDay = DateService.getCurrentDateTSInEST();
		return (inputDate.isSameOrAfter(oneYearAgo, 'day') && inputDate.isSameOrBefore(currentDay, 'day'));
	}

	// combine the provided date & time and return the corresponding moment date/time
	public static getMomentDateTime(date: string, time: string): number {
		const selectedDate = moment.tz(date, DateService.EST_TIMEZONE).format(this.DATE_US_FORMAT);
		return moment.tz(`${selectedDate} ${time}`, this.DATE_TIME_US_FORMAT, DateService.EST_TIMEZONE).valueOf();

	}

	public static convertDateStringToESTUnixTimestamp(date: string): number {
		return moment.tz(DateService.getMomentDateString(date), DateService.EST_TIMEZONE).valueOf();
	}

	constructor() {
	}

}
