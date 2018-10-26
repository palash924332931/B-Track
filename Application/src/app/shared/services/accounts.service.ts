import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions, HttpModule, } from '@angular/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import "rxjs/Rx";
import { ConfigService } from './config';
import { paymentSchedule } from '../model'


@Injectable()
export class AccountsService {

    constructor(private http: Http, private config: ConfigService) { }

    //#region Root Cost
    fnGetPaySlipAll(UserId: number) {
        var url = ConfigService.baseWebApiUrl + '/GetPaySlipList?UserId=' + UserId;
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        return this.http.get(url, "")
            .map((response: any) => <any[]>JSON.parse(response._body || []));
    }

    fnGetPaySlipAllOnDemand(UserId: number, PaySlipId: number, BookNo: string, Type: string) {
        var url = ConfigService.baseWebApiUrl + '/GetPaySlipListOnDemand?UserId=' + UserId + '&PaySlipId=' + PaySlipId + '&BookNo=' + BookNo + '&Type=' + Type;
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        return this.http.get(url, "")
            .map((response: any) => <any[]>JSON.parse(response._body || []));
    }

    fnPostPaySlipAllOnDemand(UserId: number, PaySlipId: number, BookNo: string, Type: string) {
        var url = ConfigService.baseWebApiUrl + '/GetPaySlipListOnDemandApproval?UserId=' + UserId + '&PaySlipId=' + PaySlipId + '&BookNo=' + BookNo + '&Type=' + Type;
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        return this.http.get(url, "")
            .map((response: any) => <any>response);
    }

    fnGetPaySlipBookWise(UserId: number, BookNo: string) {
        var url = ConfigService.baseWebApiUrl + '/GetPaySlipBookWise?UserId=' + UserId + "&BookNo=" + BookNo;
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        return this.http.get(url, "")
            .map((response: any) => <any[]>JSON.parse(response._body || []));
    }

    fnGetPaySlip(UserId: number, RootId: number) {
        var url = ConfigService.baseWebApiUrl + '/GetPayslip?UserId=' + UserId + '&Id=' + RootId;
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        return this.http.get(url, "")
            .map((response: any) => <any[]>JSON.parse(response._body || []));
    }

    fnPostPaySlip(data: any[]) {
        var url = ConfigService.baseWebApiUrl + '/PostPayslip';
        return this.http.post(url, data, "")
            .map((response: Response) => <any>(response));
    }

    fnPostPayslipForApproval(data: any[], UserId: number, Type: string) {
        var url = ConfigService.baseWebApiUrl + '/PostPayslipForApproval?UserId=' + UserId + '&Type=' + Type;
        return this.http.post(url, data, "")
            .map((response: Response) => <any>(response));
    }


    fnDeletePaySlip(Id: number) {
        var url = ConfigService.baseWebApiUrl + '/DeleteRootCost?Id=' + Id;
        return this.http.get(url, "")
            .map((response: Response) => <any>(response));
    }
    fnDeletePaySlipBook(UserId: number, PaySlipId: number, BookNo: string, Type: string) {
        var url = ConfigService.baseWebApiUrl + '/DeletePaySlipBook?UserId=' + UserId + '&PaySlipId=' + PaySlipId + '&BookNo=' + BookNo + '&Type=' + Type;
        return this.http.get(url, "")
            .map((response: Response) => <any>(response));
    }

    fnGetPaySlipBook(UserId: number) {
        var url = ConfigService.baseWebApiUrl + '/GetPayslipBook?UserId=' + UserId;
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        return this.http.get(url, "")
            .map((response: any) => <any[]>JSON.parse(response._body || []));
    }
    //#endregion of Root Cost

    //#region Payment
    fnGetDailyPaymentList(UserId: number) {
        var url = ConfigService.baseWebApiUrl + '/GetDailyPaymentList?UserId=' + UserId;
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        return this.http.get(url, "")
            .map((response: any) => <any[]>JSON.parse(response._body || []));
    }

    fnGetDailyPayment(UserId: number, PaymentId: number) {
        var url = ConfigService.baseWebApiUrl + '/GetDailyPayment?UserId=' + UserId + "&PaymentId=" + PaymentId;
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        return this.http.get(url, "")
            .map((response: any) => <any[]>JSON.parse(response._body || []));
    }

    fnGetDailyPaymentDateRange(UserId: number, FromDate: string,ToDate:string,Type:string) {
        var url = ConfigService.baseWebApiUrl + '/GetIncomeReportDateRangeBusWiseSection?UserId=' + UserId + "&FromDate=" + FromDate + "&ToDate=" + ToDate + "&Type=" + Type+'&RouteId=0';
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        return this.http.get(url, "")
            .map((response: any) => <any[]>JSON.parse(response._body || []));
    }
    
    fnGetBusPaymentHistory(UserId: number, FromDate: string,ToDate:string,Type:string) {
        var url = ConfigService.baseWebApiUrl + '/GetBusPaymentHistory?UserId=' + UserId + "&FromDate=" + FromDate + "&ToDate=" + ToDate + "&Type=" + Type+'&RouteId=0';
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        return this.http.get(url, "")
            .map((response: any) => <any[]>JSON.parse(response._body || []));
    }

    fnGetApprovedRecordForCollection(UserId: number, FromDate: string,ToDate:string,Type:string){
        var url = ConfigService.baseWebApiUrl + '/GetIncomeReportDateRangeBusWiseSection?UserId=' + UserId + "&FromDate=" + FromDate + "&ToDate=" + ToDate + "&Type=" + Type+'&RouteId=0';
         return this.http.get(url, "")
            .map((response: any) => <any[]>JSON.parse(response._body || []));
    }


    fnPostPayment(data: any) {
        var url = ConfigService.baseWebApiUrl + '/PostPayment';
        return this.http.post(url, data, "")
            .map((response: Response) => <any>(response));
    }

    fnPostMultiPayment(data: any,userId:number) {
        var url = ConfigService.baseWebApiUrl + '/PostMultiPayment?userId='+userId;
        return this.http.post(url, data, "")
            .map((response: Response) => <any>(response));
    }


    fnDeletePayment(PaymentId: number) {
        var url = ConfigService.baseWebApiUrl + '/DeletePayment?Id=' + PaymentId;
        return this.http.get(url, "")
            .map((response: Response) => <any>(response));
    }

    // fnGetPaySlipBook(UserId: number) {
    //     var url = ConfigService.baseWebApiUrl + '/GetPayslipBook?UserId=' + UserId;
    //     //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
    //     return this.http.get(url, "")
    //         .map((response: any) => <any[]>JSON.parse(response._body || []));
    // }
    //#endregion of Payment
}