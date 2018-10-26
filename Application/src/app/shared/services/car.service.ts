import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, HttpModule, ResponseContentType } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { ConfigService } from './config';
import { CarType } from '../model/car/car-type';
import { AlertService } from '../../shared/modules/alert/alert.service';
import { saveAs } from 'file-saver';

@Injectable()
export class CarService {

    constructor(private http: Http, private config: ConfigService, private alertService: AlertService) { }

    //#region Car Type
    async fnGetCarTypes(UserId) {
        var url = ConfigService.baseWebApiUrl + '/GetCarType?UserId=' + UserId;
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        var response: any;
        await this.http.get(url, '')
            .toPromise().then(result => response = result)
            .catch((ex: any) => {
                this.alertService.fnLoading(false);
                this.alertService.alert(response);
                Observable.throw('');
            });

        return JSON.parse(response._body || []);
    }

    fnPostsCarType(data: CarType) {
        var url = ConfigService.baseWebApiUrl + '/PostCarType';
        return this.http.post(url, data, '')
            .map((response: Response) => (response));
    }

    fnDeleteCarType(TypeId: number) {
        var url = ConfigService.baseWebApiUrl + '/DeleteCarType?TypeId=' + TypeId;
        return this.http.get(url, "")
            .map((response: Response) => { (response); console.log("response", response); });
    }

    // #endregion of Car Type

    //#region Bus
    async fnGetBuses(UserId) {
        var url = ConfigService.baseWebApiUrl + '/GetBuses?UserId=' + UserId;
        // let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        var response: any;
        await this.http.get(url, '')
            .toPromise().then(result => response = result)
            .catch((ex: any) => {
                this.alertService.fnLoading(false);
                this.alertService.alert(response);
                Observable.throw('');
            });
        return JSON.parse(response._body || []);
    }

    async fnGetBusesOnType(UserId, CarTypeId, Type = 'CarType') {
        var url = ConfigService.baseWebApiUrl + '/GetBusesOnType?UserId=' + UserId + '&Id=' + CarTypeId + '&Type=' + Type;
        // let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        var response: any;
        await this.http.get(url, '')
            .toPromise().then(result => response = result)
            .catch((ex: any) => {
                this.alertService.fnLoading(false);
                this.alertService.alert(response);
                Observable.throw('');
            });
        return JSON.parse(response._body || []);
    }

    async fnGetDailyPaymentReportSection(UserId, SelectedDate, CarTypeId, Type) {
        var url = ConfigService.baseWebApiUrl + '/GetDailyPaymentReportSection?UserId=' + UserId + '&SelectedDate=' + SelectedDate + '&CarTypeId=' + CarTypeId + '&Type=' + Type;
        // let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        var response: any;
        await this.http.get(url, '')
            .toPromise().then(result => response = result)
            .catch((ex: any) => {
                this.alertService.fnLoading(false);
                this.alertService.alert(response);
                Observable.throw("");
            });
        return JSON.parse(response._body || []);
    }

    async fnGetIncomeReportSectionDateRange(UserId, FromDate,ToDate, CarTypeId, Type) {
        var url = ConfigService.baseWebApiUrl + '/GetIncomeReportDateRange?UserId=' + UserId + '&FromDate=' + FromDate+'&ToDate=' + ToDate + '&CarTypeId=' + CarTypeId + '&Type=' + Type;
        // let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        var response: any;
        await this.http.get(url, '')
            .toPromise().then(result => response = result)
            .catch((ex: any) => {
                this.alertService.fnLoading(false);
                this.alertService.alert(response);
                Observable.throw('');
            });
        return JSON.parse(response._body || []);
    }

    async fnGetIncomeReportDateRangeBusWiseSection(UserId, FromDate,ToDate, RouteId, Type) {
        var url = ConfigService.baseWebApiUrl + '/GetIncomeReportDateRangeBusWiseSection?UserId=' + UserId + '&FromDate=' + FromDate+'&ToDate=' + ToDate + '&RouteId=' + RouteId + '&Type=' + Type;
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        var response: any;
        await this.http.get(url, '')
            .toPromise().then(result => response = result)
            .catch((ex: any) => {
                this.alertService.fnLoading(false);
                this.alertService.alert(response);
                Observable.throw("");
            });
        return JSON.parse(response._body || []);
    }

    //to get specific bus
    async fnGetBus(UserId, carId) {
        var url = ConfigService.baseWebApiUrl + '/GetBus?UserId=' + UserId + '&CarId=' + carId;
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        var response: any;
        await this.http.get(url, '')
            .toPromise().then(result => response = result)
            .catch((ex: any) => {
                this.alertService.fnLoading(false);
                this.alertService.alert(response);
                Observable.throw("");
            });
        return JSON.parse(response._body || []);
    }

