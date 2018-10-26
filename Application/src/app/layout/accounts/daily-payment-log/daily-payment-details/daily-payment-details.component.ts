import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../../router.animations';
import { AlertService } from '../../../../shared/modules/alert/alert.service'
import { CarService, AccountsService, CommonService, CustomNgbDateParserFormatter, ConfigService } from '../../../../shared/services'
import { DailyPayment, PaySlip } from '../../../../shared/model/accounts'
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, NgbModalRef, ModalDismissReasons, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-daily-payment-details',
  templateUrl: './daily-payment-details.component.html',
  styleUrls: ['./daily-payment-details.component.scss'],
  providers: [CustomNgbDateParserFormatter],
  animations: [routerTransition()]
})
export class DailyPaymentDetailsComponent implements OnInit {
  public userId = 1;
  public LT: string = ConfigService.languageType;
  public paymentId: number;
  public IsEditItem: boolean = false;
  public dailyPaymentDetails = new DailyPayment();
  private modalRef: NgbModalRef;
  public closeResult: string;
  public UserInfo = JSON.parse(localStorage.getItem("car-system-user-info-option-b"));
  public checkInTime = { hour: 0, minute: 0 };
  public checkOutTime: any = null;
  public receivedDate = null;
  public fromDate: string = null;
  public toDate: string = null;
  public fromDateSelected: any = null;
  public toDateSelected: any = null;
  public isMultiReceived: boolean = false;
  public prevPaidAmount: number = 0;
  public prevPaidStatus: string = "";
  public preReceivedDifferentRouteIncome: number = 0
  public preReceivedOnRouteIncome: number = 0;
  public multiPaymentData: any[] = [];
  constructor(private carService: CarService, private accountsService: AccountsService, private configService: ConfigService, private alertService: AlertService, private ngbDateParserFormatter: NgbDateParserFormatter, private customNgbDateParserFormatter: CustomNgbDateParserFormatter, private router: Router, private route: ActivatedRoute, private modalService: NgbModal, private commonService: CommonService) { }

  ngOnInit() {
    this.userId = this.UserInfo[0].Id;
    this.paymentId = this.route.snapshot.params["paymentId"];
    var displayDate = new Date().toLocaleDateString();
    //let date2 = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let date2 = this.configService.getCurrentDate();
    let dateTime = new Date();
    this.toDate = this.configService.fnFormatDate(dateTime);
    var last = new Date(dateTime.getTime() - (7 * 24 * 60 * 60 * 1000));
    this.fromDate = this.configService.fnFormatDate(last);
    //this.fromDate = this.configService.fnFormatDate(new Date(dateTime.getFullYear(), dateTime.getMonth()+1, dateTime.getDay()-7));
    this.fromDateSelected = this.customNgbDateParserFormatter.parse(this.fromDate || null);
    this.toDateSelected = this.customNgbDateParserFormatter.parse(this.toDate || null);
    this.receivedDate=this.customNgbDateParserFormatter.parse(this.toDate || null);

    if (this.paymentId > 0) {
      this.IsEditItem = true;
      this.fnGetDailyPaymentDetails();
    } else {
      this.IsEditItem = false;
      this.dailyPaymentDetails.Status = 'Approved';
      this.dailyPaymentDetails.PaymentStatus = 'Paid';
      this.dailyPaymentDetails.PaymentType = 'Paid';
    }

    this.prevPaidAmount = 0;
    this.prevPaidStatus = 'Due';
    this.preReceivedDifferentRouteIncome = 0;
    this.preReceivedOnRouteIncome = 0;
  }

