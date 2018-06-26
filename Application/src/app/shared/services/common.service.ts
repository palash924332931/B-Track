import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions, HttpModule } from '@angular/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import "rxjs/Rx";
import { ConfigService } from './config';
import { paymentSchedule } from '../model'


@Injectable()
export class CommonService {

    constructor(private http: Http, private config: ConfigService) { }

    fnUpdateUserData(UserId: number, Lang: string, Type: string) {
        var url = ConfigService.baseWebApiUrl + '/UpdateUserInfo?UserId=' + UserId + '&Lang=' + Lang + '&Type=' + Type;
        return this.http.get(url, "")
            .map((response: Response) => <any>response);
    }

    fnGetPermittedMenu(UserId: number) {
        var url = ConfigService.baseWebApiUrl + '/GetUserMenuDetails?UserId=' + UserId;
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        return this.http.get(url, "")
            .map((response: any) => <any[]>JSON.parse(response._body || []));
    }
    fnGetPermittedMenuRoleWise(RoleId: number) {
        var url = ConfigService.baseWebApiUrl + '/GetUserMenuRoleWise?RoleId=' + RoleId;
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        return this.http.get(url, "")
            .map((response: any) => <any[]>JSON.parse(response._body || []));
    }

    fnPostRolePermission(data: any[],RoleId,UserId,CompanyId) {
        var url = ConfigService.baseWebApiUrl + '/PostRolePermission?RoleId=' + RoleId+"&UserId="+UserId+"&CompanyId="+CompanyId;
        return this.http.post(url, data, "")
            .map((response: Response) => <any>(response));
    }

    fnSpecialActivity(UserId: number,CarLogId:number,Type:string) {
        var url = ConfigService.baseWebApiUrl + '/SpecialActivity?UserId=' + UserId+'&CarLogId='+CarLogId+'&Type='+Type;
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        return this.http.get(url, "")
            .map((response: any) => <any>(response));
    }

    
    getPosts(data: any): Observable<any[]> {
        var url = ConfigService.baseWebApiUrl + '/login/login?log=' + data;
        return this.http
            .get(url)
            .map((response: Response) => {
                return <any[]>response.json();
            })
        //.catch(this.handleError);
    }

    fnAddDays(theDate, days) {
        let dt = new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
        let current_date = dt.getDate(),
            current_month = dt.getMonth() + 1,
            current_year = dt.getFullYear(),
            current_hrs = dt.getHours(),
            current_mins = dt.getMinutes(),
            current_secs = dt.getSeconds(),
            current_datetime;
        return current_year + '-' + current_month + '-' + current_date;
    }

    public numbers = { '0':'০', '1':'১','2': '২', '3':'৩', '4':'৪', '5':'৫','6': '৬','7': '৭', '8':'৮', '9':'৯'};
    public fnConvertEngToBangDigit(num: string) {        
        if(num==""||num==null||num==undefined){
            return "";
        }

        var output = [];
        for (var i = 0; i < num.length; ++i) {
            if (this.numbers.hasOwnProperty(num[i])) {
                output.push(this.numbers[num[i]]);
            } else {
                output.push(num[i]);
            }
        }
        return output.join('');
    }
}