import { Component, OnInit, ViewChild } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { AlertService } from '../../../shared/modules/alert/alert.service'
import { CarType } from '../../../shared/model/car/car-type'
import { CarTypeReport } from '../../../shared/model/report'
import { CarService, CommonService, ConfigService, ReportService, CustomNgbDateParserFormatter } from '../../../shared/services'
import { NgbModal, NgbModalRef, ModalDismissReasons, NgbTimeStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-payslip-report',
  templateUrl: './payslip-report.component.html',
  styleUrls: ['./payslip-report.component.scss'],
  animations: [routerTransition()],
  providers: [CustomNgbDateParserFormatter]
})
export class PayslipReportComponent implements OnInit {
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
    this.fnGetPaySlipReport();
  }

  fnGetPaySlipReport() {
    this.alertService.fnLoading(true);
    this.IsEditItem = false;
    //let LastUpdate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let LastUpdate = this.configService.getCurrentDate();
    this.reportService.fnGetPaySlipBookReport(this.UserId).subscribe(
      (data: any[]) => {
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
    this.reportService.fnGetDailyCarTypesReport(this.UserId, this.reportDate).subscribe(
      (data: any[]) => {
        console.log(data);
        // this.carTypeList = data || [];
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
              this.fnGetPaySlipReport();
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
    tableName: this.LT == 'bn' ? 'রশিদ বইয়ের তালিকা' : 'Pay Slip Report ',
    tableRowIDInternalName: "CarTypeId",
    tableColDef: [
      { headerName: this.LT == 'bn' ? 'বই নং' : 'Book No ', width: '20%', internalName: 'BookNo', sort: true, type: "" },
      //{ headerName: this.LT == 'bn' ? 'স্বতন্ত্র রশিদের মূল্য' : 'Amount of individul slip', width: '20%', internalName: 'Amount', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'রশিদ সংখ্যা' : 'Number Of Slip', width: '20%', internalName: 'NumberOfSlip', sort: true, type: "button", onClick: "Yes" },
      { headerName: this.LT == 'bn' ? 'ব্যবহৃত সংখ্যা' : 'Number Of Used', width: '20%', internalName: 'NoOfUsedSlip', sort: true, type: "button", onClick: "Yes" },
      { headerName: this.LT == 'bn' ? 'অনুমোদিত রশিদ সংখ্যা' : 'Number of Slip Approved', width: '20%', internalName: 'NoOfPayslipUsedOrApproved', sort: false, type: "button", onClick: "Yes" },

      /*{ headerName: this.LT == 'bn' ? 'গাড়ির প্রকার' : 'Type ', width: '12%', internalName: 'Type', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'গাড়ির বিবরণ' : 'Description', width: '20%', internalName: 'Description', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'গাড়ির সংখ্যা' : 'Number of Buses', width: '10%', internalName: 'NoOfCar', sort: true, type: "button", onClick: "Yes" },
      { headerName: this.LT == 'bn' ? 'চলমান গাড়ির সংখ্যা' : 'No. of on Route Bus', width: '20%', internalName: 'NoOfOnRootCar', sort: true, type: "button", onClick: "Yes" },
      { headerName: this.LT == 'bn' ? 'মেরামত গাড়ির সংখ্যা' : 'No. of on Repair Bus', width: '15%', internalName: 'NoOfRepairCar', sort: true, type: "button", onClick: "Yes" },
      { headerName: this.LT == 'bn' ? 'ভারী মেরামত গাড়ির সংখ্যা' : 'No. of on heavy Repair Bus', width: '20%', internalName: 'NoOfHeavyRepairCar', sort: true, type: "button", onClick: "Yes" },*/
    ],
    enabledSearch: true,
    pageSize: 25,
    enabledPagination: true,
    enabledCellClick: true,
    enabledColumnFilter: true,
  };


  public modalType: string;
  configureableModalData: any[] = [];
  fnPtableCellClick(event: any) {
    let record = event.record;
    this.alertService.fnLoading(true);
    if (event.cellName == 'NumberOfSlip') {
      this.reportService.fnGetPaySlipBookDetails(this.UserId, record.BookNo, 'Book').subscribe((data: any) => {
        console.log("data", data);
        this.alertService.fnLoading(false)
        this.configureableModalData = data || [];
        this.configureableModalTable.tableName = this.LT == 'bn' ?  record.BookNo + ' রশিদ বইয়ের তালিকা' : 'Pay Slip List of Book ' + record.BookNo ;
        this.configureableModalTable.tableColDef = [
          { headerName: this.LT == 'bn' ? 'রশিদ নং' : 'Slip No ', width: '15%', internalName: 'SlipNo', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'বই নং' : 'Book No', width: '15%', internalName: 'BookNo', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'টাকার পরিমাণ' : 'Amount (TK)', width: '15%', internalName: 'Amount', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'অবস্থা' : 'Status', width: '15%', internalName: 'Status', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'অনুমোদনকারী ' : 'Approved By', width: '15%', internalName: 'ApprovedByName', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'ব্যবহারকারী' : 'Used By', width: '15%', internalName: 'UsedByName', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'ব্যবহারের তারিখ' : 'Used Date', width: '15%', internalName: 'UsedDate', sort: true, type: "" },
        ];
        this.modalRef = this.modalService.open(this.childModal, { size: 'lg', backdrop: 'static' });
        this.modalRef.result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      });
    } else if (event.cellName == 'NoOfUsedSlip') {
      this.reportService.fnGetPaySlipBookDetails(this.UserId, record.BookNo, 'Used Record Book Wise').subscribe((data: any) => {
        console.log("data", data);
        this.alertService.fnLoading(false);
        this.configureableModalData = data || [];

        this.configureableModalTable.tableName = this.LT == 'bn' ? record.BookNo+' বইয়ের ব্যবহারিত রশিদের তালিকা' : 'Used Pay Slip of Book '+record.BookNo;
        this.configureableModalTable.tableColDef = [
          { headerName: this.LT == 'bn' ? 'রশিদ নং' : 'Slip No ', width: '15%', internalName: 'SlipNo', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'বই নং' : 'Book No', width: '15%', internalName: 'BookNo', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'টাকার পরিমাণ' : 'Amount (TK)', width: '15%', internalName: 'Amount', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'অবস্থা' : 'Status', width: '15%', internalName: 'Status', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'অনুমোদনকারী ' : 'Approved By', width: '15%', internalName: 'ApprovedByName', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'ব্যবহারকারী' : 'Used By', width: '15%', internalName: 'UsedByName', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'ব্যবহারের তারিখ' : 'Used Date', width: '15%', internalName: 'UsedDate', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'গাড়ী নং' : 'Registration No', width: '15%', internalName: 'RegistrationNo', sort: true, type: "" },
        ];

        this.modalRef = this.modalService.open(this.childModal, { size: 'lg', backdrop: 'static' });
        this.modalRef.result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      });
    }else if (event.cellName == 'NoOfPayslipUsedOrApproved') {
      this.reportService.fnGetPaySlipBookDetails(this.UserId, record.BookNo, 'Used or Approved Record Book Wise').subscribe((data: any) => {
        console.log("data", data);
        this.alertService.fnLoading(false);
        this.configureableModalData = data || [];

        this.configureableModalTable.tableName = this.LT == 'bn' ? record.BookNo+' বইয়ের ব্যবহারিত এবং অনুমোদিত রশিদের তালিকা' : 'Used and Approved Pay Slip List of Book '+record.BookNo;
        this.configureableModalTable.tableColDef = [
          { headerName: this.LT == 'bn' ? 'রশিদ নং' : 'Slip No ', width: '15%', internalName: 'SlipNo', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'বই নং' : 'Book No', width: '15%', internalName: 'BookNo', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'টাকার পরিমাণ' : 'Amount (TK)', width: '15%', internalName: 'Amount', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'অবস্থা' : 'Status', width: '15%', internalName: 'Status', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'অনুমোদনকারী ' : 'Approved By', width: '15%', internalName: 'ApprovedByName', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'ব্যবহারকারী' : 'Used By', width: '15%', internalName: 'UsedByName', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'ব্যবহারের তারিখ' : 'Used Date', width: '15%', internalName: 'UsedDate', sort: true, type: "" },
          { headerName: this.LT == 'bn' ? 'গাড়ী নং' : 'Registration No', width: '15%', internalName: 'RegistrationNo', sort: true, type: "" },
        ];

        this.modalRef = this.modalService.open(this.childModal, { size: 'lg', backdrop: 'static' });
        this.modalRef.result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      });
    }
  }


  fnPtableModalCallBack(event: any) {
    this.modalRef.close();
  }

  public configureableModalTable = {
    tableID: "messtage-history-table",
    tableClass: "table table-border ",
    tableName: this.LT == 'bn' ? 'রশিদের তালিকা' : 'Pay Slip List',
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
