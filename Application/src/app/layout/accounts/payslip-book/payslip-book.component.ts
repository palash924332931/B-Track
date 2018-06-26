import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { AlertService } from '../../../shared/modules/alert/alert.service'
import { AccountsService, CommonService, ConfigService } from '../../../shared/services'
import { PaySlip } from '../../../shared/model/accounts'
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-payslip-book',
  templateUrl: './payslip-book.component.html',
  styleUrls: ['./payslip-book.component.scss'],
  animations: [routerTransition()]
})
export class PayslipBookComponent implements OnInit {

  public paySlipBookList: PaySlip[] = [];
  public LT: string = ConfigService.languageType;
  public userId = 1;
  public UserInfo = JSON.parse(localStorage.getItem("car-system-user-info-option-b"));
  constructor(private alertService: AlertService, private accountsService: AccountsService, private router: Router) { }

  ngOnInit() {
    this.userId = this.UserInfo[0].Id;
    this.fnGetProduct();
  }
  fnGetProduct() {
    this.alertService.fnLoading(true);
    this.accountsService.fnGetPaySlipBook(this.userId).subscribe(
      (data: PaySlip[]) => {
        this.paySlipBookList = data || [];
        this.paySlipBookList.forEach((rec: any) => {
          if (rec.NoOfPayslipUsedOrApproved == rec.NumberOfSlip) {
            rec.NoOfPayslipUsedOrApproved = 'false';
          }else{
            rec.NoOfPayslipUsedOrApproved = 'true';
          }
        });
        this.alertService.fnLoading(false);
      },
      (error: any) => {
        this.alertService.fnLoading(false);
        this.alertService.alert(this.LT == 'bn' ? 'নেটওয়ার্ক সমস্যার কারণে সিস্টেমটি রশিদ বইয়ের তালিকা প্রদর্শন করতে ব্যর্থ হয়েছে।' : 'System has failed to show pay slip book list because of network problem.');
      }
    );
  }

  fnPtableCallBack(event: any) {
    let data = event.record;
    if (event.action == "delete-item") {
      if (event.record.NoOfUsedSlip > 0) {
        this.alertService.alert(this.LT == 'bn' ? 'এই বইয়ের কিছু রশিদ ব্যবহার করা হয়েছে। সুতরং আপনি বইটি মুছতে পারবেন না।' : 'You have already used few slip of this book. So you have no permission to delete.');
        return false
      }
      this.alertService.confirm(this.LT == 'bn' ? 'আপনি কি <b>' + data.BookNo + '</b> বইটি মুছে ফেলতে চান ?' : 'Do you want to delete book <b>' + data.BookNo + '<b>?',
        () => {
          this.alertService.fnLoading(true);
          this.accountsService.fnDeletePaySlipBook(this.userId, 0, data.BookNo, 'Delete Book').subscribe(
            (success: any) => {
              this.alertService.fnLoading(false);
              this.alertService.alert(success._body.replace(/"/g, ''),
                () => {
                  this.fnGetProduct();
                });

            },
            (error: any) => {
              this.alertService.fnLoading(false);
              this.alertService.alert("System has failed to delete product information. Please try again.");
            }
          );
        }
        , function () { })
    } else if (event.action == "edit-item") {
      this.alertService.confirm(this.LT == 'bn' ? 'আপনি কি <b>' + data.BookNo + '</b> বইটি দেখতে চান?' : 'Do you want to view book <b>' + data.BookNo + '</b>?',
        () => {
          this.router.navigate(["./accounts/payslip-book/" + data.BookNo]);
        }
        , function () { })
    }
  }


  fnNewBook() {
    this.router.navigate(["./accounts/payslip-book/0"]);
  }

  fnSendForRequest(event:any){
    console.log(event);
    if(event.cellName=='NoOfPayslipUsedOrApproved'){
        let data=event.record;
        if(data.NoOfPayslipUsedOrApproved!='false'){
            this.alertService.confirm(this.LT == 'bn' ? 'আপনি কি <b>'+data.BookNo+'</b> রশিদ বইটি অনুমোদনের জন্য পাঠাতে চান?':'Do you want to send Pay slip book <b>'+data.BookNo+'</b> for approval?',
          ()=>{
           this.accountsService.fnPostPaySlipAllOnDemand(this.userId,0,data.BookNo,'Send for Approval').subscribe(
            (success: any) => {
              this.alertService.fnLoading(false);
              this.alertService.alert(success._body.replace(/"/g, ''),
                () => {
                  this.fnGetProduct();
                });
            },
            (error: any) => {
              this.alertService.fnLoading(false);
              this.alertService.alert("System has failed to execute your request. Please try again.");
            }
           );
          },
        ()=>{});
        }
    }

  }


  public paySlipBookTableBind = {
    tableID: "messtage-history-table",
    tableClass: "table table-border ",
    tableName: this.LT == 'bn' ? 'রশিদ বইয়ের তালিকা' : 'Pay Slip Book List',
    tableRowIDInternalName: "ID",
    tableColDef: [
      { headerName: this.LT == 'bn' ? 'বই নং' : 'Book No ', width: '20%', internalName: 'BookNo', sort: true, type: "" },
      //{ headerName: this.LT == 'bn' ? 'স্বতন্ত্র রশিদের মূল্য' : 'Amount of individul slip', width: '20%', internalName: 'Amount', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'প্রস্তুতকারী' : 'Created By', width: '20%', internalName: 'CreatedByName', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'রশিদ নং' : 'Number Of Slip', width: '20%', internalName: 'NumberOfSlip', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'ব্যবহৃত সংখ্যা' : 'Number Of Used', width: '20%', internalName: 'NoOfUsedSlip', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'অনুমোদন' : 'Task', width: '20%', internalName: 'NoOfPayslipUsedOrApproved', sort: false,onClick:'true', type: "custom-button", btnTitle: "Send for Approval" },
    ],
    enabledSerialNo: true,
    enabledSearch: true,
    pageSize: 25,
    enabledPagination: true,
    enabledEditBtn: true,
    enabledCellClick: true,
  };

}