    fnPostBus(data: any) {
        var url = ConfigService.baseWebApiUrl + '/PostBus';
        return this.http.post(url, data, "")
            .map((response: Response) => <any>(response));
    }

    fnUpdateProduct(data: any) {
        var url = ConfigService.baseWebApiUrl + '/updateProduct';
        return this.http.post(url, data, "")
            .map((response: Response) => <string>(response.json()));
    }

    fnDeleteBus(carId: number) {
        var url = ConfigService.baseWebApiUrl + '/DeleteBus?CarId=' + carId;
        return this.http.get(url, "")
            .map((response: Response) => (response));
    }


    async fnDownloadBusList1(UserId) {
        var url = ConfigService.baseWebApiUrl + '/GeneratePDF?UserId=' + UserId;
        /*var response: any;
       await this.http.get(url, '')
           .toPromise().then(result => response = result)
           .catch((ex: any) => {
               this.alertService.fnLoading(false);
               this.alertService.alert(response);
               Observable.throw("");
           });
       return JSON.parse(response._body||[]);*/
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Accept': 'application/pdf',
            "Access-Control-Allow-Origin": "*",
        });
        let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });
        this.http.get(url, options).subscribe(
            (response: any) => {
                debugger
                var mediaType = 'application/pdf';
                var blob = new Blob([response.blob], { type: 'application/pdf' });
                //var blob = new Blob([response._body.blob], {type: 'application/pdf'});
                var filename = 'test.pdf';
                console.log(blob);
                console.log(response);
                saveAs(blob, filename);
                // let url: any = URL.createObjectURL(blob);
                // window.open(url.blob);
            }, (error: any) => { alert("error "); });




        // this.http.post(url,"",options)
        //     .subscribe(
        //     (data:any) => {
        //         debugger;
        //         alert("succes");
        //         console.log(data);
        //         var blob = new Blob([data], { type: 'application/pdf' });
        //         console.log(blob);
        //         //saveAs(blob, "testData.pdf");
        //         var fileURL = URL.createObjectURL(blob);
        //         window.open(fileURL);

        //     },
        //     err => console.error(err),
        //     () => console.log('done')
        //     );
    }

    fnDownloadBusList(cliendid) {
        debugger
       
            // var url = this.getdownloadUrl + cliendid;
            //  let options = new RequestOptions({ headers: CommonService.getHeaders(), method: "get" });
            var url = ConfigService.baseWebApiUrl + '/GeneratePDF?UserId=' + cliendid;

            let xhr = new XMLHttpRequest();
            //let headers = this.getxlHeaders();
            xhr.open('GET', url, true);
            xhr.setRequestHeader('Content-type', 'application/pdf');
            // var t = this.getCookie("token");
            // if (t != null && t != '')
            //     headers.append('Authorization', 'bearer ' + t);
            // xhr.setRequestHeader('Authorization', 'bearer ' + t);
            // xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
            xhr.responseType = 'blob';

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                            debugger
                        var contentType = 'application/pdf';
                        var blob = new Blob([xhr.response], { type: contentType });
                        saveAs(blob, "testData.pdf");
                       // observer.next(blob);
                        //observer.complete();
                    } else {
                        alert("eppr");
                    }
                }
            }
            xhr.send();
  
    }
    //#endregion of Bus

    //#region Bus
    async fnGetDrivers(UserId) {
        var url = ConfigService.baseWebApiUrl + '/GetDrivers?UserId=' + UserId;
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        var response: any;
        await this.http.get(url, '')
            .toPromise().then(result => response = result)
            .catch((ex: any) => {
                this.alertService.fnLoading(false);
                this.alertService.alert(response);
                Observable.throw("");
            });
        return JSON.parse(response._body || []);
    }

    //to get specific bus
    async fnGetDriver(UserId, DriverId) {
        var url = ConfigService.baseWebApiUrl + '/GetDriver?UserId=' + UserId + '&DriverId=' + DriverId;
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        var response: any;
        await this.http.get(url, '')
            .toPromise().then(result => response = result)
            .catch((ex: any) => {
                this.alertService.fnLoading(false);
                this.alertService.alert(response);
                Observable.throw("");
            });
        return JSON.parse(response._body || []);
    }

    fnPostDriver(data: any) {
        var url = ConfigService.baseWebApiUrl + '/PostDriver';
        return this.http.post(url, data, "")
            .map((response: Response) => <any>(response));
    }

    fnDeleteDriver(DriverId: number) {
        var url = ConfigService.baseWebApiUrl + '/DeleteDriver?DriverId=' + DriverId;
        return this.http.get(url, "")
            .map((response: Response) => (response));
    }

    //#endregion of Bus

    //#region employee
    fnGetEmployees() {
        var url = ConfigService.baseWebApiUrl + '/GetUsers';
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        return this.http.get(url, "")
            .map((response: Response) => <any[]>JSON.parse(response.json()));
    }

    fnGetEmployee(Id: number) {
        var url = ConfigService.baseWebApiUrl + '/GetUser?ID=' + Id;
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        return this.http.get(url, "")
            .map((response: Response) => <any[]>JSON.parse(response.json()));
    }
    fnPostEmployee(data: any) {
        var url = ConfigService.baseWebApiUrl + '/postUser';
        return this.http.post(url, data, "")
            .map((response: Response) => <string>(response.json()));
    }
    fnUpdateEmployee(data: any) {
        var url = ConfigService.baseWebApiUrl + '/updateUser';
        return this.http.post(url, data, "")
            .map((response: Response) => <string>(response.json()));
    }
    fnDeleteEmployee(Id: number) {
        var url = ConfigService.baseWebApiUrl + '/deleteUser?ID=' + Id;
        return this.http.get(url, "")
            .map((response: Response) => <string>(response.json()));
    }

    //#endregion of Employee


    //#region Daily Log History
    async fnGetDilyCarLogList(UserId) {
        var url = ConfigService.baseWebApiUrl + '/GetDilyCarLogList?UserId=' + UserId;
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        var response: any;
        await this.http.get(url, '')
            .toPromise().then(result => response = result)
            .catch((ex: any) => {
                this.alertService.fnLoading(false);
                this.alertService.alert(response);
                Observable.throw("");
            });
        return JSON.parse(response._body || []);
    }

    async fnGetDilyCarLogListDateRange(UserId, Type, FromDate, ToDate) {
        var url = ConfigService.baseWebApiUrl + '/GetDilyCarLogListByDate?UserId=' + UserId + '&Type=' + Type + '&FromDate=' + FromDate + '&ToDate=' + ToDate;
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        var response: any;
        await this.http.get(url, '')
            .toPromise().then(result => response = result)
            .catch((ex: any) => {
                this.alertService.fnLoading(false);
                this.alertService.alert(response);
                Observable.throw("");
            });
        return JSON.parse(response._body || []);
    }

    async fnGetDilyCarLogOnDemand(UserId, CarLogId, Type) {
        var url = ConfigService.baseWebApiUrl + '/GetDilyCarLogOnDemand?UserId=' + UserId + '&CarLogId=' + CarLogId + '&Type=' + Type;
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        var response: any;
        await this.http.get(url, '')
            .toPromise().then(result => response = result)
            .catch((ex: any) => {
                this.alertService.fnLoading(false);
                this.alertService.alert(response);
                Observable.throw("");
            });
        return JSON.parse(response._body || []);
    }

    async fnUpdateDilyCarLog(UserId, CarLogId, Type) {
        var url = ConfigService.baseWebApiUrl + '/UpdateDilyCarLog?UserId=' + UserId + '&CarLogId=' + CarLogId + '&AdditionalId=0&Type=' + Type;
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        var response: any;
        await this.http.get(url, '')
            .toPromise().then(result => response = result)
            .catch((ex: any) => {
                this.alertService.fnLoading(false);
                this.alertService.alert(response);
                Observable.throw("");
            });
        return (response);
    }


    //to get specific bus
    async fnGetDilyCarLog(UserId, CarLogId) {
        var url = ConfigService.baseWebApiUrl + '/GetDilyCarLog?UserId=' + UserId + '&CarLogId=' + CarLogId;
        //let options = new RequestOptions({ headers: this.getHeaders(), method: "get" });
        var response: any;
        await this.http.get(url, '')
            .toPromise().then(result => response = result)
            .catch((ex: any) => {
                this.alertService.fnLoading(false);
                this.alertService.alert(response);
                Observable.throw("");
            });
        return JSON.parse(response._body || []);
    }

    fnPostDailyCarLog(data: any) {
        var url = ConfigService.baseWebApiUrl + '/PostDailyCarLog';
        return this.http.post(url, data, '')
            .map((response: Response) => <any>(response));
    }

    fnPostDailyCarLogOnDemand(data: any, UserId: number, Type: string) {
        var url = ConfigService.baseWebApiUrl + '/PostDailyCarLogOnDemand?UserId=' + UserId + '&Type=' + Type;
        return this.http.post(url, data, "")
            .map((response: Response) => <any>(response));
    }

    fnDeleteCarLog(CarLogId: number) {
        var url = ConfigService.baseWebApiUrl + '/DeleteCarLog?CarLogId=' + CarLogId;
        return this.http.get(url, "")
            .map((response: Response) => (response));
    }

    //#endregion of daily log

    public getHeaders(): Headers {
        let headers = new Headers();
        headers.set("Access-Control-Allow-Origin", "*");
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        return headers;
    }

}