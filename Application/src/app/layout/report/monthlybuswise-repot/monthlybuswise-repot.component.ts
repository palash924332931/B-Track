import { Component, OnInit, ViewChild } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { AlertService } from '../../../shared/modules/alert/alert.service'
import { CarType } from '../../../shared/model/car/car-type'
import { CarTypeReport, DailyCarLogReport } from '../../../shared/model/report'
import { CarService, CommonService, ConfigService, ReportService, CustomNgbDateParserFormatter } from '../../../shared/services'
import { NgbModal, NgbModalRef, ModalDismissReasons, NgbTimeStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-monthlybuswise-repot',
  templateUrl: './monthlybuswise-repot.component.html',
  styleUrls: ['./monthlybuswise-repot.component.scss'],
  animations: [routerTransition()],
  providers: [CustomNgbDateParserFormatter]
})
export class MonthlybuswiseRepotComponent implements OnInit {

  @ViewChild('content') public childModal: any;
  public UserInfo = JSON.parse(localStorage.getItem("car-system-user-info-option-b"));
  public UserId = 1;
  public LT: string = ConfigService.languageType;
  public IsEditItem: boolean = false;
  public monthlyReportData: DailyCarLogReport[];
  public monthlyReportDataRouteWise: any[] = [];
  public carTypes = new CarTypeReport();
  private modalRef: NgbModalRef;
  public closeResult: string;
  public reportDateSelected: any;
  public reportDate: string;
  public fromDateSelected: any = null;
  public toDateSelected: any = null;
  public fromDate: string = null;
  public toDate: string = null;
  public status = 'Bus Wise'
  public selectedBusRegistrationNo: string = "ঢাকা-মেট্রা-ব-১১-৫৯০৯";
  public selectedBusId: number = 40;
  constructor(private carService: CarService, private alertService: AlertService, private modalService: NgbModal, private reportService: ReportService, private configService: ConfigService, private customNgbDateParserFormatter: CustomNgbDateParserFormatter, private ngbDateParserFormatter: NgbDateParserFormatter) {

  }

  ngOnInit() {
    var date = new Date();
    this.fromDate = this.configService.fnFormatDate(new Date(date.getFullYear(), date.getMonth(), 1));
    this.toDate = this.configService.fnFormatDate(new Date(date.getFullYear(), date.getMonth() + 1, 0));
    
    this.fromDateSelected = this.customNgbDateParserFormatter.parse(this.fromDate || null);
    this.toDateSelected = this.customNgbDateParserFormatter.parse(this.toDate || null);
    this.status = 'Bus Wise'


    this.reportDate = this.configService.getCurrentDate();
    this.reportDateSelected = this.customNgbDateParserFormatter.parse(this.reportDate || null);
    this.UserId = this.UserInfo[0].Id;
    this.fnMonthlyBusReportRouteWise();
  }

