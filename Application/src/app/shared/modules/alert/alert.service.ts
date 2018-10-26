import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
@Injectable()
export class AlertService {
    private subject = new Subject<any>();
    private loadingFlag: boolean = false;
    constructor() { }
    confirm(message: string, siFn: () => void, noFn: () => void, type: string = 'confirm') {
        this.setConfirmation(message, siFn, noFn, type);
    }

    confirmAlert(message: string, siFn: () => void,  type: string = 'confirmAlert') {
        let noFn: () => void
        this.setConfirmation(message, siFn, noFn, type);
    }

    alertAutoTerminated(message: string, siFn: () => void = this.closeFn, noFn: () => void = this.closeFn, type: string = 'alert-terminated') {
        this.setConfirmation(message, siFn, noFn, type);
    }
    confirmAsync(message: string, siFn: () => Promise<any>, noFn: () => void, type: string = 'confirm') {
        this.setConfirmation(message, siFn, noFn, type);
    }
    
    alert(message: string, noFn: () => void = this.closeFn, type: string = 'alert') {
        this.setConfirmation(message, this.closeFn, noFn, type);
    }

    alertResponeCode(message: any, siFn: () => void = this.closeFn, noFn: () => void = this.closeFn, type: string = 'alert') {
        if(message.status==200){
            this.setConfirmation(message._body.replace(/"/g,''), siFn, noFn, type);
        }
       
    }
    fnLoading(flag: boolean) {
        if(flag){
            this.setConfirmation('true', null, null, "loading");
        }else{
            this.setConfirmation('false', null, null, "loading");
        }
        
    }
    closeFn=function(){

    };
    setConfirmation(message: string, siFn: () => void, noFn: () => void, type: string) {
        let that = this;
        this.subject.next({
            type: type,
            text: message,
            siFn:
                function () {
                    that.subject.next(); //this will close the modal
                    siFn();
                },
            noFn: function () {
                that.subject.next();
                noFn();
            }
        });

        if (type == "alert-terminated") {
            setTimeout(() => {
                this.subject.next();
            }, 3000);
        }

    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }

}