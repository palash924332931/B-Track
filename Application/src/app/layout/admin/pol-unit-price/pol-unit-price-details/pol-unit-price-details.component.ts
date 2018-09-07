import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../../router.animations';
import { AlertService } from '../../../../shared/modules/alert/alert.service'
import { AdminService, CommonService,CarService, ConfigService } from '../../../../shared/services'
import { POLUnitPrices } from '../../../../shared/model/admin'
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pol-unit-price-details',
  templateUrl: './pol-unit-price-details.component.html',
  styleUrls: ['./pol-unit-price-details.component.scss'],
  animations: [routerTransition()]
})
export class PolUnitPriceDetailsComponent implements OnInit {

  public pageTitle: string = "Product Registration";
  public polUnitPriceId: number;
  public LT:string=ConfigService.languageType;
  public IsEditItem: boolean = false;
  public polUnitPriceDetails = new POLUnitPrices();
  public UserInfo = JSON.parse(localStorage.getItem("car-system-user-info-option-b"));
  public userId = 1;
  private modalRef: NgbModalRef;
  public  closeResult: string;
  constructor(private adminService: AdminService,private carService:CarService, private configService:ConfigService, private alertService: AlertService, private router: Router, private route: ActivatedRoute,private modalService: NgbModal) { }

  ngOnInit() {
    this.userId=this.UserInfo[0].Id;
    this.polUnitPriceId = this.route.snapshot.params["polUnitPriceId"];
    console.log("this.polUnitPriceId",this.polUnitPriceId);
    if (this.polUnitPriceId > 0) {
      this.IsEditItem = true;
      this.fnGePolUnitPriceById();
    } else {
      this.IsEditItem = false;
    }
  }

  fnGePolUnitPriceById() {
    this.alertService.fnLoading(true);
    this.adminService.fnGetUnitPriceById(this.userId, this.polUnitPriceId).subscribe(
      (data: POLUnitPrices) => {
        console.log("data",data);
        console.log("data[0]",data[0]);
        this.polUnitPriceDetails = data||null;
        this.alertService.fnLoading(false);
      },
      (error: any) => {
        this.alertService.fnLoading(false);
        this.alertService.alert(this.LT=='bn'?'নেটওয়ার্ক সমস্যার কারণে সিস্টেম তথ্য দেখাতে ব্যর্থ হয়েছে।':'System has failed to show information.');
      }
    );
  }

  fnSavePolUnitPrice() {
    this.polUnitPriceDetails.CreatedBy = this.userId;
    this.polUnitPriceDetails.Updated =this.configService.getCurrentDate();  
    
     if ((this.polUnitPriceDetails.CNGUnitPrice == null || isNaN(this.polUnitPriceDetails.CNGUnitPrice))||(this.polUnitPriceDetails.DieselUnitPrice == null || isNaN(this.polUnitPriceDetails.DieselUnitPrice))) {
      this.alertService.alert(this.LT=='bn'?'দয়া করে টাকার পরিমাণ ইংরেজিতে লিখুন, তারপর তথ্য সংরক্ষন করুন।':'Information is required. Please review this field again.');
      return false;
    }


    if (!this.IsEditItem){
      this.polUnitPriceDetails.POLUnitPriceId = 0;
      this.polUnitPriceDetails.Created =this.configService.getCurrentDate();  
    }

    this.alertService.fnLoading(true);
 
    this.adminService.fnPostPolUnitPrice(this.polUnitPriceDetails).subscribe(
      (success: any) => {
        this.alertService.fnLoading(false);
        if(!this.IsEditItem){
          this.polUnitPriceDetails.POLUnitPriceId=success._body.replace(/"/g, "");
          this.IsEditItem=true;
        }
        this.alertService.confirm(this.LT=='bn'?'তথ্য সফল ভাবে সংরক্ষিত হয়েছে। আপনি কি পিওএল আইটেমের একক মুল্যের তালিকায় ফিরে যেতে চান?':'Information saved successfully. Do you want to back in POL unit price list?'
          , () => {
            this.router.navigate(["./admin/pol-unit"]);
          }
          , function () { });
      },
      (error: any) => {
        this.alertService.fnLoading(false);
        this.alertService.alert(this.LT=='bn'?'সিস্টেম তথ্য সংরক্ষণ করতে ব্যর্থ হয়েছে।':'System has failed to save information.');
      }
    );
  }


  fnCreateNewRecord() {
    this.IsEditItem = false;
    this.polUnitPriceDetails = new POLUnitPrices();
    this.polUnitPriceId = 0;
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
    // if (this.modalType == "Select Root") {
    //   this.rootCostDetails.RootId = event.record.RootId;
    //   this.rootCostDetails.RootName = event.record.RootName;
    // }else if("Select Bus Type"){
    //   this.rootCostDetails.Type = event.record.Type;
    //   this.rootCostDetails.CarTypeId = event.record.CarTypeId;
    // }
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
