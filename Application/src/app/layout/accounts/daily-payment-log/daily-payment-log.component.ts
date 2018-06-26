import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { AlertService } from '../../../shared/modules/alert/alert.service'
import { AccountsService, CommonService, CarService, ConfigService, CustomNgbDateParserFormatter } from '../../../shared/services'
import { DailyPayment } from '../../../shared/model/accounts'
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-daily-payment-log',
  templateUrl: './daily-payment-log.component.html',
  styleUrls: ['./daily-payment-log.component.scss'],
  animations: [routerTransition()],
  providers: [CustomNgbDateParserFormatter]
})
export class DailyPaymentLogComponent implements OnInit {

  public dailyPaymentList: DailyPayment[] = [];
  public UserInfo = JSON.parse(localStorage.getItem("car-system-user-info-option-b"));
  public userId = 1;
  public LT: string = ConfigService.languageType;
  public fromDateSelected: any = null;
  public toDateSelected: any = null;
  public fromDate: string = null;
  public toDate: string = null;
  constructor(private alertService: AlertService, private carService: CarService, private accountsService: AccountsService, private configService: ConfigService, private router: Router, private ngbDateParserFormatter: NgbDateParserFormatter, private customNgbDateParserFormatter: CustomNgbDateParserFormatter) { }

  ngOnInit() {
    this.userId = this.UserInfo[0].Id;
    this.fromDate = this.configService.getCurrentDate();
    this.toDate = this.configService.getCurrentDate();
    this.fromDateSelected = this.customNgbDateParserFormatter.parse(this.fromDate || null);
    this.toDateSelected = this.customNgbDateParserFormatter.parse(this.toDate || null);
    this.fnGetDailyPayment();
  }
  fnGetDailyPayment() {
    this.alertService.fnLoading(true);
    this.accountsService.fnGetBusPaymentHistory(this.userId, this.fromDate, this.toDate,'Paid Bus Date Range' ).subscribe(
      (data: DailyPayment[]) => {
        this.dailyPaymentTableBind.tableName= this.LT == 'bn' ? this.fromDate+ ' থেকে '+this.toDate+' তারিখের গাড়ীর আদায়ের তালিকা ' : 'Payment Recived list from '+this.fromDate+' to '+this.toDate ;
        this.dailyPaymentList = data || [];
        this.alertService.fnLoading(false);
      },
      (error: any) => {
        this.alertService.fnLoading(false);
        this.alertService.alert("System has failed to show DailyPayment list because of network problem.");
      }
    );
  }

