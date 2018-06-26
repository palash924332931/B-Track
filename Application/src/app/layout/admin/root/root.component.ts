import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { AlertService } from '../../../shared/modules/alert/alert.service'
import { AdminService, CommonService, ConfigService } from '../../../shared/services'
import { Root } from '../../../shared/model/admin'
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
  animations: [routerTransition()]
})
export class RootComponent implements OnInit {
  
  public LT:string=ConfigService.languageType;
  public rootList: Root[] = [];
  public userId=1;
  public UserInfo = JSON.parse(localStorage.getItem("car-system-user-info-option-b"));
  constructor(private alertService: AlertService, private adminService: AdminService,private router:Router) { }

  ngOnInit() {
    this.userId=this.UserInfo[0].Id;
    this.fnGetRoots();
  }
  fnGetRoots() {
    this.alertService.fnLoading(true);
    this.adminService.fnGetRoots(this.userId).subscribe(
      (data: Root[]) => {
        this.rootList = data || [];
        this.alertService.fnLoading(false);
      },
      (error: any) => {
        this.alertService.fnLoading(false);
        this.alertService.alert(this.LT=='bn'?'নেটওয়ার্ক সমস্যার কারণে সিস্টেমটি রুট তালিকা দেখাতে ব্যর্থ হয়েছে।':'System has failed to show root list because of network problem.');
      }
    );
  }

  fnPtableCallBack(event: any) {
    let data = event.record;
    if (event.action == "delete-item") {
      this.alertService.confirm(this.LT=='bn'?'আপনি কি রুট <b>'+data.RootName+'</b> মুছে ফেলতে চান? <b>':'Do you want to delete root <b>' + data.RootName + "</b>?",
        () => {
          this.adminService.fnDeleteRoot(data.RootId).subscribe(
            (success: any) => {
              this.alertService.alert(success);
              this.fnGetRoots();
            },
            (error: any) => {
              this.alertService.alert(this.LT=='bn'?'সিস্টেম পণ্যের তথ্য মুছে ফেলতে ব্যর্থ হয়েছে । অনুগ্রহপূর্বক আবার চেষ্টা করুন । ':'System has failed to delete product information. Please try again.');
            }
          );
        }
        , function () { })
    } else if (event.action == "edit-item") {
      this.alertService.confirm(this.LT=='bn'?'আপনি রুট <b>'+data.RootName+'</b> সম্পাদনা করতে চান?':'Do you want to edit root <b>' + data.RootName + '</b>?',
      () => {
        this.router.navigate(["./admin/root/"+data.RootId]);
      }
      , function () { })
    }
  }

  
  fnNewRoot(){
    this.router.navigate(["./admin/root/0"]);
  }


  public rootListTableBind = {
    tableID: "messtage-history-table",
    tableClass: "table table-border ",
    tableName: this.LT=='bn'?'রুটের তালিকা':'Route List',
    tableRowIDInternalName: "ID",
    tableColDef: [
      { headerName: this.LT=='bn'?'রুটের নাম':'Route Name', width: '15%', internalName: 'RootName', sort: true, type: "" },
      { headerName: this.LT=='bn'?'প্রারম্ভিক স্থান':'Start Point', width: '12%', internalName: 'StartPoint', sort: true, type: "" },
      { headerName: this.LT=='bn'?'শেষপ্রান্ত':'End Point', width: '12%', internalName: 'EndPoint', sort: true, type: "" },
      { headerName: this.LT=='bn'?'দূরত্ব(কি. মি.)':'Distance(km)', width: '12%', internalName: 'Distance', sort: true, type: "" },
      { headerName: this.LT=='bn'?'টার্গেট ট্রিপ':'Target Trip', width: '10%', internalName: 'TargetTrip', sort: true, type: "" },
      { headerName: this.LT=='bn'?'মন্তব্য':'Notes', width: '15%', internalName: 'Notes', sort: true, type: "" },
      { headerName: this.LT=='bn'?'প্রস্তুতকারী':'Created By', width: '10%', internalName: 'CreatedByName', sort: true, type: "" },
      { headerName: this.LT=='bn'?'অবস্থা':'Status', width: '10%', internalName: 'Status', sort: true, type: "" },
    ],
    enabledSearch: true,
    pageSize: 10,
    enabledPagination: true,
    enabledEditBtn: true,
    enabledCellClick: true,
  };

}
