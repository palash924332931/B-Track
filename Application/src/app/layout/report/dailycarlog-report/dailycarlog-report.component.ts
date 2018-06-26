import { Component, OnInit, ViewChild } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { AlertService } from '../../../shared/modules/alert/alert.service'
import { CarType } from '../../../shared/model/car/car-type'
import { CarTypeReport } from '../../../shared/model/report'
import { CarService, CommonService, ConfigService, ReportService, CustomNgbDateParserFormatter } from '../../../shared/services'
import { NgbModal, NgbModalRef, ModalDismissReasons, NgbTimeStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-dailycarlog-report',
  templateUrl: './dailycarlog-report.component.html',
  styleUrls: ['./dailycarlog-report.component.scss'],
  animations: [routerTransition()],
  providers: [CustomNgbDateParserFormatter]
})
export class DailycarlogReportComponent implements OnInit {
  @ViewChild('content') public childModal: any;
  public UserInfo = JSON.parse(localStorage.getItem("car-system-user-info-option-b"));
  public UserId = 1;
  public LT: string = ConfigService.languageType;
  public IsEditItem: boolean = false;
  public carTypeList: any[];
  public carTypes = new CarTypeReport();
  private modalRef: NgbModalRef;
  public closeResult: string;
  public reportDateSelected: any;
  public reportDate: string;
  constructor(private carService: CarService, private alertService: AlertService, private modalService: NgbModal, private ngbDateParserFormatter: NgbDateParserFormatter, private reportService: ReportService, private configService: ConfigService, private customNgbDateParserFormatter: CustomNgbDateParserFormatter) {

  }

  ngOnInit() {
    this.reportDate = this.configService.getCurrentDate();
    this.reportDateSelected = this.customNgbDateParserFormatter.parse(this.reportDate || null);
    this.UserId = this.UserInfo[0].Id;
    this.fnGetCarTypes();
  }

  fnGetCarTypes() {
    this.alertService.fnLoading(true);
    this.IsEditItem = false;
    //let LastUpdate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let LastUpdate = this.configService.getCurrentDate();
    this.reportService.fnGetDailyCarTypesReport(this.UserId, LastUpdate).subscribe(
      (data: any[]) => {
        this.carTypeTableBind.tableName=this.LT == 'bn' ?this.reportDate + " তারিখের বাসের রিপোর্ট":'Bus Report on '+this.reportDate +' ';
        console.log(data);
        this.carTypeList = data || [];
        this.alertService.fnLoading(false);
      },
      (error: any) => {
        console.log("error", error);
        this.alertService.fnLoading(false);
        this.alertService.alert(this.LT == 'bn' ? 'সিস্টেমটি বাসের ধরন লোড করতে ব্যর্থ হয়েছে। অ্যাডমিন সাথে যোগাযোগ করুন দয়া করে।' : 'System has failed to load bus type. Please contact with admin.');
        return false;
      }
    );
  }


  fnSearchReport() {
    if (this.reportDate == null || this.reportDate == undefined || this.reportDate == "") {
      this.alertService.alert(this.LT == 'bn' ? 'আপনি অনুসন্ধান করার আগে দয়া করে তারিখ নির্বাচন করুন।' : 'Please select date before click search button.');
      return false;
    }
    this.alertService.fnLoading(true);
    this.reportService.fnGetDailyCarTypesReport(this.UserId, this.reportDate).subscribe(
      (data: any[]) => {
        console.log(data);
        this.carTypeTableBind.tableName=this.LT == 'bn' ?this.reportDate + " তারিখের বাসের রিপোর্ট":'Bus Report on '+this.reportDate +' ';
        this.carTypeList = data || [];
        this.alertService.fnLoading(false);
      },
      (error: any) => {
        console.log("error", error);
        this.alertService.fnLoading(false);
        this.alertService.alert(this.LT == 'bn' ? 'সিস্টেমটি বাসের ধরন লোড করতে ব্যর্থ হয়েছে। অ্যাডমিন সাথে যোগাযোগ করুন দয়া করে।' : 'System has failed to load bus type. Please contact with admin.');
        return false;
      }
    );
  }

  fnPtableCallBack(event: any) {
    var data = event.record;
    if (event.action == "delete-item") {
      this.alertService.confirm(this.LT == 'bn' ? 'আপনি কি গাড়ির প্রকার <b>' + data.Type + '</b>  মুছে ফেলতে চান?' : 'Do you want to delete bus type <b>' + data.Type + '</b>?',
        () => {//confirm click
          this.carService.fnDeleteCarType(data.CarTypeId).subscribe(
            (success: any) => {
              this.fnGetCarTypes();
            },
            (error: any) => {
              this.alertService.alert(this.LT == 'bn' ? 'সিস্টেম গাড়ির প্রকার তথ্যটি মুছে ফেলতে ব্যর্থ হয়েছে। অনুগ্রহপূর্বক আবার চেষ্টা করুন.' : 'System has failed to delete type information. Please try again.');
            }
          );
        },
        () => { });
    } else if (event.action == "edit-item") {
      this.IsEditItem = true;
      this.carTypes = data;
    }

  }

