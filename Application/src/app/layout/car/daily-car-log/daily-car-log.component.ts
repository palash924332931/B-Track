import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { AlertService } from '../../../shared/modules/alert/alert.service'
import { CarService, CommonService, ConfigService,CustomNgbDateParserFormatter } from '../../../shared/services'
import { DailyCarHistory } from '../../../shared/model/car'
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-daily-car-log',
  templateUrl: './daily-car-log.component.html',
  styleUrls: ['./daily-car-log.component.scss'],
  animations: [routerTransition()],
  providers: [CustomNgbDateParserFormatter]
})
export class DailyCarLogComponent implements OnInit {

  public carLogList: DailyCarHistory[] = [];
  public userId = 1;
  public UserInfo = JSON.parse(localStorage.getItem("car-system-user-info-option-b"));
  public LT: string = ConfigService.languageType;
  public fromDateSelected: any=null;
  public toDateSelected: any=null;
  public fromDate: string=null;
  public toDate: string=null;
  constructor(private alertService: AlertService, private carService: CarService,private ngbDateParserFormatter:NgbDateParserFormatter, private router: Router,private configService:ConfigService,private customNgbDateParserFormatter:CustomNgbDateParserFormatter) { }


  ngOnInit() {
    this.userId = this.UserInfo[0].Id;
    this.fromDate = this.configService.getCurrentDate();
    this.toDate = this.configService.getCurrentDate();
    this.fromDateSelected = this.customNgbDateParserFormatter.parse(this.fromDate || null);
    this.toDateSelected = this.customNgbDateParserFormatter.parse(this.toDate || null);
    this.fnGetDilyCarLogList();
  }

  fnGetDilyCarLogList() {
    this.alertService.fnLoading(true);
    this.carService.fnGetDilyCarLogListDateRange(this.userId,'ALL',this.fromDate,this.toDate).then(      
      (data: DailyCarHistory[]) => {
        this.carLogTableBind.tableName= this.LT == 'bn' ? this.fromDate+ ' থেকে '+this.toDate+' তারিখের গাড়ীর লগের তালিকা' : 'Bus Log List from '+this.fromDate+' to '+this.toDate;
        this.carLogList = data || [];
        data.forEach((rec: DailyCarHistory) => {
          if (rec.Status == 'Approved' || rec.Status == 'Paid' || rec.Status == 'Send for Approval'|| rec.Status == 'Partially Paid') {
            rec.CheckApprovalBtn = 'false';
          } else {
            rec.CheckApprovalBtn = 'true';
          }
        });
        //CheckApprovalBtn
        this.alertService.fnLoading(false);
      },
      (error: any) => {
        this.alertService.fnLoading(false);
        this.alertService.alert(this.LT == 'bn' ? 'নেটওয়ার্ক সমস্যার কারনে সিস্টেমটি গাড়ীর লগের তালিকা দেখাতে ব্যর্থ হয়েছে' : 'System has failed to show bus log list because of network problem.');
      }
    );
  }

  fnNewLog() {
    this.router.navigate(["./car/car-log/0"]);
  }