  fnMonthlyBusReportRouteWise() {
    this.alertService.fnLoading(true);
    this.IsEditItem = false;
    //let LastUpdate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let LastUpdate = this.configService.getCurrentDate();
    this.reportService.fnGetMonthlyBusRouteWiseDateRange(this.UserId, this.fromDate, this.toDate,this.selectedBusId, 'All').subscribe(
      (data: DailyCarLogReport[]) => {
        this.monthlyIncomeReportRouteWise.tableName = this.LT == 'bn' ?this.selectedBusRegistrationNo+' বাসের '+ this.fromDate + ' থেকে ' + this.toDate + ' তারিখের আয়ের প্রতিবেদন' : 'Income Report ' + this.fromDate + ' to ' + this.toDate+' of Bus'+this.selectedBusRegistrationNo,
        console.log(data);
        this.monthlyReportDataRouteWise = data || [];
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

  fnGenerateModal(content, actionName: string) {
    this.alertService.fnLoading(true)
    this.modalType = actionName;
    if (this.modalType == "Select Bus") {
      this.configureableModalTable.enabledRadioBtn = true;
      this.configureableModalTable.enabledSerialNo = false;
      this.configureableModalTable.tableName = this.LT == 'bn' ? 'গাড়ি নির্বাচন করুন' : 'Select Bus from the list.';
      this.configureableModalTable.tableColDef = [
        { headerName: this.LT == 'bn' ? 'রেজিঃ নম্বর' : 'Registration No ', width: '25%', internalName: 'RegistrationNo', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'গাড়ির ধরণ' : 'Bus Type ', width: '25%', internalName: 'Type', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'বিবরণ' : 'Description', width: '25%', internalName: 'Description', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'অবস্থা' : 'Status', width: '25%', internalName: 'Status', sort: true, type: "" },
      ]

      this.carService.fnGetBuses(this.UserId).then((data: any) => {
        console.log("data", data);
        this.alertService.fnLoading(false);
        data = data.filter((rc: any) => { if (rc.Status == 'Active') { return true; } else { return false; } }) || [];
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


  fnSearchReport() {
    this.alertService.fnLoading(true);
    if (this.selectedBusId == 0|| this.selectedBusId==null) {
      this.alertService.alert(this.LT == 'bn' ? 'একটি বাস দয়াকরে পছন্দ করুন।' : 'Please select one of the bus from the list.');
      return false;
    }
      this.monthlyIncomeReportRouteWise.tableName = this.LT == 'bn' ?this.selectedBusRegistrationNo+' বাসের '+ this.fromDate + ' থেকে ' + this.toDate + ' তারিখের আয়ের প্রতিবেদন' : 'Income Report ' + this.fromDate + ' to ' + this.toDate+' of Bus'+this.selectedBusRegistrationNo,
        this.reportService.fnGetMonthlyBusRouteWiseDateRange(this.UserId, this.fromDate, this.toDate,this.selectedBusId, 'All').subscribe(
          (data: any[]) => {
            console.log(data);
            this.monthlyReportDataRouteWise = data || [];
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

  onSelectReportDate(date: any) {
    if (date != null) {
      this.reportDate = this.ngbDateParserFormatter.format(date);
    }
  }

  onSelectFromDate(date: any) {
    if (date != null) {
      this.fromDate = this.ngbDateParserFormatter.format(date);
    } else {
      this.fromDate = null;
    }
  }
  onSelectToDate(date: any) {
    if (date != null) {
      this.toDate = this.ngbDateParserFormatter.format(date);
    } else {
      this.toDate = null;
    }
  }

  // fnPtableCallBack(event: any) {
  //   var data = event.record;
  //   if (event.action == "delete-item") {
  //     this.alertService.confirm(this.LT == 'bn' ? 'আপনি কি গাড়ির প্রকার <b>' + data.Type + '</b>  মুছে ফেলতে চান?' : 'Do you want to delete bus type <b>' + data.Type + '</b>?',
  //       () => {//confirm click
  //         this.carService.fnDeleteCarType(data.CarTypeId).subscribe(
  //           (success: any) => {
  //             this.fnGetDailyPayment();
  //           },
  //           (error: any) => {
  //             this.alertService.alert(this.LT == 'bn' ? 'সিস্টেম গাড়ির প্রকার তথ্যটি মুছে ফেলতে ব্যর্থ হয়েছে। অনুগ্রহপূর্বক আবার চেষ্টা করুন.' : 'System has failed to delete type information. Please try again.');
  //           }
  //         );
  //       },
  //       () => { });
  //   } else if (event.action == "edit-item") {
  //     this.IsEditItem = true;
  //     this.carTypes = data;
  //   }

  // }


  public modalType: string;
  configureableModalData: any[] = [];
  fnPtableCellClickForRouteWiseData(event: any) {
    this.alertService.fnLoading(true);
    this.configureableModalTable.enabledRadioBtn = false;
    this.configureableModalTable.enabledSerialNo = true;
    let record = event.record;
    if (event.cellName == 'TotalIncome') {
      this.reportService.fnGetReportSectionDateRange(this.UserId, this.fromDate, this.toDate, record.RootId,this.selectedBusId, 'Total Income Date Range Bus Report').then((data: any) => {
        console.log("data", data);
        this.alertService.fnLoading(false)
        this.configureableModalData = data || [];

        this.configureableModalTable.tableName = this.LT == 'bn' ? 'রুটে চলমান গাড়ির রাজস্বের তালিকা' : 'Income list of On Route Buses';
        this.configureableModalTable.tableColDef = [
          { headerName: this.LT == 'bn' ? 'রেজিঃ নং' : 'Reg No ', width: '10%', internalName: 'RegistrationNo', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'চলার তারিখ' : 'Departure Date ', width: '12%', internalName: 'CheckInDate', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'চালকের নাম' : 'Driver Name', width: '10%', internalName: this.LT == 'bn' ? 'DriverNameBangla' : 'DriverName', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'রুটের নাম' : 'Route Name', width: '15%', internalName: 'RootName', sort: false, type: "" },
          { headerName: this.LT == 'bn' ? 'ট্রিপের সংখ্যা' : 'No. of Trip ', width: '10%', internalName: 'TripNo', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'রশিদ নং' : 'No. of Trip ', width: '10%', internalName: 'SlipNo', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'মোট রাজস্ব' : 'Total Amount (TK) ', width: '10%', internalName: 'TotalIncome', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'পরিশোধকৃত রাজস্ব' : 'Received Amount (TK) ', width: '10%', internalName: 'PaymentAmount', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'পেমেন্টের অবস্থা' : 'Payment Status', width: '10%', internalName: 'PaymentStatus', sort: true, type: "" }
        ];

        this.modalRef = this.modalService.open(this.childModal, { size: 'lg', backdrop: 'static' });
        this.modalRef.result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      });
    } else if (event.cellName == 'NoOfOnRootCar') {
      this.reportService.fnGetReportSectionDateRange(this.UserId, this.fromDate, this.toDate, record.RootId,this.selectedBusId, 'Total Income Date Range Bus Report').then((data: any) => {
        console.log("data", data);
        this.alertService.fnLoading(false)
        this.configureableModalData = data || [];

        this.configureableModalTable.tableName = this.LT == 'bn' ? 'রুটে চলমান গাড়ির তালিকা' : 'On Route Buses List';
        this.configureableModalTable.tableColDef = [
          { headerName: this.LT == 'bn' ? 'রেজিঃ নম্বর' : 'Reg No ', width: '10%', internalName: 'RegistrationNo', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'চলার তারিখ' : 'Departure Date ', width: '12%', internalName: 'CheckInDate', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'চালকের নাম' : 'Driver Name', width: '10%', internalName: this.LT == 'bn' ? 'DriverNameBangla' : 'DriverName', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'রুটের নাম' : 'Route Name', width: '15%', internalName: 'RootName', sort: false, type: "" },
          { headerName: this.LT == 'bn' ? 'ট্রিপের সংখ্যা' : 'No. of Trip ', width: '10%', internalName: 'TripNo', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'পেমেন্টের অবস্থা' : 'Payment Status', width: '10%', internalName: 'PaymentStatus', sort: true, type: "" }
        ];

        this.modalRef = this.modalService.open(this.childModal, { size: 'lg', backdrop: 'static' });
        this.modalRef.result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      });
    } else if (event.cellName == 'NoOfPaidCar' || event.cellName == 'ReceivedAmount') {
      this.reportService.fnGetReportSectionDateRange(this.UserId, this.fromDate, this.toDate, record.RootId,this.selectedBusId, 'Paid Bus Date Range Bus Report').then((data: any) => {
        console.log("data", data);
        this.alertService.fnLoading(false)
        this.configureableModalData = data || [];

        this.configureableModalTable.tableName = this.LT == 'bn' ? 'রুটে চলমান এবং পরিশোধ গাড়ির তালিকা' : 'On Route and Paid Bus List';
        this.configureableModalTable.tableColDef = [
          { headerName: this.LT == 'bn' ? 'রেজিঃ নং' : 'Reg No ', width: '10%', internalName: 'RegistrationNo', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'চলার তারিখ' : 'Departure Date ', width: '12%', internalName: 'CheckInDate', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'চালকের নাম' : 'Driver Name', width: '10%', internalName: this.LT == 'bn' ? 'DriverNameBangla' : 'DriverName', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'রুটের নাম' : 'Route Name', width: '15%', internalName: 'RootName', sort: false, type: "" },
          { headerName: this.LT == 'bn' ? 'ট্রিপের সংখ্যা' : 'No. of Trip ', width: '10%', internalName: 'TripNo', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'রশিদ নং' : 'No. of Trip ', width: '10%', internalName: 'SlipNo', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'টাকার পরিমাণ' : 'Received Amount (TK) ', width: '10%', internalName: 'PaymentAmount', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'পেমেন্টের অবস্থা' : 'Payment Status', width: '10%', internalName: 'PaymentStatus', sort: true, type: "" }
        ];

        this.modalRef = this.modalService.open(this.childModal, { size: 'lg', backdrop: 'static' });
        this.modalRef.result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      });
    } else if (event.cellName == 'NoOfDueCar' || event.cellName == 'TotalDue') {
      this.reportService.fnGetReportSectionDateRange(this.UserId, this.fromDate, this.toDate, record.RootId,this.selectedBusId, 'Due Bus Bus Report').then((data: any) => {
        console.log("data", data);
        this.alertService.fnLoading(false)
        this.configureableModalData = data || [];

        this.configureableModalTable.tableName = this.LT == 'bn' ? 'রুটে চলমান এবং অপরিশোধ গাড়ির তালিকা' : 'On Route and Due Bus List';
        this.configureableModalTable.tableColDef = [
          { headerName: this.LT == 'bn' ? 'রেজিঃ নম্বর' : 'Reg No ', width: '10%', internalName: 'RegistrationNo', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'চলার তারিখ' : 'Departure Date ', width: '12%', internalName: 'CheckInDate', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'চালকের নাম' : 'Driver Name', width: '10%', internalName: this.LT == 'bn' ? 'DriverNameBangla' : 'DriverName', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'রুটের নাম' : 'Route Name', width: '15%', internalName: 'RootName', sort: false, type: "" },
          { headerName: this.LT == 'bn' ? 'ট্রিপের সংখ্যা' : 'No. of Trip ', width: '10%', internalName: 'TripNo', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'প্রত্যাশিত টাকার পরিমাণ' : 'Expected Amount (TK) ', width: '10%', internalName: 'TotalIncome', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'পরিশোধ টাকা' : 'Expected Amount (TK) ', width: '10%', internalName: 'ReceivedAmount', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'পেমেন্টের অবস্থা' : 'Payment Status', width: '10%', internalName: 'PaymentStatus', sort: true, type: "" }
        ];

        this.modalRef = this.modalService.open(this.childModal, { size: 'lg', backdrop: 'static' });
        this.modalRef.result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      });
    } else if (event.cellName == 'ReceivedOnRouteIncome') {
      this.reportService.fnGetReportSectionDateRange(this.UserId, this.fromDate, this.toDate, record.RootId,this.selectedBusId, 'Received On Route Income Bus Report').then((data: any) => {
        console.log("data", data);
        this.alertService.fnLoading(false)
        this.configureableModalData = data || [];

        this.configureableModalTable.tableName = this.LT == 'bn' ? 'রুটের আয় পরিশোধ গাড়ির তালিকা' : 'Bus List which are Paid Route Income';
        this.configureableModalTable.tableColDef = [
          { headerName: this.LT == 'bn' ? 'রেজিঃ নম্বর' : 'Reg No ', width: '10%', internalName: 'RegistrationNo', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'চলার তারিখ' : 'Departure Date ', width: '12%', internalName: 'CheckInDate', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'চালকের নাম' : 'Driver Name', width: '10%', internalName: this.LT == 'bn' ? 'DriverNameBangla' : 'DriverName', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'রুটের নাম' : 'Route Name', width: '15%', internalName: 'RootName', sort: false, type: "" },
          { headerName: this.LT == 'bn' ? 'ট্রিপের সংখ্যা' : 'No. of Trip ', width: '10%', internalName: 'TripNo', sort: true, type: "" },
          //{ headerName: this.LT == 'bn' ? 'প্রত্যাশিত টাকার পরিমাণ' : 'Expected Amount (TK) ', width: '10%', internalName: 'TotalIncome', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'পরিশোধ টাকা' : 'Expected Amount (TK) ', width: '10%', internalName: 'ReceivedAmount', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'রুটে আয়' : 'Route Income(TK) ', width: '10%', internalName: 'ReceivedOnRouteIncome', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'ভিন্ন রুটে আয়' : 'Diff Route Income (TK) ', width: '10%', internalName: 'ReceivedDifferentRouteIncome', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'পেমেন্টের অবস্থা' : 'Payment Status', width: '10%', internalName: 'PaymentStatus', sort: true, type: "" }
        ];

        this.modalRef = this.modalService.open(this.childModal, { size: 'lg', backdrop: 'static' });
        this.modalRef.result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      });
    } else if (event.cellName == 'ReceivedDifferentRouteIncome') {
      this.reportService.fnGetReportSectionDateRange(this.UserId, this.fromDate, this.toDate, record.RootId,this.selectedBusId, 'Received Different Route Income Bus Report').then((data: any) => {
        console.log("data", data);
        this.alertService.fnLoading(false)
        this.configureableModalData = data || [];

        this.configureableModalTable.tableName = this.LT == 'bn' ? 'ভিন্ন রুটের আয় পরিশোধ গাড়ির তালিকা' : 'Bus List which are Paid Different Route Income';
        this.configureableModalTable.tableColDef = [
          { headerName: this.LT == 'bn' ? 'রেজিঃ নম্বর' : 'Reg No ', width: '10%', internalName: 'RegistrationNo', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'চলার তারিখ' : 'Departure Date ', width: '12%', internalName: 'CheckInDate', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'চালকের নাম' : 'Driver Name', width: '10%', internalName: this.LT == 'bn' ? 'DriverNameBangla' : 'DriverName', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'রুটের নাম' : 'Route Name', width: '15%', internalName: 'RootName', sort: false, type: "" },
          { headerName: this.LT == 'bn' ? 'ট্রিপের সংখ্যা' : 'No. of Trip ', width: '10%', internalName: 'TripNo', sort: true, type: "" },
          //{ headerName: this.LT == 'bn' ? 'প্রত্যাশিত টাকার পরিমাণ' : 'Expected Amount (TK) ', width: '10%', internalName: 'TotalIncome', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'পরিশোধ টাকা' : 'Expected Amount (TK) ', width: '10%', internalName: 'ReceivedAmount', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'রুটে আয়' : 'Route Income(TK) ', width: '10%', internalName: 'ReceivedOnRouteIncome', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'ভিন্ন রুটে আয়' : 'Diff Route Income (TK) ', width: '10%', internalName: 'ReceivedDifferentRouteIncome', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'পেমেন্টের অবস্থা' : 'Payment Status', width: '10%', internalName: 'PaymentStatus', sort: true, type: "" }
        ];

        this.modalRef = this.modalService.open(this.childModal, { size: 'lg', backdrop: 'static' });
        this.modalRef.result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      });
    }
    else {
      this.alertService.fnLoading(false);
    }
  }

  fnPtableModalCallBack(event: any) {
    console.log(event);
    if (this.modalType == 'Select Bus') {
      this.selectedBusRegistrationNo = event.record.RegistrationNo;
      this.selectedBusId = event.record.CarId;
    }
    this.modalRef.close();
  }

  public configureableModalTable = {
    tableID: "messtage-history-table",
    tableClass: "table table-border ",
    tableName: this.LT == 'bn' ? 'গাড়ির তালিকা' : 'List of Buses',
    tableRowIDInternalName: "CarId",
    tableColDef: [
      { headerName: this.LT == 'bn' ? 'রেজিঃ নম্বর' : 'Reg No ', width: '10%', internalName: 'RegistrationNo', sort: true, type: "" },
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
    enabledRadioBtn: false,
    pTableStyle: {
      tableOverflowY: true,
      overflowContentHeight: '460px'
    }
  };

  public monthlyIncomeReportRouteWise = {
    tableID: "messtage-history-table",
    tableClass: "table table-border ",
    tableName: this.LT == 'bn' ? 'গাড়ির তালিকা' : 'List of Buses',
    tableRowIDInternalName: "CarId",
    tableColDef: [
      { headerName: this.LT == 'bn' ? 'রুটের নাম' : 'Route Name ', width: '15%', internalName: 'RootName', sort: true, type: "" },
      //{ headerName: this.LT == 'bn' ? 'গাড়ির বিবরণ' : 'Description', width: '8%', internalName: 'Description', sort: true, type: "" },
      //{ headerName: this.LT == 'bn' ? 'গাড়ির সংখ্যা' : 'Number of Buses', width: '8%', internalName: 'NoOfCar', sort: true, type: "button", onClick: "Yes", showTotal: true },
      { headerName: this.LT == 'bn' ? 'রুটে গাড়ির সংখ্যা' : 'No. of on Route Bus', width: '10%', internalName: 'NoOfOnRootCar', sort: true, type: "button", onClick: "Yes", showTotal: true },
      //{ headerName: this.LT == 'bn' ? 'মেরামত গাড়ির সংখ্যা' : 'No. of on Repair Bus', width: '11%', internalName: 'NoOfRepairCar', sort: true, type: "button", onClick: "Yes" },
      //{ headerName: this.LT == 'bn' ? 'ভারী মেরামত গাড়ির সংখ্যা' : 'No. of on heavy Repair Bus', width: '20%', internalName: 'NoOfHeavyRepairCar', sort: true, type: "button", onClick: "Yes" },
      { headerName: this.LT == 'bn' ? 'মোট অর্জিত রাজস্ব' : 'Total Income (TK)', width: '10%', internalName: 'TotalIncome', sort: true, type: "button", onClick: "Yes", showTotal: true },
      { headerName: this.LT == 'bn' ? 'আদায়কৃত রুটে রাজস্ব' : 'Received Route Income', width: '8%', internalName: 'ReceivedOnRouteIncome', sort: true, type: "button", onClick: "Yes", showTotal: true },
      { headerName: this.LT == 'bn' ? 'আদায়কৃত ভিন্ন রুটে রাজস্ব' : 'Rec. Diff. Route Income', width: '10%', internalName: 'ReceivedDifferentRouteIncome', sort: true, type: "button", onClick: "Yes", showTotal: true },
      { headerName: this.LT == 'bn' ? 'মোট আদায়কৃত রাজস্ব' : 'Paid Amount (TK)', width: '10%', internalName: 'ReceivedAmount', sort: true, type: "button", onClick: "Yes", showTotal: true },
      { headerName: this.LT == 'bn' ? 'অনাদায়ী রাজস্ব' : 'Due Income (TK)', width: '10%', internalName: 'TotalDue', sort: true, type: "button", onClick: "Yes", showTotal: true },
      { headerName: this.LT == 'bn' ? 'রাজস্ব পরিশোধকৃত গাড়ীর সংখ্যা' : 'No. of on Paid Bus', width: '12%', internalName: 'NoOfPaidCar', sort: true, type: "button", onClick: "Yes", showTotal: true },

      { headerName: this.LT == 'bn' ? 'রাজস্ব অপরিশোধকৃত গাড়ীর সংখ্যা' : 'No. of Due Bus', width: '10%', internalName: 'NoOfDueCar', sort: true, type: "button", onClick: "Yes", showTotal: true },
    ],
    enabledSearch: true,
    pageSize: 15,
    enabledPagination: true,
    enabledColumnFilter: true,
    enabledTotal: true,
    enabledCellClick: true,
  };
}
