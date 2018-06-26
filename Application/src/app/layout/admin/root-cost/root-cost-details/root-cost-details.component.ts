import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../../router.animations';
import { AlertService } from '../../../../shared/modules/alert/alert.service'
import { AdminService, CommonService,CarService, ConfigService } from '../../../../shared/services'
import { RootCost } from '../../../../shared/model/admin'
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-root-cost-details',
  templateUrl: './root-cost-details.component.html',
  styleUrls: ['./root-cost-details.component.scss'],
  animations: [routerTransition()]
})
export class RootCostDetailsComponent implements OnInit {

  public pageTitle: string = "Product Registration";
  public rootCostId: number;
  public LT:string=ConfigService.languageType;
  public IsEditItem: boolean = false;
  public rootCostDetails = new RootCost();
  public UserInfo = JSON.parse(localStorage.getItem("car-system-user-info-option-b"));
  public userId = 1;
  private modalRef: NgbModalRef;
  public  closeResult: string;
  constructor(private adminService: AdminService,private carService:CarService, private configService:ConfigService, private alertService: AlertService, private router: Router, private route: ActivatedRoute,private modalService: NgbModal) { }

  ngOnInit() {
    this.userId=this.UserInfo[0].Id;
    this.rootCostId = this.route.snapshot.params["rootCostId"];
    if (this.rootCostId > 0) {
      this.IsEditItem = true;
      this.fnGetRootCostDetails();
    } else {
      this.IsEditItem = false;
    }
  }

  fnGetRootCostDetails() {
    this.alertService.fnLoading(true);
    this.adminService.fnGetRootCost(this.userId, this.rootCostId).subscribe(
      (data: RootCost[]) => {
        this.rootCostDetails = data[0];
        this.alertService.fnLoading(false);
      },
      (error: any) => {
        this.alertService.fnLoading(false);
        this.alertService.alert(this.LT=='bn'?'নেটওয়ার্ক সমস্যার কারণে সিস্টেম পণ্য দেখাতে ব্যর্থ হয়েছে।':'System has failed to show product because of network problem.');
      }
    );
  }

  fnSaveProduct() {

    this.rootCostDetails.CreatedBy = this.userId;
    //this.rootCostDetails.Update = new Date().toISOString().slice(0, 19).replace('T', ' ');
    this.rootCostDetails.Update =this.configService.getCurrentDate();
    if (this.rootCostDetails.RootName == null || this.rootCostDetails.RootName == "") {
      this.alertService.alert(this.LT=='bn'?'দয়া করে রুটের নামটি পছন্দ করুন, তারপর তথ্য সংরক্ষন করুন।':'Route Name is required. Please review this field again.');
      return false;
    }else if (this.rootCostDetails.Type == null || this.rootCostDetails.Type == "") {
      this.alertService.alert(this.LT=='bn'?'দয়া করে গাড়ীর ধরন পছন্দ করুন, তারপর তথ্য সংরক্ষন করুন।':'Bus type is required. Please review this field again.');
      return false;
    }else if (this.rootCostDetails.FirstTripIncome == null || isNaN(this.rootCostDetails.FirstTripIncome)) {
      this.alertService.alert(this.LT=='bn'?'দয়া করে প্রথম ট্রিপের উপার্জন ইংরেজিতে লিখুন, তারপর তথ্য সংরক্ষন করুন।':'Route income of first trip is required. Please review this field again.');
      return false;
    }else if (this.rootCostDetails.SecondTripIncome == null || isNaN(this.rootCostDetails.SecondTripIncome)) {
      this.alertService.alert(this.LT=='bn'?'দয়া করে দ্বিতীয় ট্রিপের উপার্জন ইংরেজিতে লিখুন, তারপর তথ্য সংরক্ষন করুন।':'Route income of second trip is required. Please review this field again.');
      return false;
    }else if (this.rootCostDetails.ThirdTripIncome == null || isNaN(this.rootCostDetails.ThirdTripIncome)) {
      this.alertService.alert(this.LT=='bn'?'দয়া করে তৃতীয় ট্রিপের উপার্জন ইংরেজিতে লিখুন, তারপর তথ্য সংরক্ষন করুন।':'Route income of third trip is required. Please review this field again.');
      return false;
    }else if (this.rootCostDetails.UnFirstTripIncome == null || isNaN(this.rootCostDetails.UnFirstTripIncome)) {
      this.alertService.alert(this.LT=='bn'?'দয়া করে ছুটির দিনে প্রথম ট্রিপের উপার্জন ইংরেজিতে লিখুন, তারপর তথ্য সংরক্ষন করুন।':'Unofficial Route income of first trip is required. Please review this field again.');
      return false;
    }else if (this.rootCostDetails.UnSecondTripIncome == null || isNaN(this.rootCostDetails.UnSecondTripIncome)) {
      this.alertService.alert(this.LT=='bn'?'দয়া করে ছুটির দিনে দ্বিতীয় ট্রিপের উপার্জন ইংরেজিতে লিখুন, তারপর তথ্য সংরক্ষন করুন।':'Unofficial Route incoem of second trip is required. Please review this field again.');
      return false;
    }else if (this.rootCostDetails.UnThirdTripIncome == null || isNaN(this.rootCostDetails.UnThirdTripIncome)) {
      this.alertService.alert(this.LT=='bn'?'দয়া করে ছুটির দিনে তৃতীয় ট্রিপের উপার্জন ইংরেজিতে লিখুন, তারপর তথ্য সংরক্ষন করুন।':'Unofficial Route incoem of third trip is required. Please review this field again.');
      return false;
    }


    if (this.IsEditItem) {
      this.alertService.fnLoading(true);
    } else {
      this.alertService.fnLoading(true);
      this.rootCostDetails.RootCostId = 0;
    }

    this.adminService.fnPostRootCost(this.rootCostDetails).subscribe(
      (success: any) => {
        this.alertService.fnLoading(false);
        this.alertService.confirm(this.LT=='bn'?success._body.replace(/"/g, "") + ' আপনি কি রুটের উপার্জন তালিকায় ফিরে যেতে চান?':success._body.replace(/"/g, "") + ' Do you want to back in route income list?'
          , () => {
            this.router.navigate(["./admin/root-cost"]);
          }
          , function () { });
      },
      (error: any) => {
        this.alertService.fnLoading(false);
        this.alertService.alert(this.LT=='bn'?'সিস্টেম রুটের উপার্জনের তথ্য সংরক্ষণ করতে ব্যর্থ হয়েছে।':'System has failed to save route income information.');
      }
    );
  }