  fnGetDailyPaymentDetails() {
    this.alertService.fnLoading(true);
    this.accountsService.fnGetDailyPayment(this.userId, this.paymentId).subscribe(
      (data: DailyPayment[]) => {
        this.dailyPaymentDetails = data[0] || new DailyPayment();
        this.receivedDate = this.customNgbDateParserFormatter.parse(this.dailyPaymentDetails.ReceivedDate || null);
        this.alertService.fnLoading(false);
      },
      (error: any) => {
        this.alertService.fnLoading(false);
        this.alertService.alert(this.LT == 'bn' ? 'নেটওয়ার্ক সমস্যার কারনে সিস্টেমটি কর্মচারী দেখাতে ব্যর্থ হয়েছে।' : 'System has failed to show employee because of network problem.');
      }
    );
  }

  fnSavePaymentInfo() {
    if (this.isMultiReceived) {
      this.fnSaveMultiPayment();
    } else {
      this.fnSaveDailyPayment();
    }
  }


  fnSaveMultiPayment() {
    //to check group name;
    if (this.multiPaymentData.length < 1) {
      this.alertService.alert(this.LT == 'bn' ? 'তথ্য সংরক্ষণ করার পূর্বে অনুগ্রহপূর্বক গাড়ী নির্বাচন করুন।' : 'Please select bus before proced your task.');
      return false;
    } else if (this.dailyPaymentDetails.PaySlipId == null || this.dailyPaymentDetails.PaySlipId == undefined) {
      this.alertService.alert(this.LT == 'bn' ? 'তথ্য সংরক্ষণ করার পূর্বে অনুগ্রহপূর্বক রশিদ নং নির্বাচন করুন।' : 'Please select pay slip number before proced your task.');
      return false;
    } else if (this.dailyPaymentDetails.PaymentAmount == 0 || this.dailyPaymentDetails.PaymentAmount == null || this.dailyPaymentDetails.PaymentAmount < 0) {
      this.alertService.alert(this.LT == 'bn' ? 'রশিদে প্রদত্ত টাকার পরিমাণ সঠিক নয়। অনুগ্রহ করে তথ্য যাচাই করুন।' : 'Please varify again your pay slip amount and try to save again.');
      return false;
    } else if (this.dailyPaymentDetails.ReceivedByName == null) {
      this.alertService.alert(this.LT == 'bn' ? 'যিনি টাকার গ্রহন করছেন তার নামটা লিখুন, তারপর সংরক্ষণ করুন।' : 'Please mention the name who has received the money.');
      return false;
    } else if (this.dailyPaymentDetails.ReceivedDate == null) {
      this.alertService.alert(this.LT == 'bn' ? 'অনুগ্রহ করে টাকা গ্রহনের তারিখ প্রদান করুন এবং পুনরায় চেষ্টা করুন।' : 'Please varify again amount received date and try again.');
      return false;
    }

    //this.dailyPaymentDetails.Update = new Date().toISOString().slice(0, 19).replace('T', ' ');
    this.dailyPaymentDetails.Update = this.configService.getCurrentDate();
    this.alertService.fnLoading(true);
    if (!this.IsEditItem) {
      this.dailyPaymentDetails.PaymentId = 0;
      this.dailyPaymentDetails.CreatedBy = this.userId;
      this.dailyPaymentDetails.Status = 'Approved';
      this.dailyPaymentDetails.PaymentStatus = 'Paid';
    }
    debugger
    let MultiPayment = { CarList: this.multiPaymentData, PaymentLog: this.dailyPaymentDetails };
    this.accountsService.fnPostMultiPayment(MultiPayment, this.userId).subscribe(
      (success: any) => {
        this.alertService.fnLoading(false);
        this.alertService.confirm(this.LT == 'bn' ? success._body.replace(/"/g, "") + ' আপনি কি পেমেন্টের তালিকা ফিরে পেতে চান?' : success._body.replace(/"/g, "") + ' Do you want to back in payment list?'
          , () => {
            this.router.navigate(["./accounts/daily-payment-log"]);
          }
          , function () { });

      },
      (error: any) => {
        this.alertService.fnLoading(false);
        this.alertService.alert(this.LT == 'bn' ? 'নেটওয়ার্ক সমস্যার কারনে সিস্টেমটি তথ্য সংরক্ষণ করতে ব্যর্থ হয়েছে।' : 'System has failed to save the information because of network problem.');
      }
    );
  }

