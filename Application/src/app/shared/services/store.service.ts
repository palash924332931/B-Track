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
    fnGetJobList(UserId: number, FromDate: string, ToDate: string, JobId: number, Type: string) {
        var url = ConfigService.baseWebApiUrl + '/GetJobList?UserId=' + UserId + '&FromDate=' + FromDate + '&ToDate=' + ToDate + '&JobId=' + JobId + "&Type=" + Type;
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

    fnPostJobInfo(data: any) {
        var url = ConfigService.baseWebApiUrl + '/postJobInfo';
        return this.http.post(url, data, "")
            .map((response: Response) => <any>(response));
    }


    //#endregion of Job

    //#region Parts
    fnGetPatsList(UserId: number) {
        var url = ConfigService.baseWebApiUrl + '/GetPartsList?UserId=' + UserId;
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        return this.http.get(url, "")
            .map((response: any) => <any[]>JSON.parse(response._body || []));
    }

    //#endregion of Job
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
    fnGetPOLLogList(UserId: number, POLId: number, FromDate: string, ToDate: string, Type: string) {
        var url = ConfigService.baseWebApiUrl + '/GetPOLList?UserId=' + UserId + '&POLId=' + POLId + '&FromDate=' + FromDate + '&ToDate=' + ToDate + '&Type=' + Type;
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        return this.http.get(url, "")
            .map((response: any) => <any[]>JSON.parse(response._body || []));
    }

    fnPOLLog(data: any) {
        var url = ConfigService.baseWebApiUrl + '/PostPayment';
        return this.http.post(url, data, "")
            .map((response: Response) => <any>(response));
    }


    fnDeletePOLLog(UserID: number, POLId: number) {
        var url = ConfigService.baseWebApiUrl + '/DeletePOL?POLId=' + POLId + '&UserID=' + UserID;
        return this.http.get(url, "")
            .map((response: Response) => <any>(response));
    }
    fnPostPLO(data: any) {
        var url = ConfigService.baseWebApiUrl + '/postPOL';
        return this.http.post(url, data, "")
            .map((response: Response) => <any>(response));
    }

    fnUpdatePOLRecordStatus(userId: number, polIdArray: any[], statusChangeTo: string) {
        let polIds = polIdArray.join(",");
        var url = ConfigService.baseWebApiUrl + '/POLStatusUpdate?userId=' + userId + '&polIds=' + polIds + '&statusChangeTo=' + statusChangeTo;
        return this.http.get(url, "")
            .map((response: Response) => <any>(response));
    }

    //#endregion of POL

    //#region Parts
    fnPostPartsDetails(data: any) {
        var url = ConfigService.baseWebApiUrl + '/store/PostStoreParts';
        return this.http.post(url, data, "")
            .map((response: Response) => <any>(response));
    }

    fnGetStoreInfoById(userId:number, jobId:number){        
        var url = ConfigService.baseWebApiUrl + '/GetStoreInfoById?userId=' + userId + '&jobId=' + jobId;
        return this.http.get(url, "")
        .map((response: any) => <any[]>JSON.parse(response._body || []));
    }

    fnPostStoreOut(data: any) {
        var url = ConfigService.baseWebApiUrl + '/store/PostStoreInfoOut';
        return this.http.post(url, data, "")
            .map((response: Response) => <any>(response));
    }
    //#endregion
}