  fnGetDailyPaidLogList() {
    this.alertService.fnLoading(true);
    this.accountsService.fnGetBusPaymentHistory(this.userId, this.fromDate, this.toDate,'Paid Bus Date Range' ).subscribe(
      (data: DailyPayment[]) => {
        console.log(data);
        this.dailyPaymentTableBind.tableName= this.LT == 'bn' ? this.fromDate+ ' থেকে '+this.toDate+' তারিখের গাড়ীর আদায়ের তালিকা ' : 'Payment Recived list from '+this.fromDate+' to '+this.toDate ;
        this.dailyPaymentList = data || [];
        this.alertService.fnLoading(false);
      },
      (error: any) => {
        this.alertService.fnLoading(false);
        this.alertService.alert("System has failed to show DailyPayment list. Please try again.");
      }
    );
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
      if (data.PaymentStatus == 'Paid' || data.PaymentStatus == 'Approved') {
        this.alertService.alert(this.LT == 'bn' ? '<b>' + data.RegistrationNo + ' </b> গাড়ীটি <b>' + data.CheckInDate + '</b> তারিখে <b>' + data.RootName + '</b> রুটে চলেছিল এবং তার টাকা পরিশোধ। তাই আপনি মুছতে পারবেন না।' : 'Bus <b>' + data.RegistrationNo + ' </b> route <b>' + data.RootName + '</b> payment already approved on ' + data.CheckInDate + '. So you can\'t delete this information');
        return false;
      }
      this.alertService.confirm(this.LT == 'bn' ? 'আপনি কি <b>' + data.CheckInDate + '</b> তারিখের ' + data.RegistrationNo + ' গাড়ীটি মুছে ফেলতে চান?' : 'Do you want to delete payment information of Bus <b> ' + data.RegistrationNo + '</b> on route <b>' + data.CheckInDate + '</b> ?',
        () => {
          // this.adminService.fnDeleteDailyPayment(data.ID).subscribe(
          //   (success: any) => {
          //     this.alertService.alert(success);
          //     this.fnGetDailyPayment();
          //   },
          //   (error: any) => {
          //     this.alertService.alert("System has failed to delete DailyPayment information. Please try again.");
          //   }
          // );
        }
        , function () { })
    } else if (event.action == "edit-item") {
      this.alertService.confirm(this.LT == 'bn' ? 'আপনি কি <b>' + data.CheckInDate + '</b> তারিখের ' + data.RegistrationNo + ' গাড়ীটি সম্পাদনা করতে চান?' : 'Do you want to edit payment information of Bus <b> ' + data.RegistrationNo + '</b> on route <b>' + data.CheckInDate + '</b> ?',
        () => {
          this.router.navigate(["./accounts/daily-payment-log/" + data.PaymentId]);
        }
        , function () { })
    }
  }


  fnNewBook() {
    this.router.navigate(["./accounts/daily-payment-log/0"]);
  }

  public dailyPaymentTableBind = {
    tableID: "messtage-history-table",
    tableClass: "table table-border ",
    tableName: this.LT == 'bn' ? 'দৈনিক আদায়ের তালিকা' : 'DailyPayment List ',
    tableRowIDInternalName: "ID",
    tableColDef: [
      { headerName: this.LT == 'bn' ? 'গাড়ীর তাং' : 'Departure Date', width: '8%', internalName: 'CheckInDate', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'রেজিঃ নং' : 'Registration No ', width: '10%', internalName: 'RegistrationNo', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'চালকের নাম' : 'Driver Name', width: '10%', internalName: this.LT == 'bn' ? 'DriverNameBangla':'DriverName', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'রুটের নাম' : 'Route Name', width: '12%', internalName: 'RootName', sort: true, type: "" },
      // { headerName: this.LT == 'bn' ? 'রুটের দূরত্ব (কি,মি)' : 'Distance (km)', width: '10%', internalName: 'Distance', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'ট্রিপ সংখ্যা' : 'Num. of Trip', width: '6%', internalName: 'TripNo', sort: true, type: "",showTotal:true },
      { headerName: this.LT == 'bn' ? 'রশিদ নং' : 'Slip No', width: '6%', internalName: 'SlipNo', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'রশিদে টাকা' : 'Slip Amount', width: '7%', internalName: 'PaymentAmount', sort: true, type: "",showTotal:true },
      { headerName: this.LT == 'bn' ? 'মোট রাজস্ব' : 'Total Amount', width: '10%', internalName: 'TotalIncome', sort: true, type: "",showTotal:true },
      // { headerName: this.LT == 'bn' ? 'প্রত্যাশিত টাকা' : 'Expected Amount', width: '15%', internalName: 'SystemAmount', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'আদায়ের অবস্থা' : 'Payment Status', width: '10%', internalName: 'PaymentStatus', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'গ্রহনের তাং' : 'ReceivedDate', width: '8%', internalName: 'ReceivedDate', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'গ্রহীতা' : 'Received By', width: '10%', internalName: 'ReceivedByName', sort: true, type: "" },
      // { headerName: this.LT == 'bn' ? 'মন্তব্য' : 'Notes', width: '15%', internalName: 'Notes', sort: true, type: "" },

    ],
    enabledSearch: true,
    pageSize: 25,
    enabledPagination: true,
    enabledColumnFilter: true,
    enabledEditBtn: true,
    enabledCellClick: true,
    enabledTotal: true,
    totalTitle:this.LT == 'bn' ? 'মোট' :'Total',
  };

}
