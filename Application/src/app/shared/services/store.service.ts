import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions, HttpModule, } from '@angular/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import "rxjs/Rx";
import { ConfigService } from './config';
import { paymentSchedule } from '../model'


@Injectable()
export class StoreService {

    constructor(private http: Http, private config: ConfigService) { }

    //#region Job
    fnGetJobList(UserId: number,JobStartDate:string,JobId:number,Type:string) {
        var url = ConfigService.baseWebApiUrl + '/GetJobList?UserId=' + UserId+'&JobStartDate='+JobStartDate+'&JobId='+JobId+"&Type="+Type;
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        return this.http.get(url, "")
            .map((response: any) => <any[]>JSON.parse(response._body || []));
    }
    fnGetJob(UserId: number) {
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
    //#endregion of Job

    //#region Parts
    fnGetPatsList(UserId: number) {
        var url = ConfigService.baseWebApiUrl + '/GetPartsList?UserId=' + UserId;
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        return this.http.get(url, "")
            .map((response: any) => <any[]>JSON.parse(response._body || []));
    }

    
    
    

    fnPostPayment(data: any) {
        var url = ConfigService.baseWebApiUrl + '/PostPayment';
        return this.http.post(url, data, "")
            .map((response: Response) => <any>(response));
    }


    fnDeletePayment(PaymentId: number) {
        var url = ConfigService.baseWebApiUrl + '/DeletePayment?Id=' + PaymentId;
        return this.http.get(url, "")
            .map((response: Response) => <any>(response));
    }
    //#endregion of Payment


     //#region POL
     fnGetPOLLogList(UserId: number) {
        var url = ConfigService.baseWebApiUrl + '/GetPOLList?UserId=' + UserId;
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        return this.http.get(url, "")
            .map((response: any) => <any[]>JSON.parse(response._body || []));
    }

    fnPOLLog(data: any) {
        var url = ConfigService.baseWebApiUrl + '/PostPayment';
        return this.http.post(url, data, "")
            .map((response: Response) => <any>(response));
    }


    fnDeletePOLLog(PaymentId: number) {
        var url = ConfigService.baseWebApiUrl + '/DeletePayment?Id=' + PaymentId;
        return this.http.get(url, "")
            .map((response: Response) => <any>(response));
    }
    //#endregion of Payment
}