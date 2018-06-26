import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { AlertService } from '../../../shared/modules/alert/alert.service'
import { CommonService, ConfigService, CarService, CustomNgbDateParserFormatter } from '../../../shared/services'
import { DailyCarHistory } from '../../../shared/model/car'
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
declare var jQuery: any;
@Component({
  selector: 'app-special-activity',
  templateUrl: './special-activity.component.html',
  styleUrls: ['./special-activity.component.scss'],
  animations: [routerTransition()],
  providers: [CustomNgbDateParserFormatter]
})
export class SpecialActivityComponent implements OnInit {

  public carLogList: DailyCarHistory[] = [];
  public userId = 1;
  public UserInfo = JSON.parse(localStorage.getItem("car-system-user-info-option-b"));
  public LT: string = ConfigService.languageType;
  public fromDateSelected: any = null;
  public toDateSelected: any = null;
  public fromDate: string = null;
  public toDate: string = null;
  public status = 'Approved'
  public enabledApprovedBtn: boolean = false;
  constructor(private alertService: AlertService, private commonService: CommonService, private carService: CarService, private router: Router, private customNgbDateParserFormatter: CustomNgbDateParserFormatter, private ngbDateParserFormatter: NgbDateParserFormatter, private configService: ConfigService) { }

  ngOnInit() {
    this.userId = this.UserInfo[0].Id;
    this.fromDate = this.configService.getCurrentDate();
    this.toDate = this.configService.getCurrentDate();
    this.fromDateSelected = this.customNgbDateParserFormatter.parse(this.fromDate || null);
    this.toDateSelected = this.customNgbDateParserFormatter.parse(this.toDate || null);
    this.status = 'Approved'
    this.enabledApprovedBtn = false;
    this.fnGetDilyCarLogList();
  }

  fnGetDilyCarLogList() {
    this.alertService.fnLoading(true);
    let dynamicReportType = 'Approved Date Range Report';
    this.carService.fnGetDilyCarLogListDateRange(this.userId, dynamicReportType, this.fromDate, this.toDate).then(
      (data: DailyCarHistory[]) => {
        this.carLogList = data || [];
        this.alertService.fnLoading(false);
      },
      (error: any) => {
        this.alertService.fnLoading(false);
        this.alertService.alert(this.LT == 'bn' ? 'নেটওয়ার্ক সমস্যার কারনে সিস্টেমটি গাড়ীর লগের তালিকা দেখাতে ব্যর্থ হয়েছে' : 'System has failed to show bus log list because of network problem.');
      }
    );
  }

  fnCheckboxClick() {
    let numOfSelectedCheckbox = jQuery(".checkbox-car-log-table:checked").length || 0;
    if (numOfSelectedCheckbox > 0) {
      this.enabledApprovedBtn = true;
    } else {
      this.enabledApprovedBtn = false;
    }
  }


  fnGetDailyCarLogListSearchResult() {
    this.alertService.fnLoading(true);
    this.enabledApprovedBtn = false;
    let dynamicReportType = 'All';
    if (this.fromDate == null || this.toDate == null || this.fromDate == "") {

    }
    if (this.status == 'All') {
      dynamicReportType = 'All';
    } else if (this.status == 'Active') {
      dynamicReportType = 'Active Status Date Range Report';
    } else if (this.status == 'Sent For Approval') {
      dynamicReportType = 'Sent For Approval Date Range Report';
    } else if (this.status == 'Approved') {
      dynamicReportType = 'Approved Date Range Report';
    } else if (this.status == 'Paid') {
      dynamicReportType = 'Paid Date Range Report';
    }
    this.carService.fnGetDilyCarLogListDateRange(this.userId, dynamicReportType, this.fromDate, this.toDate).then(
      (data: DailyCarHistory[]) => {
        this.carLogList = data || [];
        this.alertService.fnLoading(false);
      },
      (error: any) => {
        this.alertService.fnLoading(false);
        this.alertService.alert(this.LT == 'bn' ? 'নেটওয়ার্ক সমস্যার কারনে সিস্টেমটি গাড়ীর লগের তালিকা দেখাতে ব্যর্থ হয়েছে' : 'System has failed to show bus log list because of network problem.');
      }
    );
  }


  public selectedCarLogList: DailyCarHistory[] = [];
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

