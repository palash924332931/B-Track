import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Injectable } from "@angular/core";
import { DatePipe } from '@angular/common';
import { debuglog } from 'util';

@Injectable()
export class CustomNgbDateParserFormatter extends NgbDateParserFormatter {
	datePipe = new DatePipe('en-US');
	constructor(
		// private dateFormatString: string
	) {
		super();
	}
	format(date: any): string {//NgbDateStruct
		if (date === null) {
			return '';
		}
		try {
            //return this.datePipe.transform(new Date(date.year, date.month - 1, date.day), this.dateFormatString);
            return this.datePipe.transform(new Date(date.year, date.month - 1, date.day), 'yyyy-MM-dd');
		} catch (e) {
			return '';
		}
	}
	parse(value: string): NgbDateStruct {
        let returnVal: NgbDateStruct;
        //let returnVal: string;;
		if (!value) {
			returnVal = null;
		} else {
			try {
				let dateParts = this.datePipe.transform(value, 'yyyy-MM-dd').split('-');
                returnVal = { year: parseInt(dateParts[0]), month: parseInt(dateParts[1]), day: parseInt(dateParts[2]) };
               // returnVal = "2017-12-17";
			} catch (e) {
				returnVal = null;
			}
		}
		return returnVal;
	}
}