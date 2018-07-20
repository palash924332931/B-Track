import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { AlertService } from '../../../shared/modules/alert/alert.service'
import { AccountsService, CommonService, ConfigService, CarService, CustomNgbDateParserFormatter,StoreService } from '../../../shared/services'
import { DailyCarHistory } from '../../../shared/model/car'
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
declare var jQuery: any;

@Component({
  selector: 'app-pol-manager',
  templateUrl: './pol-manager.component.html',
  styleUrls: ['./pol-manager.component.scss'],
  animations: [routerTransition()],
  providers: [CustomNgbDateParserFormatter]
})
export class PolManagerComponent implements OnInit {

  public carLogList: DailyCarHistory[] = [];
  public userId = 1;
  public UserInfo = JSON.parse(localStorage.getItem("car-system-user-info-option-b"));
  public LT: string = ConfigService.languageType;
  public fromDateSelected: any = null;
  public toDateSelected: any = null;
  public fromDate: string = null;
  public toDate: string = null;
  public status = 'All'
  public enabledApprovedBtn: boolean = false;
  constructor(private alertService: AlertService, private accountsService: AccountsService, private storeService:StoreService, private carService: CarService, private router: Router, private customNgbDateParserFormatter: CustomNgbDateParserFormatter, private ngbDateParserFormatter: NgbDateParserFormatter, private configService: ConfigService) { }

  ngOnInit() {
    this.userId = this.UserInfo[0].Id;
    this.fromDate = this.configService.getCurrentDate();
    this.toDate = this.configService.getCurrentDate();
    this.fromDateSelected = this.customNgbDateParserFormatter.parse(this.fromDate || null);
    this.toDateSelected = this.customNgbDateParserFormatter.parse(this.toDate || null);
    this.status = 'All'
    this.enabledApprovedBtn = false;
    //this.fnGetDilyCarLogList();
    this.fnGetPOLDetails();
  }

  fnGetDilyCarLogList() {
    this.alertService.fnLoading(true);
    this.carService.fnGetDilyCarLogListDateRange(this.userId, 'All', this.fromDate, this.toDate).then(
      (data: DailyCarHistory[]) => {
        this.carLogTableBind.tableName = this.LT == 'bn' ? this.fromDate + ' থেকে ' + this.toDate + ' তারিখের গাড়ীর লগের তালিকা ' : 'Bus log list from ' + this.fromDate + ' to ' + this.toDate;
        this.carLogList = data || [];
        this.alertService.fnLoading(false);
      },
      (error: any) => {
        this.alertService.fnLoading(false);
        this.alertService.alert(this.LT == 'bn' ? 'নেটওয়ার্ক সমস্যার কারনে সিস্টেমটি গাড়ীর লগের তালিকা দেখাতে ব্যর্থ হয়েছে' : 'System has failed to show bus log list because of network problem.');
      }
    );
  }

