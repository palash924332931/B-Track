import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { AlertService } from '../../../shared/modules/alert/alert.service'
import { AdminService, CommonService, ConfigService } from '../../../shared/services'
import { DatePipe } from '@angular/common';
import { Role } from '../../../shared/model/admin/role'
@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
  animations: [routerTransition()]
})
export class RoleComponent implements OnInit {
  public UserInfo = JSON.parse(localStorage.getItem("car-system-user-info-option-b"));
  public IsEditItem: boolean = false;

  public LT:string=ConfigService.languageType;
  public UserId = 1;
  public roleList: any[];
  public roleDetails = new Role();
  constructor(private adminService: AdminService, private alertService: AlertService, private configService:ConfigService) {

  }

  ngOnInit() {
    this.UserId=this.UserInfo[0].Id;
    this.fnGetRole();
  }

  fnGetRole() {
    this.IsEditItem = false;
    this.alertService.fnLoading(true);
    this.adminService.fnGetRoles(this.UserId).subscribe(
      (data: any[]) => {
        console.log(data);
        this.roleList = data || [];
        this.alertService.fnLoading(false);
      },
      (error: any) => {
        this.alertService.fnLoading(false);
        this.alertService.alert(this.LT=='bn'?'নেটওয়ার্ক সমস্যার কারণে সিস্টেম চুক্তি তালিকা প্রদর্শন করতে ব্যর্থ হয়েছে।':'System has failed to show agreement list because of network problem.');
      }
    );
  }

  fnAddRole() {
    this.alertService.fnLoading(true);
    if (this.roleDetails.Name == null || this.roleDetails.Name.trim() == "") {
      this.alertService.fnLoading(false);
      this.alertService.alert(this.LT=='bn'?'উপাধির নাম প্রয়োজন। অনুগ্রহপূর্বক আবার চেষ্টা করুন.':'Role name is required. Please try again.');
      return false;
    }


    var date = new Date();
    //let LastUpdate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let LastUpdate =this.configService.getCurrentDate();
    this.roleDetails.Update = LastUpdate;
    this.roleDetails.CreatedBy = this.UserId;

    if (this.IsEditItem != true) {
      this.roleDetails.RoleId = 0;

    } else if (this.IsEditItem == true) {
    }

    this.adminService.fnPostsRole(this.roleDetails).subscribe(
      (success: any) => {
        this.alertService.fnLoading(false);
        this.alertService.alert(success._body.replace(/"/g, ""),
          () => {
            this.fnGetRole();
          });
      },
      (error: any) => {
        this.alertService.fnLoading(false);
        this.alertService.alert(this.LT=='bn'?'সিস্টেম উপাধি তথ্য সংরক্ষণ করতে ব্যর্থ হয়েছে। অনুগ্রহপূর্বক আবার চেষ্টা করুন.':'System has failed to save role information. Please try again.');
      });

  }

  fnPtableCallBack(event: any) {
    var data = event.record;
    if (event.action == "delete-item") {
      this.alertService.confirm(this.LT=='bn'?'আপনি কি <b>' + data.Name + '</b> উপাধি মুছে ফেলতে চান ?':'Do you want to delete role <b>'  + data.Name + '</b>?',
        () => {//confirm click
          this.adminService.fnDeleteRole(data.RoleId).subscribe(
            (success: any) => {
              this.fnGetRole();
            },
            (error: any) => {
              this.alertService.alert(this.LT=='bn'?'উপাধি তথ্য মুছে ফেলতে সিস্টেম ব্যর্থ হয়েছে। অনুগ্রহপূর্বক আবার চেষ্টা করুন.':'System has failed to delete role information. Please try again.');
            }
          );
        },
        () => { });
    } else if (event.action == "edit-item") {
      this.IsEditItem = true;
      this.roleDetails = data || null;
    }

  }

  fnReadyForNewRecord() {
    this.IsEditItem = false;
    this.roleDetails = new Role();
  }
  public employeeRoleTableBind = {
    tableID: "messtage-history-table",
    tableClass: "table table-border ",
    tableName: this.LT=='bn'?'কর্মচারীর উপাধি তালিকা':'Employee Role List',
    tableRowIDInternalName: "ID",
    tableColDef: [
      { headerName: this.LT=='bn'?'উপাধির শিরোনাম':'Role Title ', width: '35%', internalName: 'Name', sort: true, type: "" },
      { headerName: this.LT=='bn'?'প্রস্তুতকারী':'Created By', width: '65%', internalName: 'CreatedByName', sort: true, type: "" },
    ],
    enabledSearch: true,
    pageSize: 10,
    enabledPagination: true,
    enabledEditBtn: true,
    enabledCellClick: true,
  };

}
