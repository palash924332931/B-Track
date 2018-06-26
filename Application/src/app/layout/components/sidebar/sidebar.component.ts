import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService, ConfigService } from '../../../shared/services'
import { AlertService } from '../../../shared/modules/alert/alert.service'

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
    isActive: boolean = false;
    showMenu: string = '';
    public UserInfo = JSON.parse(localStorage.getItem("car-system-user-info-option-b"));
    public userId = 1;
    public LT: string;
    constructor(private router: Router,private commonService:CommonService, private alertService:AlertService) { }
    eventCalled() {
        this.isActive = !this.isActive;
    }
    ngOnInit() {
        this.userId=this.UserInfo[0].Id;        
        if(this.userId==null|| this.userId==0){
            this.router.navigate(["./login"]);
        }
        this.fnGetMenus();
        this.LT= this.UserInfo[0].Language;
        let serviceName = this.router.url.split("/")[1];
        if (serviceName == 'car') {
            this.showMenu = 'car';
        } else if (serviceName == 'admin') {
            this.showMenu = 'admin';
        } else if (serviceName == 'accounts') {
            this.showMenu = 'accounts';
        } else if (serviceName == 'report') {
            this.showMenu = 'report';
        }else if (serviceName == 'manager') {
            this.showMenu = 'manager';
        }else {
            this.showMenu=null;
        }

        
    }

    addExpandClass(element: any) {
        if (element === this.showMenu) {
            this.showMenu = '0';
        } else {
            this.showMenu = element;
        }
    }

    public menu=[];
    fnGetMenus() {
        //this.alertService.confirm("");
        this.alertService.fnLoading(true);
        this.commonService.fnGetPermittedMenu(this.UserInfo[0].Id).subscribe(
            (data: any[]) => {
                data=data||[];
                let menuId=0;
                data.forEach((rec:any)=>{
                    if(menuId!=rec.MenuId){
                        menuId=rec.MenuId;
                        this.menu.push({MenuId:rec.MenuId,MenuName:rec.MenuName,MenuTitle:rec.MenuTitle,MenuTitleBangla:rec.MenuTitleBangla,MenuIcon:rec.MenuIcon,SubMenues:data.filter((record:any)=>{
                            if(record.MenuId==rec.MenuId){
                                return true;
                            }else {
                                return false;
                            }
                        })||[]
                        });
                    }
                });
                this.alertService.fnLoading(false);
            },
            (err: any) => {
                this.alertService.fnLoading(true);
            }
        )
    }
}