  onSelectReportDate(date: any) {
    if (date != null) {
      this.reportDate = this.ngbDateParserFormatter.format(date);
    }
  }

  public carTypeTableBind = {
    tableID: "messtage-history-table",
    tableClass: "table table-border ",
    tableName: this.LT == 'bn' ? 'গাড়ির প্রকার তালিকা' : 'List of Bus Types ',
    tableRowIDInternalName: "CarTypeId",
    tableColDef: [
      { headerName: this.LT == 'bn' ? 'গাড়ির প্রকার' : 'Type ', width: '12%', internalName: 'Type', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'গাড়ির বিবরণ' : 'Description', width: '20%', internalName: 'Description', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'গাড়ির সংখ্যা' : 'Number of Buses', width: '10%', internalName: 'NoOfCar', sort: true, type: "button", onClick: "Yes",showTotal:true },
      { headerName: this.LT == 'bn' ? 'চলমান গাড়ির সংখ্যা' : 'No. of on Route Bus', width: '20%', internalName: 'NoOfOnRootCar', sort: true, type: "button", onClick: "Yes" ,showTotal:true},
      { headerName: this.LT == 'bn' ? 'মেরামতাধীন গাড়ির সংখ্যা' : 'No. of on Repair Bus', width: '15%', internalName: 'NoOfRepairCar', sort: true, type: "button", onClick: "Yes",showTotal:true },
      { headerName: this.LT == 'bn' ? 'ভারী মেরামতাধীন গাড়ির সংখ্যা' : 'No. of on heavy Repair Bus', width: '20%', internalName: 'NoOfHeavyRepairCar', sort: true, type: "button", onClick: "Yes" ,showTotal:true},
    ],
    enabledSearch: true,
    pageSize: 25,
    enabledPagination: true,
    enabledCellClick: true,
    enabledColumnFilter: true,
    enabledTotal:true,
    totalTitle:this.LT == 'bn' ?'মোট':'Total',
  };