  fnSaveDailyPayment() {
    //to check group name;
    if (this.dailyPaymentDetails.CarLogId == null || this.dailyPaymentDetails.CarLogId == undefined) {
      this.alertService.alert(this.LT == 'bn' ? 'তথ্য সংরক্ষণ করার পূর্বে অনুগ্রহপূর্বক গাড়ী নির্বাচন করুন।' : 'Please select bus before proced your task.');
      return false;
    } else if (this.dailyPaymentDetails.PaySlipId == null || this.dailyPaymentDetails.PaySlipId == undefined) {
      this.alertService.alert(this.LT == 'bn' ? 'তথ্য সংরক্ষণ করার পূর্বে অনুগ্রহপূর্বক রশিদ নং নির্বাচন করুন।' : 'Please select pay slip number before proced your task.');
      return false;
    } else if (this.dailyPaymentDetails.PaymentAmount == 0 || this.dailyPaymentDetails.PaymentAmount == null || this.dailyPaymentDetails.PaymentAmount < 0) {
      this.alertService.alert(this.LT == 'bn' ? 'রশিদে প্রদত্ত টাকার পরিমাণ সঠিক নয়। অনুগ্রহ করে তথ্য যাচাই করুন।' : 'Please varify again your pay slip amount and try to save again.');
      return false;
    } else if (this.dailyPaymentDetails.PaymentAmount > (Number(this.dailyPaymentDetails.TotalIncome) - Number(this.prevPaidAmount))) {
      this.alertService.alert(this.LT == 'bn' ? 'রশিদে প্রদত্ত টাকার পরিমাণ সঠিক নয়। অনুগ্রহ করে তথ্য যাচাই করুন।' : 'Please varify again your pay slip amount and try to save again.');
      return false;
    } else if (this.dailyPaymentDetails.ReceivedByName == null) {
      this.alertService.alert(this.LT == 'bn' ? 'যিনি টাকার গ্রহন করছেন তার নামটা লিখুন, তারপর সংরক্ষণ করুন।' : 'Please mention the name who has received the money.');
      return false;
    } else if (this.dailyPaymentDetails.ReceivedDate == null) {
      this.alertService.alert(this.LT == 'bn' ? 'অনুগ্রহ করে টাকা গ্রহনের তারিখ প্রদান করুন এবং পুনরায় চেষ্টা করুন।' : 'Please varify again amount received date and try again.');
      return false;
    }

    //this.dailyPaymentDetails.Update = new Date().toISOString().slice(0, 19).replace('T', ' ');
    this.dailyPaymentDetails.Update = this.configService.getCurrentDate();
    this.alertService.fnLoading(true);
    if (!this.IsEditItem) {
      this.dailyPaymentDetails.PaymentId = 0;
      this.dailyPaymentDetails.CreatedBy = this.userId;
      this.dailyPaymentDetails.Status = 'Approved';
      this.dailyPaymentDetails.PaymentStatus = 'Paid';
    }
    debugger
    this.accountsService.fnPostPayment(this.dailyPaymentDetails).subscribe(
      (success: any) => {
        this.alertService.fnLoading(false);
        this.alertService.confirm(this.LT == 'bn' ? success._body.replace(/"/g, "") + ' আপনি কি পেমেন্টের তালিকা ফিরে পেতে চান?' : success._body.replace(/"/g, "") + ' Do you want to back in payment list?'
          , () => {
            this.router.navigate(["./accounts/daily-payment-log"]);
          }
          , function () { });

      },
      (error: any) => {
        this.alertService.fnLoading(false);
        this.alertService.alert(this.LT == 'bn' ? 'নেটওয়ার্ক সমস্যার কারনে সিস্টেমটি গাড়ীর লগ তালিকা দেখাতে ব্যর্থ হয়েছে।' : 'System has failed to show bus log list because of network problem.');
      }
    );
  }

