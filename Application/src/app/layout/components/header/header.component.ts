import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonService, ConfigService } from '../../../shared/services'
import { AlertService } from '../../../shared/modules/alert/alert.service'

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    pushRightClass: string = 'push-right';
    IsSelectedLanguageBangla: boolean = true;
    public UserInfo: any = JSON.parse(localStorage.getItem("car-system-user-info-option-b"));
    constructor(public router: Router, private commonService: CommonService, private alertService: AlertService) {
        this.router.events.subscribe(val => {
            if (
                val instanceof NavigationEnd &&
                window.innerWidth <= 992 &&
                this.isToggled()
            ) {
                this.toggleSidebar();
            }
        });
    }

    ngOnInit() {
        this.IsSelectedLanguageBangla = this.UserInfo[0].Language == 'en' ? false : true;
        // console.log("UserInfo", this.UserInfo);
        // console.log("UserInfo", this.UserInfo[0].Name);
    }

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    rltAndLtr() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
    }

    onLoggedout() {
        localStorage.removeItem('isLoggedin');
    }

    fnChangeSystemLanguage(event: any) {
        //this.alertService.confirm("");
        this.alertService.fnLoading(true);
        ConfigService.languageType = event.target.checked == true ? 'bn' : 'en';
        this.UserInfo[0].Language = event.target.checked == true ? 'bn' : 'en';
        localStorage.removeItem('car-system-user-info-option-b');
        localStorage.setItem('car-system-user-info-option-b', JSON.stringify(this.UserInfo));
        this.commonService.fnUpdateUserData(this.UserInfo[0].Id, ConfigService.languageType, 'Update language').subscribe(
            (rec: any) => {
                this.alertService.fnLoading(false);
                //this.router.navigate(["./dashboard"]);
                location.reload();
            },
            (err: any) => {
                this.alertService.fnLoading(true);
            }
        )
    }
}
