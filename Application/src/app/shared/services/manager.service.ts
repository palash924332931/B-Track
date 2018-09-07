import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions, HttpModule, } from '@angular/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import "rxjs/Rx";
import { ConfigService } from './config';
import { AlertService } from '../modules/alert/alert.service'


@Injectable()
export class ManagerService {

    constructor(private http: Http, private config: ConfigService, private alertService: AlertService) { }
     
    fnGetPOLLogByDate(UserId: number,POLId:number,FromDate:string,ToDate:string,Type:string) {
        var url = ConfigService.baseWebApiUrl + '/GetDailyPOLLogByDate?UserId=' + UserId+'&Type='+Type+'&FromDate='+FromDate+'&ToDate='+ToDate;
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        return this.http.get(url, "")
            .map((response: any) => <any[]>JSON.parse(response._body || []));
    }
   

}