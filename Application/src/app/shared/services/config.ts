import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {


    //http://api.sandhi.co
    //public static readonly webApiHost: string = "option-b.com/API2";//'palas.a2hosted.com/API';
    public static readonly webApiHost: string = 'localhost:65432';
    public static readonly baseWebApiUrl: string = 'http://' + ConfigService.webApiHost + '/api';
    //public static readonly baseWebApiUrl: string = 'http://' + ConfigService.webApiHost +':'+ConfigService.webApiPort+ '/api';
    //public static readonly WebApiTokenPath: string = 'http://' + ConfigService.webApiHost + ':' + ConfigService.webApiPort + '/SITWebApi121/token';  

    public static getApiUrl(path: string) {
        return `${ConfigService.baseWebApiUrl}/${path}`;
    }

    public static clientFlag: boolean = true;

    public static readonly httpTimeout: number = 60000;

    public static readonly ErrorMessage: string = "Error - Application timed-out. ";

    public static getErrorMessage(messsage: string) {
        return `${ConfigService.ErrorMessage}/${messsage}`;
    }
    public static languageType: string = JSON.parse(localStorage.getItem("car-system-user-info-option-b")) == null ? 'bn' : JSON.parse(localStorage.getItem("car-system-user-info-option-b"))[0].Language;
    public static readonly idleTimeout: number = 300;
    public static readonly idleTimeWarning: number = 60;
    public getHeaders() {
        let headers = new Headers();
        headers.set("Access-Control-Allow-Origin", "*");
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        return headers;
    }

    public getCurrentDate(): string {
        var dt = new Date(),
            current_date = dt.getDate(),
            current_month = dt.getMonth() + 1,
            current_year = dt.getFullYear(),
            current_hrs = dt.getHours(),
            current_mins = dt.getMinutes(),
            current_secs = dt.getSeconds(),
            current_datetime;
        return current_year + '-' + current_month + '-' + current_date;
    }

    public fnFormatDate(dt): string {
        // var dt = new Date(),
        var current_date = dt.getDate(),
            current_month = dt.getMonth() + 1,
            current_year = dt.getFullYear(),
            current_hrs = dt.getHours(),
            current_mins = dt.getMinutes(),
            current_secs = dt.getSeconds(),
            current_datetime;
        return current_year + '-' + current_month + '-' + current_date;
    }
}