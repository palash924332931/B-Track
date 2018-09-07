import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions, HttpModule, } from '@angular/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import "rxjs/Rx";
import { ConfigService } from './config';
import { paymentSchedule } from '../model'


@Injectable()
export class ReportService {

    constructor(private http: Http, private config: ConfigService) { }

    //#region Report
    fnGetDailyCarTypesReport(UserId: number,date:string) {
        var url = ConfigService.baseWebApiUrl + '/GetDailyCarTypesReport?UserId=' + UserId+'&date='+date;
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        return this.http.get(url, "")
            .map((response: any) => <any[]>JSON.parse(response._body || []));
    }

    fnGetDailyCarLogReport(UserId: number,date:string) {
        var url = ConfigService.baseWebApiUrl + '/GetDailyCarLogReport?UserId=' + UserId+'&date='+date;
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        return this.http.get(url, "")
            .map((response: any) => <any[]>JSON.parse(response._body || []));
    }
    fnGetDashboardReport(UserId: number,date:string) {
        var url = ConfigService.baseWebApiUrl + '/GetDashboardReport?UserId=' + UserId+'&date='+date;
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        return this.http.get(url, "")
            .map((response: any) => <any[]>JSON.parse(response._body || []));
    }

    fnGetIncomeReportDateRange(UserId: number,FromDate:string,ToDate:string,Type:string) {
        var url = ConfigService.baseWebApiUrl + '/GetMonthlyIncomeReport?UserId=' + UserId+'&FromDate='+FromDate+'&ToDate='+ToDate+'&Type='+Type;
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        return this.http.get(url, "")
            .map((response: any) => <any[]>JSON.parse(response._body || []));
    }

    fnGetIncomeExpenseReport(UserId: number,FromDate:string,ToDate:string,Type:string) {
        var url = ConfigService.baseWebApiUrl + '/GetMonthlyIncomeExpenseReport?UserId=' + UserId+'&FromDate='+FromDate+'&ToDate='+ToDate+'&Type='+Type;
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        return this.http.get(url, "")
            .map((response: any) => <any[]>JSON.parse(response._body || []));
    }

    fnGetIncomeReportRouteWiseDateRange(UserId: number,FromDate:string,ToDate:string,Type:string) {
        var url = ConfigService.baseWebApiUrl + '/GetMonthlyIncomeRouteWiseReport?UserId=' + UserId+'&FromDate='+FromDate+'&ToDate='+ToDate+'&Type='+Type;
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        return this.http.get(url, "")
            .map((response: any) => <any[]>JSON.parse(response._body || []));
    }

    fnGetMonthlyBusRouteWiseDateRange(UserId: number,FromDate:string,ToDate:string,CarId:number,Type:string) {
        var url = ConfigService.baseWebApiUrl + '/GetBusReportDateRangeRouteWise?UserId=' + UserId+'&FromDate='+FromDate+'&ToDate='+ToDate+'&CarId='+CarId+'&Type='+Type;
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        return this.http.get(url, "")
            .map((response: any) => <any[]>JSON.parse(response._body || []));
    }

    fnGetPaySlipBook(UserId: number) {
        var url = ConfigService.baseWebApiUrl + '/GetPayslipBook?UserId=' + UserId;
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        return this.http.get(url, "")
            .map((response: any) => <any[]>JSON.parse(response._body || []));
    }
    //#endregion of Root Cost 

    fnGetPaySlipBookReport(UserId: number) {
        var url = ConfigService.baseWebApiUrl + '/GetPayslipBook?UserId=' + UserId;
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        return this.http.get(url, "")
            .map((response: any) => <any[]>JSON.parse(response._body || []));
    }
    
    fnGetPaySlipBookDetails(UserId: number,BookNo:string,Type:string) {
        var url = ConfigService.baseWebApiUrl + '/GetPaySlipBookOnDemand?UserId=' + UserId+'&BookNo='+BookNo+'&Type='+Type;
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        return this.http.get(url, "")
            .map((response: any) => <any[]>JSON.parse(response._body || []));
    }

    async fnGetReportSectionDateRange(UserId, FromDate,ToDate, RouteId,CarId, Type) {
        var url = ConfigService.baseWebApiUrl + '/GetReportSectionDateRange?UserId=' + UserId + '&FromDate=' + FromDate+'&ToDate=' + ToDate + '&RouteId=' + RouteId + '&CarId=' + CarId+ '&Type=' + Type;
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        var response: any;
        await this.http.get(url, '')
            .toPromise().then(result => response = result)
            .catch((ex: any) => {
                Observable.throw("");
            });
        return JSON.parse(response._body || []);
    }
}