import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions,HttpModule, } from '@angular/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import "rxjs/Rx";
import { ConfigService } from './config';


@Injectable()
export class LoginService {
    private actionUrl: string;
    private headers: Headers;
    private getapiUrl: string;
    private getsubapiUrl: string;
    private getdownloadUrl: string;
    private getdownloadDeliverablesUrl: string;
    public subscriptionID: number;

    constructor(private http: Http,private config:ConfigService) {
        // this.actionUrl = ConfigService.baseWebApiUrl;
        // this.getapiUrl = ConfigService.getApiUrl('ClientMarketBaseDetails?id=');
        // this.getsubapiUrl = ConfigService.getApiUrl('GetClientSubscriptions?clientid=');
        // this.getdownloadUrl = ConfigService.getApiUrl('DownloadSubscriptions?clientid=');
        // this.getdownloadDeliverablesUrl = ConfigService.getApiUrl('deliverables/DownloadDeliverablesByClient?clientid=')
    }
    private getHeaders() {
        let headers = new Headers();
        headers.set("Access-Control-Allow-Origin", "*");
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        return headers;

        /*
         let headers = new Headers();
        headers.set("Access-Control-Allow-Origin", "*");
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        let options       = new RequestOptions({ headers: headers }); // Create a request option
        */
    }
   

    fnLogin1(data: any) {  
        let headers = new Headers({"Access-Control-Allow-Origin": "*", 'Content-Type': 'application/json',"Accept": 'application/json' });
        let options = new RequestOptions({ headers: headers });
         var url = ConfigService.baseWebApiUrl+'/UserLogin';
         return this.http.post(url, data,"")
             .map((response: Response) => <any[]>JSON.parse(response.json()));
     }  
     
     fnLogin(data: any) {  
        let headers = new Headers({"Access-Control-Allow-Origin": "*", 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
         var url = ConfigService.baseWebApiUrl+'/UserLogin1?tst=12222';
         return this.http.get(url, "",)
             .map((response: Response) => <any[]>JSON.parse(response.json()));
     }  
   
}