import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { LoginService } from '../shared/services/login.service'
import { AlertService } from '../shared/modules/alert/alert.service'
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
    constructor(public router: Router, private loginService: LoginService, private alertService: AlertService) { }
    public userName: string;
    public password: string;
    public errorMessage: string;
    public imageFile= 2;
    public companyId = 0;
    public backgroundImageUrl = '../assets/images/1.jpg';
    ngOnInit() {
        localStorage.removeItem('car-system-user-info-option-b');
        localStorage.removeItem('isLoggedin');
        this.startTimer();
    }

    private onKeyPress(event: any){
        if (event.which == 13 || event.keyCode == 13) { // Check if "Enter" key pressed
            this.onLoggedin();
        }
    }

    private startTimer() {
        const timer = Observable.timer(1, 15000);
        let sub = timer.subscribe(
            t => {
                if (this.imageFile < 4) {
                    this.imageFile = this.imageFile + 1;
                    this.backgroundImageUrl = "../assets/images/" + this.imageFile + ".jpg";
                } else {
                    this.imageFile = 1;
                    this.backgroundImageUrl = '../assets/images/1.jpg';
                }
            }
        );
    }

    onLoggedin() {
        this.alertService.fnLoading(true);
        if (this.companyId == 0 || this.companyId == null) {
            this.errorMessage = "Please select depot name and try agian.";
            this.alertService.fnLoading(false);
        } 
       else if (this.userName == "" || this.userName == null) {
            this.errorMessage = "Your UserID is missing. Please try again.";
            this.alertService.fnLoading(false);
        } else if (this.password == "" || this.password == null) {
            this.errorMessage = "Your password is missing. Please try again.";
            this.alertService.fnLoading(false);
        } else {
            /********************************************************
            let data1=JSON.stringify({UserID:"12345",Password:"123455"});
            localStorage.setItem('sandhi-user-info', data1);
            localStorage.setItem('isLoggedin', 'true');
            this.router.navigate(["/dashboard"]);
            /******************************************/
            let data = { UserID: this.userName, Password: this.password,CompanyId:this.companyId };
            this.loginService.fnLogin1(data).subscribe(
                (data: any) => {
                    let successResult = data || null;
                    if (successResult != null) {
                        this.errorMessage = "";
                        this.alertService.fnLoading(false);
                        data[0].Language="bn";
                        localStorage.setItem('car-system-user-info-option-b', JSON.stringify(data));
                        localStorage.setItem('isLoggedin', 'true');
                        this.router.navigate(["/dashboard"]);
                    } else {
                        this.errorMessage = "Invalid UserID and Password. Please try again with correct information.";
                        this.alertService.fnLoading(false);
                    }

                },
                (error: any) => {
                    this.errorMessage = "Please contact with admin.";
                    this.alertService.fnLoading(false);
                }
            );

        }
    }
}

