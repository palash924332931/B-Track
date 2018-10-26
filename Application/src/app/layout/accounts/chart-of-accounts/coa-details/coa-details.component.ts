import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../../router.animations';
import { AlertService } from '../../../../shared/modules/alert/alert.service'
import { CarService, AccountsService, CommonService, CustomNgbDateParserFormatter, ConfigService } from '../../../../shared/services'
import { DailyPayment, PaySlip, COA } from '../../../../shared/model/accounts'
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, NgbModalRef, ModalDismissReasons, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-coa-details',
  templateUrl: './coa-details.component.html',
  styleUrls: ['./coa-details.component.scss'],
  providers: [CustomNgbDateParserFormatter],
  animations: [routerTransition()]
})
export class CoaDetailsComponent implements OnInit {
  public userId = 1;
  public LT: string = ConfigService.languageType;
  public coaId: number;
  public IsEditItem: boolean = false;
  public dailyPaymentDetails = new DailyPayment();
  public coa = new COA();
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
  constructor(private carService: CarService, private accountsService: AccountsService, private configService: ConfigService, private alertService: AlertService, private ngbDateParserFormatter: NgbDateParserFormatter, private customNgbDateParserFormatter: CustomNgbDateParserFormatter, private router: Router, private route: ActivatedRoute, private modalService: NgbModal, private commonService: CommonService) { }

  ngOnInit() {
    this.userId = this.UserInfo[0].Id;
    this.coaId = this.route.snapshot.params["coaId"];
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
    console.log("from date", this.fromDate, 'Todate', this.toDate);

    if (this.coaId > 0) {
      this.IsEditItem = true;
    } else {
      this.IsEditItem = false;
      this.dailyPaymentDetails.Status = 'Approved';
      this.dailyPaymentDetails.PaymentStatus = 'Paid';
    }

    this.prevPaidAmount = 0;
    this.prevPaidStatus = 'Due';
    this.preReceivedDifferentRouteIncome = 0;
    this.preReceivedOnRouteIncome = 0;
  }


fnSaveCOADetails() {
    console.log(this.coa)
}



public modalType: string;
  configureableModalData: any[] = [];
  fnGenerateModal(content, actionName: string) {
    this.alertService.fnLoading(true)
    this.modalType = actionName;
    //generate modal
    if (this.modalType == "Select Pay Slip") {
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
      console.log("data", data);
      this.alertService.fnLoading(false)
      this.configureableModalData = data || [];
    },
      (error: any) => { this.alertService.fnLoading(false) });
  }


  public prevPaidAmount: number = 0;
  public prevPaidStatus: string = "";
  public preReceivedDifferentRouteIncome: number = 0
  public preReceivedOnRouteIncome: number = 0
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

      if (!IsSelectedPaySlit) {
        this.modalRef.close();
        this.coa.ParentID = event.record.SlipNo;

      }
      this.dailyPaymentDetails.PaySlipId = event.record.PaySlipId;
      //this.dailyPaymentDetails.PaySlipAmount = event.record.Amount;
      this.dailyPaymentDetails.SlipNo = event.record.SlipNo;
      this.dailyPaymentDetails.BookNo = event.record.BookNo;

    }
    this.modalRef.close();
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
    enabledAutoScrolled: true,
    enabledCellClick: true,
    enabledColumnFilter: false,
    pTableStyle: {
      tableOverflowY: true,
      overflowContentHeight: '460px'
    }
  };
}
