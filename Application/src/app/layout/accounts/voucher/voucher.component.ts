import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { AlertService } from '../../../shared/modules/alert/alert.service'
import { AccountsService, CommonService, CarService, ConfigService, CustomNgbDateParserFormatter } from '../../../shared/services'
import { DailyPayment } from '../../../shared/model/accounts'
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.scss'],
  animations: [routerTransition()],
  providers: [CustomNgbDateParserFormatter]
})
export class VoucherComponent implements OnInit {

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
        this.dailyPaymentTableBind.tableName= this.LT == 'bn' ? this.fromDate+ ' থেকে '+this.toDate+' তারিখের ভাউচারের তালিকা ' : 'Payment Recived list from '+this.fromDate+' to '+this.toDate ;
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
        this.dailyPaymentTableBind.tableName= this.LT == 'bn' ? this.fromDate+ ' থেকে '+this.toDate+' তারিখের ভাউচারের তালিকা ' : 'Voucher list from '+this.fromDate+' to '+this.toDate ;
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
          this.router.navigate(["./accounts/voucher/" + data.VoucherId]);
        }
        , function () { })
    }
  }


  fnNewBook() {
    this.router.navigate(["./accounts/voucher/0"]);
  }

  public dailyPaymentTableBind = {
    tableID: "messtage-history-table",
    tableClass: "table table-border ",
    tableName: this.LT == 'bn' ? 'দৈনিক ভাউচারের তালিকা' : 'DailyPayment List ',
    tableRowIDInternalName: "ID",
    tableColDef: [
      { headerName: this.LT == 'bn' ? 'ভাউচার নং' : 'Voucher No', width: '10%', internalName: 'VoucherNo', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'ভাউচার তাং' : 'Voucher Date', width: '10%', internalName: 'VoucherDate', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'ভাউচার প্রকার' : 'Voucher Type', width: '12%', internalName: 'VoucherType', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'ভাউচার লেবেল' : 'Voucher Event', width: '12%', internalName: 'VoucherEventName', sort: false, type: "" },
      { headerName: this.LT == 'bn' ? "মোট টাকা" : 'Total Amount', width: '10%', internalName: 'TotalAmount', sort: true, type: "",showTotal:true },
      { headerName: this.LT == 'bn' ? 'অবস্থা' : 'Status', width: '10%', internalName: 'Status', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'অনুমোদনকারী' : 'Approved By', width: '10%', internalName: 'ApprovedByName', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'বিবরন' : 'Description', width: '10%', internalName: 'Description', sort: true, type: "" },      
      { headerName: this.LT == 'bn' ? 'বিস্তারিত দেখুন' : 'Details', width: '15%', internalName: 'Details', sort: true, type: "custom-button", onClick: 'true', btnTitle: "Details" },

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

  public voucherList=[{
    VoucherId:100,
    VoucherNo:'2001',
    VoucherDate:'12-07-2018',
    VoucherType:"Auto Voucher",
    VoucherEventId:100,
    VoucherEventName:'Salary Disburse',
    TotalAmount:10000.00,
    Status:'New',
    Description:'Salary month of July',
    ApprovedByName:'',
    Details:true
  },{
    VoucherId:101,
    VoucherNo:'2002',
    VoucherDate:'11-07-2018',
    VoucherType:"Auto Voucher",
    VoucherEventId:100,
    VoucherEventName:'Purches Store Parts',
    TotalAmount:5000.00,
    Status:'Approved',
    ApprovedByName:'Palash',
    Description:'Parts Description',
    Details:true
  },{
    VoucherId:102,
    VoucherNo:'2003',
    VoucherDate:'10-07-2018',
    VoucherType:"Auto Voucher",
    VoucherEventId:100,
    VoucherEventName:'Office St',
    TotalAmount:10000.00,
    Status:'Approved',
    ApprovedByName:'Palash',
    Description:'Salary month of July',
    Details:true
  }];

}