  fnCreateNewItem() {
    this.IsEditItem = false;
    this.dailyPaymentDetails = new DailyPayment();
    this.paymentId = 0;
    this.prevPaidAmount = 0;
    this.prevPaidStatus = 'Due';
    this.preReceivedDifferentRouteIncome = 0;
    this.preReceivedOnRouteIncome = 0;
    this.router.navigate(["./accounts/daily-payment-log/0"]);
  }

  fnChangeTotalDistance() {
    if (this.dailyPaymentDetails.TripNo) {
      this.dailyPaymentDetails.TotalDistance = (this.dailyPaymentDetails.TripNo * (this.dailyPaymentDetails.Distance == null || undefined ? 0 : this.dailyPaymentDetails.Distance));
    } else {
      this.dailyPaymentDetails.TotalDistance = 0;
    }
  }

  onSelectCheckInDate(date: any) {
    if (date != null) {
      // this.dailyPaymentDetails.CheckInDate = this.ngbDateParserFormatter.format(date);
    }
  }

  onSelectReceivedByDate(date: any) {
    if (date != null) {
      this.dailyPaymentDetails.ReceivedDate = this.ngbDateParserFormatter.format(date);
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

  public fnSearchApprovedRecord() {
    this.alertService.fnLoading(true)
    this.accountsService.fnGetApprovedRecordForCollection(this.userId, this.fromDate, this.toDate, 'Approved Record For Collection').subscribe((data: any) => {
      this.alertService.fnLoading(false)
      this.configureableModalData = data || [];
      this.configureableModalData.forEach((rec: any) => {
        rec.DueAmount = Number(rec.TotalIncome || 0) - Number(rec.PaymentAmount || 0) || 0;
        console.log(rec.DueAmount);
      });
    },
      (error: any) => { this.alertService.fnLoading(false) });
  }


  public modalType: string;
  configureableModalData: any[] = [];
  fnGenerateModal(content, actionName: string) {
    this.alertService.fnLoading(true)
    this.modalType = actionName;
    //to check multi received
    if (this.isMultiReceived && this.modalType == "Select Bus Log") {
      this.configureableModalTable.enabledCheckbox = true;
      this.configureableModalTable.enabledRadioBtn = false;
    } else {
      this.configureableModalTable.enabledCheckbox = false;
      this.configureableModalTable.enabledRadioBtn = true;
    }
    //generate modal
    if (this.modalType == "Select Bus Log") {
      this.configureableModalTable.tableName = this.LT == 'bn' ? 'তালিকা থেকে গাড়ী নির্বাচন করুন' : 'Select Bus Information';
      //this.configureableModalTable.enabledColumnFilter=true;

      this.configureableModalTable.tableColDef = [
        { headerName: this.LT == 'bn' ? 'বহির্গমনের তাং' : 'Check In Date', width: '10%', internalName: 'CheckInDate', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'রেজি: নং' : 'Reg. Number ', width: '12%', internalName: 'RegistrationNo', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'গাড়ীর ধরন' : 'Bus Type', width: '10%', internalName: 'TypeName', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'চালকের নাম' : 'Driver Name', width: '15%', internalName: this.LT == 'bn' ? 'DriverNameBangla' : 'DriverName', sort: true, type: "" },
        //{ headerName: this.LT == 'bn' ? 'বহির্গমনের সময়' : 'Check In Type', width: '15%', internalName: 'CheckInTime', sort: true, type: "" },
        // { headerName: this.LT == 'bn' ? 'প্রবেশের সময়' : 'Check Out', width: '15%', internalName: 'CheckOutTime', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'রুটের নাম' : 'Route Name', width: '15%', internalName: 'RootName', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'ট্রিপ সংখ্যা' : 'No. of Trip', width: '8%', internalName: 'TripNo', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'মোট আয়' : 'Total Income', width: '8%', internalName: 'TotalIncome', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'অবস্থা' : 'Status', width: '10%', internalName: 'Status', sort: true, type: "" },
      ]

      //this.carService.fnGetDilyCarLogOnDemand(this.userId, 0, 'Approved Record').then((data: any) => {
      this.accountsService.fnGetApprovedRecordForCollection(this.userId, this.fromDate, this.toDate, 'Approved Record For Collection').subscribe((data: any) => {
        console.log("data", data);
        this.alertService.fnLoading(false)
        this.configureableModalData = data || [];
        this.configureableModalData.forEach((rec: any) => {
          rec.DueAmount = Number(rec.TotalIncome || 0) - Number(rec.PaymentAmount || 0) || 0;
          console.log(rec.DueAmount);
        });
        this.modalRef = this.modalService.open(content, { size: 'lg', windowClass: 'modal-xxl', backdrop: 'static' });
        this.modalRef.result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      });
    }
    else if (this.modalType == "Select Pay Slip") {
      this.configureableModalTable.tableName = this.LT == 'bn' ? 'রশিদ নির্বাচন করুন' : 'Select pay slip from the list.';
      this.configureableModalTable.tableColDef = [
        { headerName: this.LT == 'bn' ? 'রশিদ নং' : 'Slip No ', width: '25%', internalName: 'SlipNo', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'বই নং' : 'Book No ', width: '25%', internalName: 'BookNo', sort: true, type: "" },
        //{ headerName: this.LT == 'bn' ? 'মূল্য (টাকা)' : 'Amount (TK)', width: '25%', internalName: 'Amount', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'রশিদের অবস্থা' : 'Payment Status', width: '25%', internalName: 'Status', sort: true, type: "" },
      ]

      this.accountsService.fnGetPaySlipAllOnDemand(this.userId, 0, '0', 'Approved Record').subscribe((data: any) => {
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
    } else if (this.modalType == "Select Bus Log for multi-received") {

    }
  }
  fnChagePaymentType() {
    if (this.dailyPaymentDetails.PaymentType == 'Paid') {
      this.dailyPaymentDetails.PaymentAmount = Number(this.dailyPaymentDetails.TotalIncome) - Number(this.prevPaidAmount);
    } else if (this.dailyPaymentDetails.PaymentType == 'Paid Route Income') {
      this.dailyPaymentDetails.PaymentAmount = Number(this.dailyPaymentDetails.OnRouteIncome) - Number(this.preReceivedOnRouteIncome);
    } else if (this.dailyPaymentDetails.PaymentType == 'Paid Diff Route Income') {
      this.dailyPaymentDetails.PaymentAmount = Number(this.dailyPaymentDetails.DifferentRouteIncome) - Number(this.preReceivedDifferentRouteIncome);
    } else if (this.dailyPaymentDetails.PaymentType == 'Partially') {
      this.dailyPaymentDetails.PaymentAmount = Number(this.dailyPaymentDetails.TotalIncome) - Number(this.prevPaidAmount);
    }
  }

  fnPtableCheckboxCallBack(event){}
  fnPtableModalCheckboxCallBack(event) {
    //{checkedStatus: true, record: "", type: "all-select"}
    if (event.type == "all-select") {
      if (event.checkedStatus) {
        this.multiPaymentData = this.configureableModalData || [];
      } else {
        this.multiPaymentData = [];
      }
    } else if (event.type == "individual") {
      if (event.checkedStatus) {
        this.multiPaymentData = this.multiPaymentData.filter((rec: any) => { if (rec.CarLogId == event.record.CarLogId) { return false } else { return true; } }) || [];
        this.multiPaymentData.push(this.configureableModalData.filter((rec: any) => { if (rec.CarLogId == event.record.CarLogId) { return true; } else { return false } })[0] || []);
      } else {
        this.multiPaymentData = this.multiPaymentData.filter((rec: any) => { if (rec.CarLogId == event.record.CarLogId) { return false } else { return true; } }) || [];
      }
    }

    //show total amount 
    this.dailyPaymentDetails.PaymentAmount = 0;
    this.multiPaymentData.forEach((rec: any) => {
      this.dailyPaymentDetails.PaymentAmount = Number(this.dailyPaymentDetails.PaymentAmount) + Number(rec.DueAmount) || 0;
    });
  }

  fnPtableCallBackMultiPaymentTable(event: any) {
    console.log(event);
    if (event.action == "delete-item") {
      this.alertService.confirm(this.LT == 'bn' ?"আপনি কি <b>"+event.record.RegistrationNo+"</b> গাড়িটি মুছে ফেলতে চান?":"Do you want to delete car <b>"+event.record.RegistrationNo+"</b>?",
        () => {
          this.multiPaymentData = this.multiPaymentData.filter((rec: any) => { if (rec.CarLogId == event.record.CarLogId) { return false } else { return true; } }) || [];
          //show total amount 
          this.dailyPaymentDetails.PaymentAmount = 0;
          this.multiPaymentData.forEach((rec: any) => {
            this.dailyPaymentDetails.PaymentAmount = Number(this.dailyPaymentDetails.PaymentAmount) + Number(rec.DueAmount) || 0;
          });
        },
        () => { })
    }
  }
  fnPtableModalCallBack(event: any) {
    console.log("event", event);
    if (this.modalType == "Select Bus Log") {
      this.prevPaidAmount = event.record.PaymentAmount || 0;
      this.prevPaidStatus = event.record.PaymentStatus || 'Due';
      this.preReceivedDifferentRouteIncome = event.record.ReceivedDifferentRouteIncome || 0;
      this.preReceivedOnRouteIncome = event.record.ReceivedOnRouteIncome || 0;

      this.dailyPaymentDetails.CarLogId = event.record.CarLogId;
      this.dailyPaymentDetails.RootName = event.record.RootName;
      this.dailyPaymentDetails.RegistrationNo = event.record.RegistrationNo;
      this.dailyPaymentDetails.CarType = event.record.TypeName;
      this.dailyPaymentDetails.DriverName = event.record.DriverName;
      this.dailyPaymentDetails.Distance = event.record.Distance;
      this.dailyPaymentDetails.TotalDistance = event.record.TotalDistance;
      this.dailyPaymentDetails.CheckInDate = event.record.CheckInDate;
      this.dailyPaymentDetails.TripNo = event.record.TripNo;
      this.dailyPaymentDetails.IsUnwantedReturn = event.record.IsUnwantedReturn;
      this.dailyPaymentDetails.ReasonForReturn = event.record.ReasonForReturn;
      this.dailyPaymentDetails.SystemAmount = event.record.TotalIncome;
      this.dailyPaymentDetails.PaymentAmount = Number(event.record.TotalIncome) - Number(this.prevPaidAmount);
      //this.dailyPaymentDetails.PaySlipAmount = event.record.TotalIncome;
      this.dailyPaymentDetails.OnRouteIncome = event.record.OnRouteIncome;
      this.dailyPaymentDetails.DifferentRouteIncome = event.record.DifferentRouteIncome;
      this.dailyPaymentDetails.TripType = event.record.TripType;
      this.dailyPaymentDetails.TotalIncome = event.record.TotalIncome;
      this.dailyPaymentDetails.PaymentStatus = 'Paid';
      this.dailyPaymentDetails.PaymentType = 'Paid';
    } else if (this.modalType == "Select Pay Slip") {
      //to find is this first Id or not
      let IsSelectedPaySlit: boolean = true;
      this.configureableModalData.forEach((rec: PaySlip) => {
        if (rec.SlipNo < event.record.SlipNo && rec.BookNo == event.record.BookNo) {
          IsSelectedPaySlit = false;
        }
      });

      // if (!IsSelectedPaySlit) {
      //   this.modalRef.close();
      //   this.alertService.alert(this.LT == 'bn' ? 'আপনাকে <b>'+event.record.BookNo+' </b> রশিদ বইয়ের প্রথম রশিদটি পছন্দ করতে হবে। দয়া করে আবার চেষ্টা করুন।' : 'Please seletect first pay slip number of book <b>'+event.record.BookNo+'</b>');
      //   return false;
      // } else {
      //   this.dailyPaymentDetails.PaySlipId = event.record.PaySlipId;
      //   //this.dailyPaymentDetails.PaySlipAmount = event.record.Amount;
      //   this.dailyPaymentDetails.SlipNo = event.record.SlipNo;
      //   this.dailyPaymentDetails.BookNo = event.record.BookNo;
      // }

      if (!IsSelectedPaySlit) {
        this.modalRef.close();
        this.alertService.alert(this.LT == 'bn' ? 'আপনাকে <b>' + event.record.BookNo + ' </b> রশিদ বইয়ের প্রথম রশিদটি পছন্দ করতে হবে। কিন্তু সিস্টেম ত্বরান্নিত করার জন্য এখন আপনি পছন্দ করতে পারবেন।' : 'You should select first pay slip number of book <b>' + event.record.BookNo + '</b> but now you can select any of them for back data insert.');

      }
      this.dailyPaymentDetails.PaySlipId = event.record.PaySlipId;
      //this.dailyPaymentDetails.PaySlipAmount = event.record.Amount;
      this.dailyPaymentDetails.SlipNo = event.record.SlipNo;
      this.dailyPaymentDetails.BookNo = event.record.BookNo;

    }
    this.modalRef.close();
  }

  fnPrintCarLog() {
    let printContents, popupWin;
    printContents = ` <div class="container totaldivform">
    <div class="row">
    <div style=" padding-left:40px;padding-right:40px;">
    <table border="0" style="width:100%;">
    <tr align="center" >
      <td colspan="3"  align="center"> <h4>বাংলাদেশ সড়ক পরিবহণ কর্পোরেশন </h4></td>
      <tr> <td colspan="3" align="center">${this.UserInfo[0].CompnayNameBangla}</td> </tr>
      <tr> <td colspan="3" align="center">${this.UserInfo[0].CompanyAddressBangla}<br/></td> </tr>
    </tr>
    <tr align="center" >
      <td  align="left">  শাখা: ${this.UserInfo[0].CompnayNameBangla}</td>
      <td  align="left"> </td>
      <td  align="left">    রশিদ নং : <b>`+ this.commonService.fnConvertEngToBangDigit(this.dailyPaymentDetails.SlipNo) + ` </b> </td>
    </tr>
    <tr align="center" style="padding-top:5px;" >
      <td  align="left"  style="padding-top:5px;">    বাস নং : <b>`+ this.dailyPaymentDetails.RegistrationNo + ` </b></td>
      <td  align="left">     বাসের ধরণ : <b>`+ this.dailyPaymentDetails.CarType + ` </b></td>
      <td  align="left">    তারিখ : <b>`+ this.commonService.fnConvertEngToBangDigit(this.dailyPaymentDetails.ReceivedDate == null ? "" : this.dailyPaymentDetails.ReceivedDate.split("T")[0]) + ` </b></td>
    </tr>
    <tr align="center" >
      <td colspan="3"  ><br/><p>  জনাব  <b>`+ this.dailyPaymentDetails.DriverName + ` </b>
    এর নিকট হইতে  <b>`+ this.dailyPaymentDetails.TripType + ` </b> বাবদ
    <b>`+ this.commonService.fnConvertEngToBangDigit(this.dailyPaymentDetails.PaymentAmount.toString()) + `</b> টাকা ধন্যবাদের সহিত গ্রহণ করিলাম </p> <br/><br/>
    </td>
    </tr>
    <tr align="center" >
      <td  align="center">     টাকার পরিমাণঃ <b>৳ `+ this.commonService.fnConvertEngToBangDigit(this.dailyPaymentDetails.PaymentAmount.toString()) + ` </td>
      <td  align="center">     স্বাক্ষর <br/>
      একাউন্টস অফিসার</td>
      <td  align="center">   স্বাক্ষর<br/>
    আদায়কারী ক্যাশিয়ার</td>
    </tr>
    </table
    </div>
    </div>
</div>
      `;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
        <html>
          <head>
            <title>Pay Slip (system generated: B-Track)</title>
            <style>
            //........Customized style.......
            </style>
          </head>
      <body onload="window.print();window.close()">${printContents}</body>
        </html>`);
    popupWin.document.close();
  }

  public configureableModalTable = {
    tableID: "messtage-history-table",
    tableClass: "table table-border ",
    tableName: this.LT == 'bn' ? 'কর্মচারীর পদবি নির্বাচন করুন' : 'Select Employee Role',
    tableRowIDInternalName: "ID",
    tableColDef: [
      { headerName: this.LT == 'bn' ? 'পদবি' : 'Role Title ', width: '40%', internalName: 'Name', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'প্রস্তুতকারী' : 'Created By', width: '45%', internalName: 'CreatedByName', sort: true, type: "" },
    ],
    enabledSearch: true,
    pageSize: 20,
    enabledPagination: false,
    enabledRadioBtn: true,
    enabledCheckbox: false,
    enabledAutoScrolled: true,
    enabledCellClick: true,
    enabledColumnFilter: false,
    pTableStyle: {
      tableOverflowY: true,
      overflowContentHeight: '460px'
    }
  };

  public multiPaymentTableSetting = {
    tableID: "messtage-history-table",
    tableClass: "table table-border ",
    tableName: this.LT == 'bn' ? 'পেমেন্ট গ্রহনের জন্য নির্বাচিত গাড়ির তালিকা' : 'Selected Car List to Receive Payment',
    tableRowIDInternalName: "ID",
    tableColDef: [
      { headerName: this.LT == 'bn' ? 'বহির্গমনের তাং' : 'Check In Date', width: '10%', internalName: 'CheckInDate', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'রেজি: নং' : 'Reg. Number ', width: '12%', internalName: 'RegistrationNo', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'গাড়ীর ধরন' : 'Bus Type', width: '10%', internalName: 'TypeName', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'চালকের নাম' : 'Driver Name', width: '15%', internalName: this.LT == 'bn' ? 'DriverNameBangla' : 'DriverName', sort: true, type: "" },
      //{ headerName: this.LT == 'bn' ? 'বহির্গমনের সময়' : 'Check In Type', width: '15%', internalName: 'CheckInTime', sort: true, type: "" },      
      { headerName: this.LT == 'bn' ? 'রুটের নাম' : 'Route Name', width: '15%', internalName: 'RootName', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'ট্রিপ সংখ্যা' : 'No. of Trip', width: '8%', internalName: 'TripNo', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'মোট আয়' : 'Total Income', width: '8%', internalName: 'TotalIncome', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'অপরিশোধকৃত টাকা' : 'Due Amount', width: '15%', internalName: 'DueAmount', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'অবস্থা' : 'Status', width: '10%', internalName: 'Status', sort: true, type: "" },
    ],
    enabledSearch: true,
    pageSize: 20,
    enabledPagination: false,
    enabledEditBtn: true,
    enabledCheckbox: false,
    enabledAutoScrolled: true,
    enabledCellClick: true,
    enabledColumnFilter: false,
    pTableStyle: {
      tableOverflowY: true,
      overflowContentHeight: '460px'
    }
  };
}
