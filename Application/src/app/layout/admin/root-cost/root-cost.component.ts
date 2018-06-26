import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { AlertService } from '../../../shared/modules/alert/alert.service'
import { AdminService, CommonService, ConfigService } from '../../../shared/services'
import { RootCost } from '../../../shared/model/admin'
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root-cost',
  templateUrl: './root-cost.component.html',
  styleUrls: ['./root-cost.component.scss'],
  animations: [routerTransition()]
})
export class RootCostComponent implements OnInit {
  public rootCostList: RootCost[] = [];
  public userId=1;
  public UserInfo = JSON.parse(localStorage.getItem("car-system-user-info-option-b"));
  public LT:string=ConfigService.languageType;
  constructor(private alertService: AlertService, private adminService: AdminService,private router:Router) { }

  ngOnInit() {
    this.userId=this.UserInfo[0].Id;
    this.fnGetRootCostList();
  }

  fnGetRootCostList() {
    this.alertService.fnLoading(true);
    this.adminService.fnGetRootCostAll(this.userId).subscribe(
      (data: RootCost[]) => {
        this.rootCostList = data || [];
        this.alertService.fnLoading(false);
      },
      (error: any) => {
        this.alertService.fnLoading(false);
        this.alertService.alert(this.LT=='bn'?'নেটওয়ার্ক সমস্যাটির কারণে সিস্টেম মূল মূল্য তালিকা দেখাতে ব্যর্থ হয়েছে।':'System has failed to show root cost list because of network problem.');
      }
    );
  }

  fnPtableCallBack(event: any) {
    let data = event.record;
    if (event.action == "delete-item") {
      this.alertService.confirm(this.LT=='bn'?'আপনি কি <b>' + data.RootName +'</b> রুটটি মুছে ফেলতে চান?':'Do you want to delete Root <b>' + data.RootName + '</b>?',
        () => {
          this.adminService.fnDeleteRootCost(data.RootCostId).subscribe(
            (success: any) => {
              this.alertService.alert(success);
              this.fnGetRootCostList();
            },
            (error: any) => {
              this.alertService.alert(this.LT=='bn'?'সিস্টেম রুট খরচের তথ্য মুছে ফেলতে ব্যর্থ হয়েছে। অনুগ্রহপূর্বক আবার চেষ্টা করুন.':'System has failed to delete root cost information. Please try again.');
            }
          );
        }
        , function () { })
    } else if (event.action == "edit-item") {
      this.alertService.confirm(this.LT=='bn'?'আপনি কি <b>' + data.RootName +'</b> রুটটি সম্পাদনা করতে চান?':'Do you want to edit root <b>' + data.RootName + '</b> ?',
      () => {
        this.router.navigate(["./admin/root-cost/"+data.RootCostId]);
      }
      , function () { })
    }
  }

  
  fnNewRoot(){
    this.router.navigate(["./admin/root-cost/0"]);
  }


  public rootCostListTableBind = {
    tableID: "messtage-history-table",
    tableClass: "table table-border ",
    tableName: this.LT=='bn'?'রুটে আয়ের তালিকা':'Route Income List',
    tableRowIDInternalName: "ID",
    tableColDef: [
      { headerName: this.LT=='bn'?'রুটের নাম':'Route Name ', width: '15%', internalName: 'RootName', sort: true, type: "" },
      //{ headerName: this.LT=='bn'?'প্রারম্ভিক স্থান':'Start Point', width: '15%', internalName: 'StartPoint', sort: true, type: "" },
      //{ headerName: this.LT=='bn'?'শেষপ্রান্ত':'End Point', width: '15%', internalName: 'EndPoint', sort: true, type: "" },
      { headerName: this.LT=='bn'?'গাড়ির ধরন':'Bus Type', width: '10%', internalName: 'Type', sort: true, type: "" },
      { headerName: this.LT=='bn'?'দূরত্ব(কি. মি.)':'Distance (km)', width: '10%', internalName: 'Distance', sort: true, type: "" },
      { headerName: this.LT=='bn'?'প্রথম ট্রিপের উপার্জন':'First Trip Income(TK)', width: '10%', internalName: 'FirstTripIncome', sort: true, type: "" },
      { headerName: this.LT=='bn'?'দ্বিতীয় ট্রিপের উপার্জন':'Second Trip Income(TK)', width: '10%', internalName: 'SecondTripIncome', sort: true, type: "" },
      { headerName: this.LT=='bn'?'তৃতীয় ট্রিপের উপার্জন':'Third Trip Income(TK)', width: '10%', internalName: 'ThirdTripIncome', sort: true, type: "" },
      { headerName: this.LT=='bn'?'ছুটির দিনে প্রথম ট্রিপের উপার্জন':'UnOfficial First Trip Income(TK)', width: '10%', internalName: 'UnFirstTripIncome', sort: true, type: "" },
      { headerName: this.LT=='bn'?'ছুটির দিনে দ্বিতীয় ট্রিপের উপার্জন':'UnOfficial Second Trip Income(TK)', width: '10%', internalName: 'UnSecondTripIncome', sort: true, type: "" },
      { headerName: this.LT=='bn'?'ছুটির দিনে তৃতীয় ট্রিপের উপার্জন':'UnOfficial Third Trip Income(TK)', width: '10%', internalName: 'UnThirdTripIncome', sort: true, type: "" },

     
     // { headerName: this.LT=='bn'?'যিনি তৈরী করেছেন':'Created By', width: '10%', internalName: 'CreatedByName', sort: true, type: "" },
      { headerName: this.LT=='bn'?'অবস্থা':'Status', width: '15%', internalName: 'Status', sort: true, type: "" },
    ],
    enabledSearch: true,
    pageSize: 15,
    enabledPagination: true,
    enabledEditBtn: true,
    enabledCellClick: true,
  };
}
