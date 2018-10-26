import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../../router.animations';
import { AlertService } from '../../../../shared/modules/alert/alert.service'
import { AdminService, CarService, CommonService, ConfigService, CustomNgbDateParserFormatter, StoreService } from '../../../../shared/services'
import { PartsDetails, StoreInfo, Job } from '../../../../shared/model/store'
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, NgbModalRef, ModalDismissReasons, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss'],
  providers: [CustomNgbDateParserFormatter],
  animations: [routerTransition()]
})
export class ItemDetailsComponent implements OnInit {
  public LT: string = ConfigService.languageType;
  public IsEdit: boolean = false;
  public UserInfo = JSON.parse(localStorage.getItem("car-system-user-info-option-b"));
  public userId = 1;
  public purchasDate = null;
  public itemDetails: PartsDetails = new PartsDetails();
  public StoreInfo = new StoreInfo();
  private modalRef: NgbModalRef;
  public modalType: string;
  public closeResult: string;
  public configureableModalData: any[] = [];
  constructor(private adminService: AdminService, private configService: ConfigService, private alertService: AlertService, private router: Router, private route: ActivatedRoute, private storeService: StoreService, private customNgbDateParserFormatter: CustomNgbDateParserFormatter, private ngbDateParserFormatter: NgbDateParserFormatter, private modalService: NgbModal, public carService: CarService) { }

  ngOnInit() {
    this.userId = this.UserInfo[0].Id;
    let date2 = this.configService.getCurrentDate();
    let dateTime = new Date();
    this.purchasDate = this.customNgbDateParserFormatter.parse(date2 || null);
    let partsId=0;
    if (partsId > 0) {
      this.IsEdit = true;
    } else {
      this.StoreInfo.PurchaseDate = this.ngbDateParserFormatter.format(this.purchasDate);
      this.IsEdit = false;
    }
  }

  fnSaveitemDetails() {
    this.itemDetails.Created= this.configService.getCurrentDate();  
    this.itemDetails.CreatedBy=this.userId;
    this.itemDetails.Status="Active";
    this.StoreInfo.Status="Active";
    this.itemDetails.StoreInfoes = [this.StoreInfo]||null;
    this.alertService.fnLoading(true);
    this.storeService.fnPostPartsDetails(this.itemDetails).subscribe(
      (success: any) => {
        this.alertService.fnLoading(false);
        this.alertService.confirm(this.LT == 'bn' ? success._body.replace(/"/g, "") + ' আপনি কি যন্ত্রাংশের তালিকায় ফিরে যেতে চান?' : success._body.replace(/"/g, "") + ' Do you want to back in Parts list?'
          , () => {
            this.router.navigate(["./store/items"]);
          }
          , function () { });
      },
      (error: any) => {
        debugger;
        this.alertService.fnLoading(false);
        this.alertService.alert(error._body);
      }
    );
  }

  fnCreateNewItem() {
    this.IsEdit = false;
    this.itemDetails = new PartsDetails();
    this.itemDetails.PartsId = 0;
    this.StoreInfo=new StoreInfo();
  }

  onSelectPurchaseDate(date: any) {
    if (date != null) {
      this.StoreInfo.PurchaseDate = this.ngbDateParserFormatter.format(date);
    } else {
      this.StoreInfo.PurchaseDate = null;
    }
  }
 

  fnPtableCallBack(event: any) {
    let data = event.record;
    if (event.action == "delete-item") {
      this.alertService.confirm(this.LT == 'bn' ? 'আপনি কি <b>' + data.RegistrationNo + '</b> বাসের তথ্য মুছে ফেলতে চান? ' : 'Do you want to delete bus which registration no <b>' + data.RegistrationNo + "</b>?",
        () => {
          this.alertService.fnLoading(true);
          // this.carService.fnDeleteBus(data.CarId).subscribe(
          //   (success: any) => {
          //     this.alertService.fnLoading(false);
          //     this.fnGetVendors();             
          //   },
          //   (error: any) => {
          //     this.alertService.fnLoading(false);
          //     this.alertService.alert(this.LT == 'bn' ? 'সিস্টেম কর্মচারী তথ্য মুছে ফেলতে ব্যর্থ হয়েছে। অনুগ্রহপূর্বক আবার চেষ্টা করুন.' : 'System has failed to delete employee information. Please try again.');
          //   }
          // );
        }
        , function () { })
    } else if (event.action == "edit-item") {
      this.alertService.confirm(this.LT == 'bn' ? 'আপনি কি <b>' + data.RegistrationNo + '</b> বাস সম্পাদনা করতে চান?' : 'Do you want to edit information of bus <b>' + data.RegistrationNo + "</b>?",
        () => {
          this.router.navigate(["./car/car-list/" + data.CarId]);
        }
        , function () { })
    }
  }
  public jobItemList: any[] = [];

