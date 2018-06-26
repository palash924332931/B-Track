import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../../router.animations';
import { AlertService } from '../../../../shared/modules/alert/alert.service'
import { AccountsService, CommonService, ConfigService } from '../../../../shared/services'
import { PaySlip } from '../../../../shared/model/accounts'
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-payslip-book-details',
  templateUrl: './payslip-book-details.component.html',
  styleUrls: ['./payslip-book-details.component.scss'],
  animations: [routerTransition()]
})
export class PayslipBookDetailsComponent implements OnInit {

  public bookId: string;
  public LT: string = ConfigService.languageType;
  public IsEditEmployee: boolean = false;
  public paySlipDetails = new PaySlip();
  public UserInfo = JSON.parse(localStorage.getItem("car-system-user-info-option-b"));
  public userId = 1;
  public generatedPaySlipList: PaySlip[] = [];
  constructor(private accountsService: AccountsService, private alertService: AlertService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.userId = this.UserInfo[0].Id;
    this.bookId = this.route.snapshot.params["bookId"];
    if (this.bookId != null && this.bookId != undefined && this.bookId != "0") {
      this.IsEditEmployee = true;
      this.fnGetpaySlipDetails();
    } else {
      this.IsEditEmployee = false;
    }
  }

  fnGetpaySlipDetails() {
    this.alertService.fnLoading(true);
    this.accountsService.fnGetPaySlipBookWise(this.userId, this.bookId).subscribe(
      (data: PaySlip[]) => {
        this.paySlipDetails = data[0] || new PaySlip();
        this.generatedPaySlipList = data || [];
        this.alertService.fnLoading(false);
      },
      (error: any) => {
        this.alertService.fnLoading(false);
        this.alertService.alert(this.LT == 'bn' ? 'নেটওয়ার্ক সমস্যার কারণে সিস্টেম কর্মচারী দেখাতে ব্যর্থ হয়েছে।' : 'System has failed to show employee because of network problem.');
      }
    );
  }

