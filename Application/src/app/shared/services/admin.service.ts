import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions, HttpModule, } from '@angular/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import "rxjs/Rx";
import { ConfigService } from './config';
import { paymentSchedule } from '../model'
import { AlertService } from '../../shared/modules/alert/alert.service'


@Injectable()
export class AdminService {

    constructor(private http: Http, private config: ConfigService, private alertService: AlertService) { }

    //#region Role
    fnGetRoles(UserId) {
        var url = ConfigService.baseWebApiUrl + '/GetRoles?UserId='+UserId;
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        return this.http.get(url, "")
            .map((response: any) => <any[]>JSON.parse(response._body||[]));
    }
   
    fnPostsRole(data: any) {
        var url = ConfigService.baseWebApiUrl + '/postRole';
        return this.http.post(url, data, "")
            .map((response: Response) => <any>(response));
    }   

    fnDeleteRole(RoleID: number) {
        var url = ConfigService.baseWebApiUrl + '/deleteRole?RoleID=' + RoleID;
        return this.http.get(url, "")
            .map((response: Response) => <string>(response.json()));
    }

    // #endregion of Role

    
    
    //#region employee
    fnGetEmployees(UserId:number) {
        var url = ConfigService.baseWebApiUrl + '/GetUsers?UserId='+UserId;
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        return this.http.get(url, "")
            .map((response: any) => <any[]>JSON.parse(response._body||[]));
    }

    fnGetEmployee(UserId: number,Id:number) {
        var url = ConfigService.baseWebApiUrl + '/GetUser?UserId='+UserId+'&Id=' + Id;
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        return this.http.get(url, "")
            .map((response: any) => <any[]>JSON.parse(response._body||[]));
    }

    fnPostEmployee(data: any) {
        var url = ConfigService.baseWebApiUrl + '/PostUser';
        return this.http.post(url, data, "")
            .map((response: Response) => <string>(response.json()));
    }

    fnUpdateEmployee(data: any) {
        var url = ConfigService.baseWebApiUrl + '/updateUser';
        return this.http.post(url, data, "")
            .map((response: Response) => <string>(response.json()));
    }
    fnDeleteEmployee(Id: number) {
        var url = ConfigService.baseWebApiUrl + '/deleteUser?Id=' + Id;
        return this.http.get(url, "")
            .map((response: Response) => <any>(response));
    }

    //#endregion of Employee
    public getHeaders(): Headers {
        let headers = new Headers();
        headers.set("Access-Control-Allow-Origin", "*");
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        return headers;
    }    

      //#region Root
      fnGetRoots(UserId:number) {
        var url = ConfigService.baseWebApiUrl + '/GetRoots?UserId='+UserId;
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        return this.http.get(url, "")
            .map((response: any) => <any[]>JSON.parse(response._body||[]));
    }

    fnGetRoot(UserId: number,RootId:number) {
        var url = ConfigService.baseWebApiUrl + '/GetRoot?UserId='+UserId+'&RootId=' + RootId;
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        return this.http.get(url, "")
            .map((response: any) => <any[]>JSON.parse(response._body||[]));
    }

    fnPostRoot(data: any) {
        var url = ConfigService.baseWebApiUrl + '/PostRoot';
        return this.http.post(url, data, "")
            .map((response: Response) => <any>(response));
    }

    
    fnDeleteRoot(Id: number) {
        var url = ConfigService.baseWebApiUrl + '/DeleteRoot?RootId=' + Id;
        return this.http.get(url, "")
            .map((response: Response) => <any>(response));
    }

    //#endregion of Root

     //#region Root Cost
     fnGetRootCostAll(UserId:number) {
        var url = ConfigService.baseWebApiUrl + '/GetRootCostList?UserId='+UserId;
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        return this.http.get(url, "")
            .map((response: any) => <any[]>JSON.parse(response._body||[]));
    }

    fnGetRootCost(UserId: number,RootId:number) {
        var url = ConfigService.baseWebApiUrl + '/GetRootCost?UserId='+UserId+'&Id=' + RootId;
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        return this.http.get(url, "")
            .map((response: any) => <any[]>JSON.parse(response._body||[]));
    }

    fnPostRootCost(data: any) {
        var url = ConfigService.baseWebApiUrl + '/PostRootCost';
        return this.http.post(url, data, "")
            .map((response: Response) => <any>(response));
    }

    
    fnDeleteRootCost(Id: number) {
        var url = ConfigService.baseWebApiUrl + '/DeleteRootCost?Id=' + Id;
        return this.http.get(url, "")
            .map((response: Response) => <any>(response));
    }

    //#endregion of Root Cost

    
    //#region Role
    fnGetVendor(UserId,VendorId,Type) {
        var url = ConfigService.baseWebApiUrl + '/GetVendorDetails?UserId='+UserId+'&VendorId='+VendorId+'&Type='+Type;
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        return this.http.get(url, "")
            .map((response: any) => <any[]>JSON.parse(response._body||[]));
    }
   
    fnPostVendor(data: any) {
        var url = ConfigService.baseWebApiUrl + '/SaveVendorDetails';
        return this.http.post(url, data, "")
            .map((response: Response) => <any>(response));
    }   

    fnDeleteVendor(VendorId: number,UserId:number) {
        var url = ConfigService.baseWebApiUrl + '/DeleteVendor?VendorId=' + VendorId+"&UserId="+UserId;
        return this.http.get(url, "")
            .map((response: Response) => <string>(response.json()));
    }

    // #endregion of Role

}