import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { AlertService } from '../../../shared/modules/alert/alert.service'
import { AdminService, CommonService, ConfigService,AccountsService } from '../../../shared/services'
import { DatePipe } from '@angular/common';
import { Role } from '../../../shared/model/admin/role'
import { COA } from '../../../shared/model/accounts'
import { Router, ActivatedRoute } from '@angular/router';
import {  } from '../../../shared/model/accounts'

@Component({
  selector: 'app-chart-of-accounts',
  templateUrl: './chart-of-accounts.component.html',
  styleUrls: ['./chart-of-accounts.component.scss'],
  animations: [routerTransition()]
})
export class ChartOfAccountsComponent implements OnInit {

  public UserInfo = JSON.parse(localStorage.getItem("car-system-user-info-option-b"));
  public IsEditItem: boolean = false;

  public LT: string = ConfigService.languageType;
  public UserId = 1;
  public roleList: any[];
  public selectedRoleId: number;
  public selectedRoleName: string = "";
  public roleDetails = new Role();
  public menu = [];
  public CompanyId:number;
  constructor(private adminService: AdminService, private accountsService:AccountsService, private alertService: AlertService, private configService: ConfigService, private commonService: CommonService, private router:Router) {

  }

  ngOnInit() {
    this.UserId = this.UserInfo[0].Id;
    this.CompanyId=this.UserInfo[0].CompanyId;
    this.fnGetRole();
  }

  fnNewAccount(){
    this.router.navigate(["./accounts/coa/0"]);
  }


  fnChangeParent(event: any, menu: any) {
    console.log("this.menu", this.menu);
    console.log(event, menu);
    if (event.target.checked) {
      this.menu.forEach((rec: any) => {
        if (menu.MenuId == rec.MenuId) {
          rec.SubMenues.forEach((rc: any) => {
            rc.IsPermit = 1;
          });
        }
      });
    } else {
      this.menu.forEach((rec: any) => {
        if (menu.MenuId == rec.MenuId) {
          rec.SubMenues.forEach((rc: any) => {
            rc.IsPermit = 0;
          });
        }
      });
    }
  }

  fnGetRole() {
    this.IsEditItem = false;
    this.alertService.fnLoading(true);
    this.adminService.fnGetRoles(this.UserId).subscribe(
      (data: any[]) => {
        console.log(data);
        this.roleList = data || [];
        this.alertService.fnLoading(false);
        if (this.roleList.length > 0) {
          this.selectedRoleId = this.roleList[0].RoleId;
          this.selectedRoleName = this.roleList[0].Name;
          this.fnGetMenus();
        }
      },
      (error: any) => {
        this.alertService.fnLoading(false);
        this.alertService.alert(this.LT == 'bn' ? 'নেটওয়ার্ক সমস্যার কারণে সিস্টেম চুক্তি তালিকা প্রদর্শন করতে ব্যর্থ হয়েছে।' : 'System has failed to show agreement list because of network problem.');
      }
    );
  }

  onRoleSelected(RoleId: any) {
    this.roleList.forEach((rec: any) => {
      if (rec.RoleId == +RoleId) {
        this.selectedRoleId = rec.RoleId;
        this.selectedRoleName = rec.Name;
      }
    });

  }


  fnSearchRolePermission() {
    this.fnGetMenus();
  }

  fnSaveRolePermission() {
    let permittedList = [];
    this.menu.forEach((rec: any) => {
      rec.SubMenues.forEach((rc: any) => {
        if (rc.IsPermit == 1 || rc.IsPermit) {
          rc.IsPermit=1;
          permittedList.push(rc);
        }
      });
    });

    if (permittedList.length == 0) {
      this.alertService.alert("Please review your permission and try to save agina.");
      return false;
    }

    this.alertService.fnLoading(true);
    this.commonService.fnPostRolePermission(permittedList, this.selectedRoleId,this.UserId,this.CompanyId).subscribe(
      (success: any) => {
        this.alertService.fnLoading(false);
        this.alertService.alert(success._body.replace(/"/g, ""));
      },
      (error: any) => {
        this.alertService.fnLoading(false);
        this.alertService.alert(this.LT == 'bn' ? ' সিস্টেম তথ্য সংরক্ষণ করতে ব্যর্থ হয়েছে আবার চেষ্টা করুন।' : 'System has failed to save information.');
      }
    );

  }

  fnGetMenus() {
    this.menu=[];
    this.alertService.fnLoading(true);
    this.commonService.fnGetPermittedMenuRoleWise(this.selectedRoleId).subscribe(
      (data: any[]) => {
        data = data || [];
        let menuId = 0;
        data.forEach((rec: any) => {
          if (menuId != rec.MenuId) {
            menuId = rec.MenuId;
            this.menu.push({
              MenuId: rec.MenuId, MenuName: rec.MenuName, MenuTitle: rec.MenuTitle, MenuTitleBangla: rec.MenuTitleBangla, MenuIcon: rec.MenuIcon, SubMenues: data.filter((record: any) => {
                if (record.MenuId == rec.MenuId) {
                  return true;
                } else {
                  return false;
                }
              }) || []
            });
          }
        });
        this.alertService.fnLoading(false);

        console.log("d menu", this.menu);
      },
      (err: any) => {
        this.alertService.fnLoading(true);
      }
    )
  }


}