  fnCreateNewProduct() {
    this.IsEditItem = false;
    this.rootCostDetails = new RootCost();
    this.rootCostId = 0;
  }


  public modalType: string;
  configureableModalData: any[] = [];
  fnGenerateModal(content, actionName: string) {
    this.alertService.fnLoading(true)
    this.modalType = actionName;
    //generate modal
    if (this.modalType == "Select Root") {
      this.configureableModalTable.tableName=this.LT=='bn'?'তালিকা থেকে রুট নির্বাচন করুন':'Select Route From List';
      this.configureableModalTable.tableColDef= [
        { headerName: this.LT=='bn'?'রুটের নাম':'Route Name ', width: '25%', internalName: 'RootName', sort: true, type: "" },
        { headerName: this.LT=='bn'?'প্রারম্ভিক স্থান':'Start Point', width: '25%', internalName: 'StartPoint', sort: true, type: "" },
        { headerName: this.LT=='bn'?'শেষপ্রান্ত':'End Point', width: '25%', internalName: 'EndPoint', sort: true, type: "" },
        { headerName: this.LT=='bn'?'দূরত্ব(কি. মি.)':'Distance (km)', width: '25%', internalName: 'Distance', sort: true, type: "" },
      ]

      this.adminService.fnGetRoots(this.userId).subscribe((data: any) => {
        console.log("data", data);
        this.alertService.fnLoading(false)
        this.configureableModalData = data || [];

        this.modalRef = this.modalService.open(content);
        this.modalRef.result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      });
    }
    else if(this.modalType=="Select Bus Type"){
      this.configureableModalTable.tableName=this.LT=='bn'?'গাড়ি নির্বাচন করুন':'Select Bus Type';
      this.configureableModalTable.tableColDef= [
        { headerName: this.LT=='bn'?'গাড়ির ধরণ':'Bus Type ', width: '25%', internalName: 'Type', sort: true, type: "" },
        { headerName: this.LT=='bn'?'বিবরণ':'Description', width: '25%', internalName: 'Description', sort: true, type: "" },
        { headerName: this.LT=='bn'?'অবস্থা':'Status', width: '25%', internalName: 'Status', sort: true, type: "" },
      ]

      this.carService.fnGetCarTypes(this.userId).then((data: any) => {
        console.log("data", data);
        this.alertService.fnLoading(false)
        this.configureableModalData = data || [];

        this.modalRef = this.modalService.open(content);
        this.modalRef.result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      });
    }
  }


  fnPtableModalCallBack(event: any) {
    console.log("event", event);
    if (this.modalType == "Select Root") {
      this.rootCostDetails.RootId = event.record.RootId;
      this.rootCostDetails.RootName = event.record.RootName;
    }else if("Select Bus Type"){
      this.rootCostDetails.Type = event.record.Type;
      this.rootCostDetails.CarTypeId = event.record.CarTypeId;
    }
    this.modalRef.close();
  }

  public configureableModalTable = {
    tableID: "messtage-history-table",
    tableClass: "table table-border ",
    tableName: this.LT=='bn'?'কর্মচারীর  পদবি নির্বাচন করুন':'Select Employee Role',
    tableRowIDInternalName: "ID",
    tableColDef: [
      { headerName: this.LT=='bn'?'পদবি':'Role Title ', width: '40%', internalName: 'Name', sort: true, type: "" },
      { headerName: this.LT=='bn'?'প্রস্তুতকারী':'Created By', width: '45%', internalName: 'CreatedByName', sort: true, type: "" },
    ],
    enabledSearch: true,
    pageSize: 10,
    enabledPagination: false,
    enabledRadioBtn: true,
    enabledAutoScrolled: true,
    enabledCellClick: true,
    pTableStyle: {
      tableOverflowY: true,
      overflowContentHeight: '460px'
    }
  };
}
