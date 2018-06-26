import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions, HttpModule, } from '@angular/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import "rxjs/Rx";
import { ConfigService } from './config';

@Injectable()
export class CustomerService {
    constructor(private http: Http, private config: ConfigService) { }
    //#region Customer
    fnGetCustomers() {
        var url = ConfigService.baseWebApiUrl + '/GetCustomers';
        let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        return this.http.get(url, "")
            .map((response: Response) => <any[]>JSON.parse(response.json()));
    }
    
    fnGetCustomer(customerId: number) {
        var url = ConfigService.baseWebApiUrl + '/GetCustomer?CustomerID=' + customerId;
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        return this.http.get(url, "")
            .map((response: Response) => <any[]>JSON.parse(response.json()));
    }
    fnPostCustomer(data: any) {
        var url = ConfigService.baseWebApiUrl + '/postCustomer';
        return this.http.post(url, data, "")
            .map((response: Response) => <string>(response.json()));
    }
    fnUpdateCustomer(data: any) {
        var url = ConfigService.baseWebApiUrl + '/updateCustomer';
        return this.http.post(url, data, "")
            .map((response: Response) => <string>(response.json()));
    }
    fnDeleteCustomer(customerId: number) {
        var url = ConfigService.baseWebApiUrl + '/deleteCustomer?CustomerID=' + customerId;
        return this.http.get(url, "")
            .map((response: Response) => <string>(response.json()));
    }
    //#endregion of group

    public getHeaders() {
        let headers = new Headers();
        headers.set("Access-Control-Allow-Origin", "*");
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        return headers;
    }
}