  fnGenerateModal(content, actionName: string) {
    this.alertService.fnLoading(true)
    this.modalType = actionName;
    //generate modal
    if (this.modalType == "bus-list") {
      this.configureableModalTable.tableName = this.LT == 'bn' ? 'গাড়ি নির্বাচন করুন' : 'Select Bus from the list.';
      this.configureableModalTable.tableColDef = [
        { headerName: this.LT == 'bn' ? 'নিবন্ধন নম্বর' : 'Registration No ', width: '25%', internalName: 'RegistrationNo', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'গাড়ির ধরণ' : 'Bus Type ', width: '25%', internalName: 'Type', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'বিবরণ' : 'Description', width: '25%', internalName: 'Description', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'অবস্থা' : 'Status', width: '25%', internalName: 'Status', sort: true, type: "" },
      ]

      this.carService.fnGetBuses(this.userId).then((data: any) => {
        console.log("data", data);
        this.alertService.fnLoading(false);
        data = data.filter((rc: any) => { if (rc.Status == 'Active') { return true; } else { return false; } }) || [];
        this.configureableModalData = data || [];

        this.modalRef = this.modalService.open(content, { size: 'lg' });
        this.modalRef.result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.alertService.fnLoading(false);
        });
      });
    }
    else if (this.modalType == "Select Parts") {
      this.configureableModalTable.tableName = this.LT == 'bn' ? 'যন্ত্রাংশের তালিকা' : 'Parts List.';
      this.configureableModalTable.tableColDef = [
        { headerName: this.LT == 'bn' ? 'যন্ত্রাংশের নাম' : 'Parts Name ', width: '20%', internalName: 'PartsName', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'যন্ত্রাংশের কোড' : 'Parts Code ', width: '15%', internalName: 'PartsCode', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'যন্ত্রাংশের ধরন ' : 'Parts Size ', width: '15%', internalName: 'PartsSize', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'একক মুল্য ' : 'Unit Price ', width: '20%', internalName: 'UnitPrice', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'ব্যবহারযোগ্য পরিমাণ' : 'Available Amount', width: '15%', internalName: 'Balance', sort: true, type: "" },
      ]

      this.storeService.fnGetPatsList(this.userId).subscribe((data: any) => {
        console.log("data", data);
        this.alertService.fnLoading(false)
        this.configureableModalData = data || [];
        this.currentPartsList = data || [];

        this.modalRef = this.modalService.open(content, { size: 'lg', backdrop: 'static' });
        this.modalRef.result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      }, (error: any) => {
        this.alertService.fnLoading(false);
      });
    }
    else if (this.modalType == "Select Employee List" || this.modalType == "Select Employee checkedOut" || this.modalType == "Select Assigned Mechanic") {
      this.configureableModalTable.tableName = this.LT == 'bn' ? 'সূচনাকারী নির্বাচন করুন' : 'Select Job Creator.';
      this.configureableModalTable.tableColDef = [
        { headerName: this.LT == 'bn' ? 'কর্মচারীর আইডি' : 'Employee Id ', width: '25%', internalName: 'EmployeeId', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'নাম ' : 'Name ', width: '25%', internalName: 'Name', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'পদবী' : 'Phone Number', width: '25%', internalName: 'RoleName', sort: true, type: "" },
      ]

      this.adminService.fnGetEmployees(this.userId).subscribe((data: any) => {
        console.log("data", data);
        this.alertService.fnLoading(false)
        this.configureableModalData = data || [];

        this.modalRef = this.modalService.open(content);
        this.modalRef.result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      }, (error: any) => {
        this.alertService.fnLoading(false);
      });
    } else if (this.modalType == "Select Car Type") {
      this.configureableModalTable.tableName = this.LT == 'bn' ? 'গাড়ির প্রকার নির্বাচন করুন' : 'Select Bus Type',
        this.configureableModalTable.tableColDef = [
          { headerName: this.LT == 'bn' ? 'গাড়ির ধরন' : 'Car Type', width: '40%', internalName: 'Type', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'বিবরণ' : 'Description', width: '45%', internalName: 'Description', sort: true, type: "" },
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
      }, (error: any) => {
        this.alertService.fnLoading(false);
      });
    } else if (this.modalType == "Select Vendor Information") {
      this.configureableModalTable.tableName = this.LT == 'bn' ? 'গাড়ির প্রকার নির্বাচন করুন' : 'Select Bus Type',
        this.configureableModalTable.tableColDef = [
          { headerName: this.LT == 'bn' ? 'প্রতিষ্ঠানের নাম' : 'Name ', width: '10%', internalName: 'Name', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'প্রতিষ্ঠানের ঠিকানা' : 'Address ', width: '15%', internalName: 'Address', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'প্রতিনিধির নাম' : 'Contact Person', width: '15%', internalName: 'ContactPerson', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'প্রতিনিধির ফোন নং' : 'Contact No', width: '15%', internalName: 'ContactNo', sort: false, type: "" },
          { headerName: this.LT == 'bn' ? 'মন্তব্য' : 'Remark', width: '15%', internalName: 'Remark', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'সরবরাহকৃত মালের ধরন' : 'Product Category', width: '10%', internalName: 'ActivityType', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'অবস্থা' : 'Status', width: '10%', internalName: 'Status', sort: true, type: "" }
        ]

      this.adminService.fnGetVendor(this.userId, 0,"All").subscribe((data: any) => {
        console.log("data", data);
        this.alertService.fnLoading(false)
        this.configureableModalData = data || [];

        this.modalRef = this.modalService.open(content,{ size: 'lg' });
        this.modalRef.result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      }, (error: any) => {
        this.alertService.fnLoading(false);
      });
    }
  }

  public partsId: number;
  public partsName: string;
  public availableParts: string;
  public numberOfParts: number;
  public currentPartsList = [];
  public jobPartsList = [];

  fnPtableModalCallBack(event: any) {
    console.log("event", event);
    if (this.modalType == "Select Parts") {
      this.itemDetails = event.record;
    } else if (this.modalType == "Select Car Type") {
      this.itemDetails.CarTypeId = event.record.CarTypeId;
      this.itemDetails.CarTypeName = event.record.Type;
    } else if(this.modalType == "Select Vendor Information"){
      this.StoreInfo.VendorId = event.record.VendorId;
      this.StoreInfo.VendorName = event.record.Name;
    }
    this.modalRef.close();
  }

  public jobItemListTableBind = {
    tableID: "messtage-history-table",
    tableClass: "table table-border ",
    tableName: this.LT == 'bn' ? 'যন্ত্রাংশের  তালিকা' : 'List of Parts',
    tableRowIDInternalName: "CarId",
    tableColDef: [
      { headerName: this.LT == 'bn' ? 'যন্ত্রাংশের  নাম' : 'Parts Name ', width: '15%', internalName: 'PartsName', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'যন্ত্রাংশের মুল্য' : 'Unit Price ', width: '20%', internalName: 'UnitPrice', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'একক' : 'Units', width: '20%', internalName: 'Units', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'যন্ত্রাংশের পরিমাণ' : 'Quantity', width: '10%', internalName: 'Quantity', sort: false, type: "" },
      { headerName: this.LT == 'bn' ? 'অবশিষ্ট' : 'Balance', width: '20%', internalName: 'Balance', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'অবস্থা' : 'Status', width: '15%', internalName: 'Status', sort: true, type: "" }
    ],
    enabledSearch: false,
    enabledSerialNo: true,
    pageSize: 15,
    enabledPagination: true,
    enabledEditBtn: true,
    enabledCellClick: true,
    enabledColumnFilter: true,
  };

  public configureableModalTable = {
    tableID: "messtage-history-table",
    tableClass: "table table-border ",
    tableName: this.LT == 'bn' ? 'কর্মচারীর পদবি নির্বাচন করুন' : 'Select Employee Role',
    tableRowIDInternalName: "ID",
    tableColDef: [
      { headerName: this.LT == 'bn' ? 'পদবি' : 'Role Title ', width: '40%', internalName: 'Name', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'যিনি তৈরী করেছেন' : 'Created By', width: '45%', internalName: 'CreatedByName', sort: true, type: "" },
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

