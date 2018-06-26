import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions,HttpModule, } from '@angular/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import "rxjs/Rx";
import { ConfigService } from './config';
import {paymentSchedule} from '../model'


@Injectable()
export class LoanService {

    constructor(private http: Http,private config:ConfigService) { }  

    fnGetAgreements() {
        var url = ConfigService.baseWebApiUrl+'/GetAgreement';
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        return this.http.get(url, "")
            .map((response: Response) => <any[]>JSON.parse(response.json()));
    }

    fnGetPaymentSchedule() {
       // var url = ConfigService.baseWebApiUrl+'/login/UserLogin?log='+data;
        var url = ConfigService.baseWebApiUrl+'/GetPaymentSchedule';
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        return this.http.get(url, "")
            .map((response: Response) => <paymentSchedule[]>JSON.parse(response.json()));
    }

    getPosts(data: any): Observable<any[]> {
        var url = ConfigService.baseWebApiUrl+'/login/login?log='+data;
        return this.http
            .get(url)
            .map((response: Response) => {
                return <any[]>response.json();
            })
            //.catch(this.handleError);
    }
}