  fnSavePaySlip() {
    //to check group name;
    // if (this.paySlipDetails.UserName == null || this.paySlipDetails.UserID == "") {
    //   this.alertService.alert("Employee name and employee ID  can't empty.");
    //   return false;
    // }
    // this.paySlipDetails.UpdateDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    if (this.IsEditEmployee) {
      //this.alertService.fnLoading(true);
      // this.adminService.fnUpdateEmployee(this.paySlipDetails).subscribe(
      //   (success: string) => {
      //     this.alertService.fnLoading(false);
      //     this.alertService.confirm(success + " Do you want to back in employee list?"
      //       , () => {
      //         this.router.navigate(["./admin/employee"]);
      //       }
      //       , function () { });

      //   },
      //   (error: any) => {
      //     this.alertService.fnLoading(false);
      //     this.alertService.alert("System has failed to show employee because of network problem.");
      //   }
      // );
    } else {
      if (this.generatedPaySlipList.length == 0) {
        this.alertService.alert(this.LT == 'bn' ? 'দয়া করে তথ্য সংরক্ষণ করার আগে উৎপন্ন বাটনে ক্লিক করুন এবং রশিদ তৈরি করুন।' : 'Pleae before save information click generate buttion and generate pay slip.');
        return false;
      }

      this.alertService.fnLoading(true);
      this.accountsService.fnPostPaySlip(this.generatedPaySlipList).subscribe(
        (success: any) => {
          this.alertService.fnLoading(false);
          this.alertService.confirm(this.LT == 'bn' ? success._body.replace(/"/g, "") + ' আপনি কি রশিদ বই তালিকায় ফিরে পেতে চান?' : success._body.replace(/"/g, "") + ' Do you want to back in slip book list?'
            , () => {
              this.router.navigate(["./accounts/payslip-book"]);
            }
            , function () { });
        },
        (error: any) => {
          this.alertService.fnLoading(false);
          this.alertService.alert(this.LT == 'bn' ? 'নেটওয়ার্ক সমস্যাটির কারণে সিস্টেম রশিদের বিশদ দেখাতে ব্যর্থ হয়েছে।' : 'System has failed to show pay slip details because of network problem.');
        }
      );
    }
  }

  fnCreateNewItem() {
    this.IsEditEmployee = false;
    this.paySlipDetails = new PaySlip();
    this.bookId = "0";
  }

  fnUpdateNumberOfSlip() {
    if (this.paySlipDetails.SlipNo!=null && this.paySlipDetails.EndSlipNo!=null && this.paySlipDetails.SlipNo!="" && !isNaN(this.paySlipDetails.EndSlipNo)) {
     let num =this.paySlipDetails.EndSlipNo-Number(this.paySlipDetails.SlipNo);
      this.paySlipDetails.NumberOfSlip=num>-1?num+1:0;
    } else {
      this.paySlipDetails.NumberOfSlip = 0;
    }

  }

  fnGeneratePaySlip() {
    this.generatedPaySlipList = [];
    if (this.paySlipDetails.BookNo == null || this.paySlipDetails.BookNo == "") {
      this.alertService.alert(this.LT == 'bn' ? 'বই নম্বর প্রয়োজন। অনুগ্রহ করে পর্যালোচনা করুণ.' : 'Book number is required. Please review.');
      return false;
    } /*else if (this.paySlipDetails.Amount == null || isNaN(this.paySlipDetails.Amount)) {
      this.alertService.alert(this.LT == 'bn' ? 'রশিদের পরিমাণ প্রয়োজন এবং এটি ইংরেজি সংখ্যা হতে হবে। অনুগ্রহ করে পর্যালোচনা করুণ.' : 'Slip amount is required and it will be number. Please review.');
      return false;
    }*/ 
    else if (this.paySlipDetails.SlipNo == null || this.paySlipDetails.SlipNo == "" || isNaN(Number(this.paySlipDetails.SlipNo))) {
      this.alertService.alert(this.LT == 'bn' ? 'প্রারম্ভিক  রশিদ নম্বর প্রয়োজন এবং এটি ইংরেজি সংখ্যা হতে হবে। অনুগ্রহ করে পর্যালোচনা করুণ.' : 'Start Slip number is required and it will be number. Please review.');
      return false;
    }else if (this.paySlipDetails.EndSlipNo == null || isNaN(this.paySlipDetails.EndSlipNo)) {
      this.alertService.alert(this.LT == 'bn' ? 'শেষ  রশিদের পরিমাণ প্রয়োজন এবং এটি ইংরেজি সংখ্যা হতে হবে। অনুগ্রহ করে পর্যালোচনা করুণ.' : 'End Slip amount is required and it will be number. Please review.');
      return false;
    }


    if (this.paySlipDetails.NumberOfSlip == null) {
      this.paySlipDetails.NumberOfSlip = 0;

    }


    for (var i = 0; i < this.paySlipDetails.NumberOfSlip; i++) {
      this.generatedPaySlipList.push({
        PaySlipId: 0, SlipNo: Number(+this.paySlipDetails.SlipNo + i).toString(), BookNo: this.paySlipDetails.BookNo.toString(),
        Amount: null, ReceivedAmount: 0, ApprovedBy: null, ApprovedByName: "", UsedBy: null, UsedByName: "", UsedDate: null, CompanyId: 1, Status: "New",
        CreatedBy: this.userId, CreatedByName: "", Update: null
      });
    }

  }

  public paySlipTableBind = {
    tableID: "messtage-history-table",
    tableClass: "table table-border ",
    tableName: this.LT == 'bn' ? 'রশিদের তালিকা' : 'Pay Slip List',
    tableRowIDInternalName: "ID",
    tableColDef: [
      { headerName: this.LT == 'bn' ? 'রশিদ নং' : 'Slip No ', width: '15%', internalName: 'SlipNo', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'বই নং' : 'Book No', width: '15%', internalName: 'BookNo', sort: true, type: "" },
      //{ headerName: this.LT == 'bn' ? 'মূল্য(টাকা)' : 'Amount (TK)', width: '15%', internalName: 'Amount', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'অবস্থা' : 'Status', width: '15%', internalName: 'Status', sort: true, type: "" },
    ],
    enabledSearch: true,
    pageSize: 15,
    enabledPagination: true,
    enabledEditBtn: false,
    enabledCellClick: true,
  };

  fnBackToSlipList(actionName: string) {
    this.router.navigate(["./accounts/payslip-book"]);
  }

}
