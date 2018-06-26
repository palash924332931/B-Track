import { Component, OnInit,Injectable } from '@angular/core';
import {NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class NgbDateFRParserFormatter  extends NgbDateParserFormatter {

    parse(value: string): NgbDateStruct {
        debugger
        if (value) {
            return {year:2017, month: 12, day: 12};
        }   
        return null;
    }

    format(date: any): string {
        debugger
        let stringDate: string = ""; 
        if(date) {
            stringDate='2017-12-12';
        }
        return stringDate;
    }
}

@Component({
    selector: 'app-date-picker',
    templateUrl: './date-picker.component.html',
    styleUrls: ['./date-picker.component.scss'],    
    providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class DatePickerComponent implements OnInit {
    model: any;
    constructor(private ngbDateParserFormatter: NgbDateParserFormatter) { }

    ngOnInit() {
        //this.model=new Date(2017-12-12);
        //this.model={year:2017, month: 12, day: 12}
        this.model=this.ngbDateParserFormatter.parse("2017-1-12");
    }

    fnChangeFormat(date:any){
        return date;
    }

}