  public modalType: string;
  configureableModalData: any[] = [];
  fnPtableCellClick(event: any) {
    this.alertService.fnLoading(true);
    let record = event.record;
    if (event.cellName == 'NoOfCar') {
      this.carService.fnGetBusesOnType(this.UserId, event.record.CarTypeId).then((data: any) => {
        console.log("data", data);
        this.alertService.fnLoading(false)
        this.configureableModalData = data || [];
        this.configureableModalTable.tableName = this.LT == 'bn' ? 'গাড়ির তালিকা' : 'List of Buses';
        this.configureableModalTable.tableColDef = [
          { headerName: this.LT == 'bn' ? 'নিবন্ধন নম্বর' : 'Reg No ', width: '10%', internalName: 'RegistrationNo', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'নিবন্ধনের তারিখ' : 'Reg. Date ', width: '12%', internalName: 'RegistrationDate', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'প্রকার' : 'Type', width: '10%', internalName: 'Type', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'প্রথম রুটের তারিখ' : 'On Root Date', width: '15%', internalName: 'OnRootDate', sort: false, type: "" },
          { headerName: this.LT == 'bn' ? 'সিটের সংখ্যা' : 'No. of Seat ', width: '10%', internalName: 'NoOfSeat', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'নিষ্ক্রিয় হওয়ার কারণ' : 'Reason For Inactive', width: '20%', internalName: 'ReasonForStop', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'অবস্থা' : 'Status', width: '10%', internalName: 'Status', sort: true, type: "" }
        ];
        this.modalRef = this.modalService.open(this.childModal, { size: 'lg', backdrop: 'static' });
        this.modalRef.result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      });
    } else if (event.cellName == 'NoOfOnRootCar') {
      this.carService.fnGetDailyPaymentReportSection(this.UserId, this.reportDate, record.CarTypeId, 'On Route Bus').then((data: any) => {
        console.log("data", data);
        this.alertService.fnLoading(false);
        this.configureableModalData = data || [];

        this.configureableModalTable.tableName = this.LT == 'bn' ? 'রুটে চলমান গাড়ির তালিকা' : 'On Route Buses List';
        this.configureableModalTable.tableColDef = [
          { headerName: this.LT == 'bn' ? 'নিবন্ধন নম্বর' : 'Reg No ', width: '10%', internalName: 'RegistrationNo', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'নিবন্ধনের তারিখ' : 'Departure Date ', width: '12%', internalName: 'CheckInDate', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'চালকের নাম' : 'Driver Name', width: '10%', internalName: this.LT=='bn'?'DriverNameBangla':'DriverName', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'রুটের নাম' : 'Route Name', width: '15%', internalName: 'RootName', sort: false, type: "" },
          { headerName: this.LT == 'bn' ? 'ট্রিপের সংখ্যা' : 'No. of Trip ', width: '10%', internalName: 'TripNo', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'পেমেন্টের অবস্থা' : 'Payment Status', width: '10%', internalName: 'PaymentStatus', sort: true, type: "" },
        ];

        this.modalRef = this.modalService.open(this.childModal, { size: 'lg', backdrop: 'static' });
        this.modalRef.result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      });
    }else if (event.cellName == 'NoOfRepairCar') {
      this.carService.fnGetBusesOnType(this.UserId, event.record.CarTypeId,'Repair Car').then((data: any) => {
        console.log("data", data);
        this.alertService.fnLoading(false);
        this.configureableModalData = data || [];

        this.configureableModalTable.tableName = this.LT == 'bn' ? 'মেরামত অধীনে গাড়ির তালিকা' : 'Repair Buses List';
        this.configureableModalTable.tableColDef = [
          { headerName: this.LT == 'bn' ? 'নিবন্ধন নম্বর' : 'Reg No ', width: '10%', internalName: 'RegistrationNo', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'নিবন্ধনের তারিখ' : 'Reg. Date ', width: '12%', internalName: 'RegistrationDate', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'প্রকার' : 'Type', width: '10%', internalName: 'Type', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'প্রথম রুটের তারিখ' : 'On Root Date', width: '15%', internalName: 'OnRootDate', sort: false, type: "" },
          { headerName: this.LT == 'bn' ? 'সিটের সংখ্যা' : 'No. of Seat ', width: '10%', internalName: 'NoOfSeat', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'নিষ্ক্রিয় হওয়ার কারণ' : 'Reason For Inactive', width: '20%', internalName: 'ReasonForStop', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'অবস্থা' : 'Status', width: '10%', internalName: 'Status', sort: true, type: "" }
        ];

        this.modalRef = this.modalService.open(this.childModal, { size: 'lg', backdrop: 'static' });
        this.modalRef.result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      });
    }else if (event.cellName == 'NoOfHeavyRepairCar') {
      this.carService.fnGetBusesOnType(this.UserId, event.record.CarTypeId,'Heavy Repair Car').then((data: any) => {
        console.log("data", data);
        this.alertService.fnLoading(false);
        this.configureableModalData = data || [];

        this.configureableModalTable.tableName = this.LT == 'bn' ? 'ভারী মেরামত অধীনে গাড়ির তালিকা' : 'Heavy Repair Buses List';
        this.configureableModalTable.tableColDef = [
          { headerName: this.LT == 'bn' ? 'নিবন্ধন নম্বর' : 'Reg No ', width: '10%', internalName: 'RegistrationNo', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'নিবন্ধনের তারিখ' : 'Reg. Date ', width: '12%', internalName: 'RegistrationDate', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'প্রকার' : 'Type', width: '10%', internalName: 'Type', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'প্রথম রুটের তারিখ' : 'On Root Date', width: '15%', internalName: 'OnRootDate', sort: false, type: "" },
          { headerName: this.LT == 'bn' ? 'সিটের সংখ্যা' : 'No. of Seat ', width: '10%', internalName: 'NoOfSeat', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'নিষ্ক্রিয় হওয়ার কারণ' : 'Reason For Inactive', width: '20%', internalName: 'ReasonForStop', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'অবস্থা' : 'Status', width: '10%', internalName: 'Status', sort: true, type: "" }
        ];

        this.modalRef = this.modalService.open(this.childModal, { size: 'lg', backdrop: 'static' });
        this.modalRef.result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      });
    }else{
      this.alertService.fnLoading(false);
    }
  }


  fnPtableModalCallBack(event: any) {
    this.modalRef.close();
  }

  public configureableModalTable = {
    tableID: "messtage-history-table",
    tableClass: "table table-border ",
    tableName: this.LT == 'bn' ? 'গাড়ির তালিকা' : 'List of Buses',
    tableRowIDInternalName: "CarId",
    tableColDef: [
      { headerName: this.LT == 'bn' ? 'নিবন্ধন নম্বর' : 'Reg No ', width: '10%', internalName: 'RegistrationNo', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'নিবন্ধনের তারিখ' : 'Reg. Date ', width: '12%', internalName: 'RegistrationDate', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'প্রকার' : 'Type', width: '10%', internalName: 'Type', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'প্রথম রুটের তারিখ' : 'On Root Date', width: '15%', internalName: 'OnRootDate', sort: false, type: "" },
      { headerName: this.LT == 'bn' ? 'সিটের সংখ্যা' : 'No. of Seat ', width: '10%', internalName: 'NoOfSeat', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'নিষ্ক্রিয় হওয়ার কারণ' : 'Reason For Inactive', width: '20%', internalName: 'ReasonForStop', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'অবস্থা' : 'Status', width: '10%', internalName: 'Status', sort: true, type: "" }
    ],
    enabledSearch: true,
    enabledSerialNo: true,
    pageSize: 15,
    enabledPagination: false,
    enabledAutoScrolled: true,
    pTableStyle: {
      tableOverflowY: true,
      overflowContentHeight: '460px'
    }
  };

}