  fnSendForRequest(event: any) {
    console.log(event);
    if (event.cellName == 'CheckApprovalBtn') {
      let data = event.record;
      if((data.TripNo==""|| data.TripNo==null)&& data.IsUnwantedReturn!=true && data.TripType!='Reserve'){
        this.alertService.alert(this.LT == 'bn' ? 'তথ্যটি আবার সঠিক ভাবে পর্যালোচনা করুন, কারন ট্রিপ নম্বর সঠিক নয়।' : 'Your information is not perfect because number of trip is not availble here.');
        return false;
      }
      
      //check for trip type and amount
      if(data.TotalIncome==null||data.TotalIncome==0){
        this.alertService.alert(this.LT == 'bn' ? 'আপনি ট্রিপের ধরন <b>' + data.TripType + '</b> পছন্দ করেছেন কিন্তু কোন টাকার পরিমাণ বসানো হইনি। সুতরাং তথ্যটি আবার সঠিক ভাবে পর্যালোচনা করুন।' : 'Your information is not perfect because your trip type <b>' + data.TripType + '</b> but there are no availble money for this trip.');
        return false;
      }

      if (data.NoOfPayslipUsedOrApproved != 'false') {
        this.alertService.confirm(this.LT == 'bn' ? 'আপনি কি <b>' + data.RegistrationNo + '</b> গাড়ীটি অনুমোদনের জন্য পাঠাতে চান?' : 'Do you want to send  <b>' + data.RegistrationNo + ' </b>bus for approval?',
          () => {
            this.carService.fnUpdateDilyCarLog(this.userId, data.CarLogId, 'Send for Approval').then(
              (success: any) => {
                this.alertService.fnLoading(false);
                this.alertService.alert(success._body.replace(/"/g, ''),
                  () => {
                    this.fnGetDilyCarLogList();
                  });
              },
              (error: any) => {
                this.alertService.fnLoading(false);
                this.alertService.alert("System has failed to execute your request. Please try again.");
              }
            );
          },
          () => { });
      }
    }

  }
  onSelectFromDate(date: any) {
    if (date != null) {
      this.fromDate = this.ngbDateParserFormatter.format(date);
    }
  }
  onSelectToDate(date: any) {
    if (date != null) {
      this.toDate = this.ngbDateParserFormatter.format(date);
    }
  }

  fnPtableCallBack(event: any) {
    let data = event.record;
    if (event.action == "delete-item") {
      this.alertService.confirm(this.LT == 'bn' ? 'আপনি কি <b> ' + data.RegistrationNo + '</b> গাড়ীর লগটি মুছে ফেলতে চান?' : 'Do you want to delete bus log <b>' + data.RegistrationNo + '</b>?',
        () => {
          this.carService.fnDeleteCarLog(data.CarLogId).subscribe(
            (success: any) => {
              this.alertService.alert(success);
              this.fnGetDilyCarLogList();
            },
            (error: any) => {
              this.alertService.alert(this.LT == 'bn' ? 'সিস্টেমটি গাড়ীর তথ্যটি মুছে ফেলতে ব্যর্থ হয়েছে। আপনি পুনরায় চেষ্টা করুন।' : 'System has failed to delete employee information. Please try again.');
            }
          );
        }
        , function () { })
    } else if (event.action == "edit-item") {
      this.alertService.confirm(this.LT == 'bn' ? 'আপনি কি <b>' + data.RegistrationNo + '</b> গাড়ীর লগটি সম্পাদনা করতে চান?' : 'Do you want to edit bus log' + data.RegistrationNo + '?',
        () => {
          this.router.navigate(["./car/car-log/" + data.CarLogId]);
        }
        , function () { })
    }
  }
  public carLogTableBind = {
    tableID: "messtage-history-table",
    tableClass: "table table-border ",
    tableName: this.LT == 'bn' ? 'গাড়ীর লগের তালিকা' : 'Bus Log List',
    tableRowIDInternalName: "ID",
    tableColDef: [
      { headerName: this.LT == 'bn' ? 'বহির্গমনের তাং' : 'Departure Date', width: '10%', internalName: 'CheckInDate', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'চালকের নাম' : 'Driver Name ', width: '10%', internalName: this.LT=='bn'?'DriverNameBangla':'DriverName', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'রেজিঃ নং' : 'Bus Reg. No', width: '8%', internalName: 'RegistrationNo', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'গাড়ীর প্রকার' : 'Bus Type', width: '11%', internalName: 'TypeName', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'রুটের নাম' : 'Route Name', width: '11%', internalName: 'RootName', sort: false, type: "" },
      { headerName: this.LT == 'bn' ? 'যাত্রা শুরুর স্থান' : 'Start Point', width: '8%', internalName: 'RouteStartPoint', sort: true, type: "" },
      //{ headerName: this.LT == 'bn' ? 'রুটের দূরত্ব' : 'Route Distance', width: '15%', internalName: 'Distance', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'ট্রিপের সংখ্যা' : 'No. of Trip', width: '8%', internalName: 'TripNo', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'মোট দূরত্ব' : 'Total Distance', width: '8%', internalName: 'TotalDistance', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'বহির্গমনের সময়' : 'Departure Time', width: '10%', internalName: 'CheckInTime', sort: true, type: "" },
      //{ headerName: this.LT == 'bn' ? 'প্রবেশের সময়' : 'Arrival Time', width: '15%', internalName: 'CheckOutTime', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'ট্রিপের ধরন' : 'Trip Type', width: '10%', internalName: 'TripType', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'অনুমোদন' : 'Task', width: '10%', internalName: 'CheckApprovalBtn', sort: true, type: "custom-button", onClick: 'true', btnTitle: "Send for Approval" },
      //{ headerName: this.LT=='bn'?'প্রস্থানকারকের নাম':'Departure By', width: '15%', internalName: 'CheckInByName', sort: true, type: "" },
      //{ headerName: this.LT=='bn'?'প্রবেশকারকের নাম':'Arrival By', width: '15%', internalName: 'CheckOutByName', sort: true, type: "" },

    ],
    enabledSearch: true,
    enabledColumnFilter:true,
    enabledSerialNo: true,
    pageSize: 15,
    enabledPagination: true,
    enabledEditBtn: true,
    enabledCellClick: true,
    enabledReflow:true
  };

}