  fnSpecialActivity() {
    if (this.selectedRecord != null) {
      let message = "";
      if (this.selectedRecord.Status == 'Paid' || this.selectedRecord.Status == 'Partially Paid') {
        message = this.LT == 'bn' ? 'আপনি  যদি <b>' + this.selectedRecord.CheckInDate + '</b> তারিখের <b>' + this.selectedRecord.RegistrationNo + '</b> গাড়ীটি সক্রিয় হিসাবে চিহ্নিত করেন তাহলে রশিদ ও পেমেন্ট মুছে যাবে। আপনি কি সক্রিয় করতে চান?' : 'If you active Bus <b>' + this.selectedRecord.RegistrationNo + '</b> it will delete payslip and payment history. Are you sure?';
      }
      else if (this.selectedRecord.Status == 'Approved') {
        message = this.LT == 'bn' ? 'আপনি  যদি <b>' + this.selectedRecord.CheckInDate + '</b> তারিখের <b>' + this.selectedRecord.RegistrationNo + '</b> গাড়ীটি সক্রিয় হিসাবে চিহ্নিত করেন তাহলে তথ্য হালনাগাদ করার সুযোগ পাবে। আপনি কি সক্রিয় করতে চান?' : 'If you active Bus <b>' + this.selectedRecord.RegistrationNo + '</b> other user can edit this record. Do you wnat to active??';
      }

      else if (this.selectedRecord.Status == 'Send For Approval') {
        message = this.LT == 'bn' ? 'আপনি  যদি <b>' + this.selectedRecord.CheckInDate + '</b> তারিখের <b>' + this.selectedRecord.RegistrationNo + '</b> গাড়ীটি সক্রিয় হিসাবে চিহ্নিত করেন তাহলে তথ্য হালনাগাদ করার সুযোগ পাবে। আপনি কি সক্রিয় করতে চান?' : 'If you active Bus <b>' + this.selectedRecord.RegistrationNo + '</b> other user can edit this record. Do you wnat to active??';
      }


      this.alertService.confirm(message,
        () => {
          this.enabledApprovedBtn = false;
          this.commonService.fnSpecialActivity(this.userId, this.selectedRecord.CarLogId, 'Marked as Active').subscribe((success: any) => {
            this.carLogList.forEach((element: DailyCarHistory) => {
              if (element.CarLogId == this.selectedRecord.CarLogId) {
                element.Status = "Active";
              }
            });
            this.alertService.fnLoading(false);
            this.alertService.alert(success._body);
            this.selectedRecord = null;
            this.enabledApprovedBtn = false;
          }, (error: any) => {
            this.alertService.fnLoading(false);
            this.alertService.alert(this.LT == 'bn' ? 'সিস্টেম ব্যর্থ হয়েছে আবার চেষ্টা করুন।' : 'System has failed to execute your request please try again.');
          });
        },
        () => { });
    }
    else {
      this.alertService.fnLoading(false);
      this.alertService.alert(this.LT == 'bn' ? 'আপনি অনুমোদিত রেকর্ড নির্বাচন করেছেন। অনুগ্রহপূর্বক স্ক্রীনে ফিরে যান এবং তাদের অনির্বাচিত চিহ্নিত করুন।' : 'You have selected Paid/Approved record. Please back to the screen and marked them unchecked.');
    }
  }

  public selectedRecord: DailyCarHistory;
  fnRadioBtnCallBack(event: any) {
    let record = event.record;
    if (record.Status == 'Approved' || record.Status == 'Send For Approval' || record.Status == 'Paid' || record.Status == 'Partially Paid') {
      this.selectedRecord = record;
      this.enabledApprovedBtn = true;
    } else {
      this.selectedRecord = null;
      this.enabledApprovedBtn = false;
    }
  }

  public carLogTableBind = {
    tableID: "car-log-table",
    tableClass: "table table-border ",
    tableName: this.LT == 'bn' ? 'গাড়ীর লগের তালিকা' : 'Bus Log List',
    tableRowIDInternalName: "CarLogId",
    tableColDef: [
      { headerName: this.LT == 'bn' ? 'বহির্গমনের তাং' : 'Departure Date', width: '8%', internalName: 'CheckInDate', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'চালকের নাম' : 'Driver Name ', width: '8%', internalName: this.LT == 'bn' ? 'DriverNameBangla' : 'DriverName', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'রেজিঃ নং' : 'Bus Reg. No', width: '8%', internalName: 'RegistrationNo', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'গাড়ীর প্রকার' : 'Bus Type', width: '8%', internalName: 'TypeName', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'রুটের নাম' : 'Route Name', width: '12%', internalName: 'RootName', sort: false, type: "" },
      //{ headerName: this.LT=='bn'?'যাত্রা শুরুর স্থান':'Start Point', width: '15%', internalName: 'StartPoint', sort: true, type: "" },
      //{ headerName: this.LT=='bn'?'রুটের দূরত্ব':'Route Distance', width: '10%', internalName: 'Distance', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'ট্রিপের সংখ্যা' : 'No. of Trip', width: '7%', internalName: 'TripNo', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'মোট দূরত্ব' : 'Total Distance', width: '10%', internalName: 'TotalDistance', sort: true, type: "" },
      //{ headerName: this.LT=='bn'?'বহির্গমনের সময়':'Departure Time', width: '10%', internalName: 'CheckInTime', sort: true, type: "" },
      //{ headerName: this.LT=='bn'?'প্রবেশের সময়':'Arrival Time', width: '10%', internalName: 'CheckOutTime', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'রুটের আয়' : 'On Route Amount', width: '8%', internalName: 'OnRouteIncome', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'ভিন্ন রুটে আয়' : 'Diff. Route Amount', width: '8%', internalName: 'DifferentRouteIncome', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'রাজস্বের পরিমান' : 'Total Amount', width: '8%', internalName: 'TotalIncome', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'ট্রিপের ধরন' : 'Trip Type', width: '10%', internalName: 'TripType', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'অবস্থা' : 'Payment Status', width: '10%', internalName: 'Status', sort: true, type: "" },
      //{ headerName: this.LT=='bn'?'প্রস্থানকারকের নাম':'Departure By', width: '15%', internalName: 'CheckInByName', sort: true, type: "" },
      //{ headerName: this.LT=='bn'?'প্রবেশকারকের নাম':'Arrival By', width: '15%', internalName: 'CheckOutByName', sort: true, type: "" },

    ],
    enabledSearch: true,
    enabledSerialNo: false,
    enabledRadioBtn: true,
    pageSize: 15,
    enabledPagination: true,
    enabledEditBtn: false,
    enabledCellClick: false,
    enabledColumnFilter: true,
    enabledReflow: true,
    checkboxCallbackFn: true,
    radioBtnColumnHeader: this.LT == 'bn' ? 'Select' : 'নির্বাঃ করুন',
  };

}