  fnGetPOLDetails() {
    this.alertService.fnLoading(true);
    this.storeService.fnGetPOLLogList(this.userId,0,this.fromDate,this.toDate,"All").subscribe(      
      (data: any[]) => {
        this.carLogTableBind.tableName= this.LT == 'bn' ? this.fromDate+ ' থেকে '+this.toDate+' তারিখের গাড়ীর লগের তালিকা' : 'Bus Log List from '+this.fromDate+' to '+this.toDate;
        this.carLogList = data || [];       
        this.alertService.fnLoading(false);
      },
      (error: any) => {
        this.alertService.fnLoading(false);
        this.alertService.alert(this.LT == 'bn' ? 'সিস্টেম গাড়ীর লগের তালিকা দেখাতে ব্যর্থ হয়েছে' : 'System has failed to show bus log list because of network problem.');
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
    }
    this.carService.fnGetDilyCarLogListDateRange(this.userId, dynamicReportType, this.fromDate, this.toDate).then(
      (data: DailyCarHistory[]) => {
        this.carLogTableBind.tableName = this.LT == 'bn' ? this.fromDate + ' থেকে ' + this.toDate + ' তারিখের গাড়ীর লগের তালিকা ' : 'Bus log list from ' + this.fromDate + ' to ' + this.toDate;
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

  fnRejectCarLog() {
    this.alertService.alert(this.LT == 'bn' ? 'প্রত্যাখ্যান করার অনুমতি এখনও সক্রিয় হয় নাই।' : 'Rejected permission is not activated yet.');
  }

  fnApprovedCarLog() {
    let alreadyUsed: boolean = false;
    this.selectedCarLogList = [];
    jQuery(".checkbox-car-log-table").each((i, ele) => {
      this.alertService.fnLoading(true);
      if (jQuery(ele).prop('checked') == true) {
        let carLogId = jQuery(ele).attr("data-sectionvalue");
        this.carLogList.forEach((element: DailyCarHistory) => {
          if (element.CarLogId == carLogId) {
            if (element.Status != 'Paid' && element.Status != 'Approved' && element.Status != 'Partially Paid') {
              this.selectedCarLogList.push(element);
            } else {
              alreadyUsed = true;
            }
          }
        });
      }
    }
    );

    if (!alreadyUsed) {
      this.carService.fnPostDailyCarLogOnDemand(this.selectedCarLogList, this.userId, 'Approved').subscribe((success: any) => {
        this.selectedCarLogList.forEach((element: DailyCarHistory) => {
          this.carLogList.forEach((ele: DailyCarHistory) => {
            if (element.CarLogId == ele.CarLogId) {
              ele.Status = "Approved";
            }
          });
        });
        this.alertService.fnLoading(false);
        this.alertService.alert(success._body);
        this.enabledApprovedBtn = false;
        this.selectedCarLogList = [];
        jQuery(".checkbox-car-log-table").prop("checked", false);
      }, (error: any) => {
        this.alertService.fnLoading(false);
        this.alertService.alert(this.LT == 'bn' ? 'নেটওয়ার্ক সমস্যাটির কারণে সিস্টেম পণ্য তালিকা প্রদর্শন করতে ব্যর্থ হয়েছে।' : 'System has failed to show product list because of network problem.');
      });
    } else {
      this.alertService.fnLoading(false);
      this.alertService.alert(this.LT == 'bn' ? 'আপনি অনুমোদিত রেকর্ড নির্বাচন করেছেন। অনুগ্রহপূর্বক স্ক্রীনে ফিরে যান এবং তাদের অনির্বাচিত চিহ্নিত করুন।' : 'You have selected Paid/Approved record. Please back to the screen and marked them unchecked.');
    }
  }

  public carLogTableBind = {
    tableID: "car-log-table",
    tableClass: "table table-border ",
    tableName: this.LT == 'bn' ? 'গাড়ীর লগের তালিকা' : 'Bus Log List',
    tableRowIDInternalName: "CarLogId",
    columnNameSetAsClass: 'TargetTripStatus',
    tableColDef: [
      { headerName: this.LT == 'bn' ? ' তারিখ' : 'POL Date', width: '10%', internalName: 'CheckInDate', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'রেজিঃ নং' : 'Bus Reg. No', width: '10%', internalName: 'RegistrationNo', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'চালকের নাম' : 'Driver Name ', width: '10%', internalName: this.LT == 'bn' ? 'DriverNameBangla' : 'DriverName', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'সিএনজি' : 'CNG', width: '8%', internalName: 'CNG', sort: true, type: "", showTotal: true },
      { headerName: this.LT == 'bn' ? 'ডিজেল' : 'Diesel', width: '8%', internalName: 'Diesel', sort: true, type: "", showTotal: true },
      { headerName: this.LT == 'bn' ? 'ইঞ্জিনের তেল' : 'Engine Oil', width: '10%', internalName: 'EngineOil', sort: true, type: "", showTotal: true },
      { headerName: this.LT == 'bn' ? 'পাওয়ার তেল' : 'PowerOil', width: '10%', internalName: 'PowerOil', sort: true, type: "", showTotal: true },
      { headerName: this.LT == 'bn' ? 'গিয়ার তেল' : 'GearOil', width: '10%', internalName: 'GearOil', sort: true, type: "", showTotal: true },
      { headerName: this.LT == 'bn' ? 'গ্রীস' : 'Grease', width: '10%', internalName: 'Grease', sort: true, type: "", showTotal: true },
      { headerName: this.LT == 'bn' ? 'অবস্থা' : 'Status', width: '14%', internalName: 'Status', sort: true, type: "", onClick: 'true', },

    ],
    enabledSearch: true,
    enabledSerialNo: false,
    enabledCheckbox: true,
    pageSize: 15,
    enabledPagination: true,
    enabledEditBtn: false,
    enabledCellClick: false,
    enabledColumnFilter: true,
    enabledReflow: true,
    checkboxCallbackFn: true,
    enabledTotal: true,
    totalTitle: this.LT == 'bn' ? 'মোট' : 'Total',
  };

}

