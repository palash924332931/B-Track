import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { AlertService } from '../../../shared/modules/alert/alert.service'
import { AdminService, CommonService, ConfigService } from '../../../shared/services'
import { POLUnitPrices } from '../../../shared/model/admin'
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pol-unit-price',
  templateUrl: './pol-unit-price.component.html',
  styleUrls: ['./pol-unit-price.component.scss'],
  animations: [routerTransition()]
})
export class PolUnitPriceComponent implements OnInit {
  public polUnitPrices: POLUnitPrices[] = [];
  public userId=1;
  public userInfo = JSON.parse(localStorage.getItem("car-system-user-info-option-b"));
  public LT:string=ConfigService.languageType;
  constructor(private alertService: AlertService, private adminService: AdminService,private router:Router) { }

  ngOnInit() {
    this.userId=this.userInfo[0].Id;
    this.fnGetPOLUnitPriceList();
  }

  fnGetPOLUnitPriceList() {
    this.alertService.fnLoading(true);
    this.adminService.fnGetUnitPrices(this.userId).subscribe(
      (data: POLUnitPrices[]) => {
        this.polUnitPrices = data || [];
        console.log(this.polUnitPrices);
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
      this.alertService.confirm(this.LT=='bn'?'আপনি কি <b>' + data.POLUnitPriceId +'</b> পিওএল তথ্যটি মুছে ফেলতে চান?':'Do you want to delete POL unit price recod <b>' + data.POLUnitPriceId + '</b>?',
        () => {
          this.adminService.fnDeleteRootCost(data.RootCostId).subscribe(
            (success: any) => {
              this.alertService.alert(success);
              this.fnGetPOLUnitPriceList();
            },
            (error: any) => {
              this.alertService.alert(this.LT=='bn'?'সিস্টেম তথ্য মুছে ফেলতে ব্যর্থ হয়েছে। অনুগ্রহপূর্বক আবার চেষ্টা করুন.':'System has failed to delete information. Please try again.');
            }
          );
        }
        , function () { })
    } else if (event.action == "edit-item") {
      this.alertService.confirm(this.LT=='bn'?'আপনি কি <b>' + data.POLUnitPriceId +'</b> পিওএল তথ্যটি সম্পাদনা করতে চান?':'Do you want to edit POL unit price recod <b>' + data.POLUnitPriceId + '</b> ?',
      () => {
        this.router.navigate(["./admin/pol-unit/"+data.POLUnitPriceId]);
      }
      , function () { })
    }
  }

  
  fnNew(){
    this.router.navigate(["./admin/pol-unit/0"]);
  }


  public rootCostListTableBind = {
    tableID: "messtage-history-table",
    tableClass: "table table-border ",
    tableName: this.LT=='bn'?'পিওএল আইটেমের একক মুল্যে':'POL Unit Price List',
    tableRowIDInternalName: "ID",
    tableColDef: [      
      //{ headerName: this.LT=='bn'?'প্রারম্ভিক স্থান':'Start Point', width: '15%', internalName: 'StartPoint', sort: true, type: "" },
      { headerName: this.LT=='bn'?'পিওএল আইডি':'POL ID', width: '8%', internalName: 'POLUnitPriceId', sort: true, type: "" },
      { headerName: this.LT=='bn'?'সিএনজির একক মুল্য ':'Unit Price of CNG', width: '12%', internalName: 'CNGUnitPrice', sort: true, type: "" },
      { headerName: this.LT=='bn'?'ডিজেলের একক মুল্য':'Unit Price of Diesel', width: '12%', internalName: 'DieselUnitPrice', sort: true, type: "" },
      { headerName: this.LT=='bn'?'ইঞ্জিন ওয়েলের একক মুল্য':'Unit Price of Power Oil', width: '12%', internalName: 'EngineOilUnitPrice', sort: true, type: "" },
      { headerName: this.LT=='bn'?'পাওয়ার ওয়েলের একক মুল্য':'Unit Price of Power Oil', width: '13%', internalName: 'PowerOilUnitPrice', sort: true, type: "" },
      { headerName: this.LT=='bn'?'গিয়ার ওয়েলের একক মুল্য':'Unit Price of Gear Oil', width: '13%', internalName: 'GearOilUnitPrice', sort: true, type: "" },
      { headerName: this.LT=='bn'?'গ্রীসের একক মুল্য':'Unit Price of Grease', width: '13%', internalName: 'GreaseUnitPrice', sort: true, type: "" },
      { headerName: this.LT=='bn'?'মন্তব্য':'Notes', width: '10%', internalName: 'Notes', sort: true, type: "" },
      { headerName: this.LT=='bn'?'অবস্থা':'Status', width: '10%', internalName: 'Status', sort: true, type: "" },   
    ],
    enabledSearch: true,
    pageSize: 15,
    enabledPagination: true,
    enabledEditBtn: true,
    enabledCellClick: true,
  };
}

