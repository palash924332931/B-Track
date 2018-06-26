import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { AlertService } from '../../../shared/modules/alert/alert.service'
import { AccountsService, CommonService, ConfigService } from '../../../shared/services'
import { PaySlip } from '../../../shared/model/accounts'
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
declare var jQuery: any;
@Component({
  selector: 'app-payslip-manager',
  templateUrl: './payslip-manager.component.html',
  styleUrls: ['./payslip-manager.component.scss'],
  animations: [routerTransition()]
})
export class PayslipManagerComponent implements OnInit {

  public paySlipList: PaySlip[] = [];
  public userId = 1;
  public UserInfo = JSON.parse(localStorage.getItem("car-system-user-info-option-b"));
  public LT: string = ConfigService.languageType;
  constructor(private alertService: AlertService, private accountsService: AccountsService, private router: Router) { }

  ngOnInit() {
    this.userId=this.UserInfo[0].Id;
    this.fnGetALlPaySlip();
  }

  fnGetALlPaySlip() {
    this.alertService.fnLoading(true);
    this.accountsService.fnGetPaySlipAll(this.userId).subscribe(
      (data: PaySlip[]) => {
        this.paySlipList = data || [];
        this.alertService.fnLoading(false);
      },
      (error: any) => {
        this.alertService.fnLoading(false);
        this.alertService.alert(this.LT == 'bn' ? 'নেটওয়ার্ক সমস্যাটির কারণে সিস্টেম পণ্য তালিকা প্রদর্শন করতে ব্যর্থ হয়েছে।' : 'System has failed to show product list because of network problem.');
      }
    );
  }

  fnPtableCallBack(event: any) {
    let data = event.record;
    if (event.action == "delete-item") {
      if (data.Status == "Used") {
        this.alertService.alert(this.LT == 'bn' ? 'রশিদ <b>' + data.SlipNo + '</b> ইতোমধ্যে ব্যবহৃত হয়েছে। অন্য চেষ্টা করুন।' : 'Pay slip <b>' + data.SlipNo + '</b> already used. Please try another.');
        return false;
      }
      else if (data.Status == "Approved") {
        this.alertService.alert(this.LT == 'bn' ? 'রশিদ <b>' + data.SlipNo + '</b>ইতোমধ্যে অনুমতি প্রাপ্ত হয়েছে। অন্য চেষ্টা করুন।' : 'Pay slip <b>"' + data.SlipNo + '"</b>already approved. Please try another.');
        return false;
      }

      this.alertService.confirm(this.LT == 'bn' ? 'আপনি কি <b>' + data.SlipNo + '</b> রশিদ মুছে ফেলতে চান ?' : 'Do you want to delete pay slip <b>' + data.SlipNo + '</b>?',
        () => {
          this.accountsService.fnDeletePaySlip(data.PaySlipId).subscribe(
            (success: any) => {
              this.alertService.alert(success);
              this.fnGetALlPaySlip();
            },
            (error: any) => {
              this.alertService.alert(this.LT == 'bn' ? 'সিস্টেম রশিদটি মুছতে ব্যর্থ হয়েছে। অনুগ্রহপূর্বক আবার চেষ্টা করুন.' : 'System has failed to delete pay slip. Please try again.');
            }
          );
        }
        , function () { })
    } else if (event.action == "edit-item") {
      this.alertService.confirm(this.LT == 'bn' ? 'আপনি কি <b>' + data.SlipNo + '</b>রশিদটি সম্পাদনা করতে চান ?' : 'Do you want to edit pay slip <b>' + data.SlipNo + '</b>?',
        () => {
          this.router.navigate(["./accounts/payslip-list/" + data.PaySlipId]);
        }
        , function () { })
    }
  }


  public selectedPaySlipList: PaySlip[] = [];
  fnApprovedSlip() {
    let alreadyUsed:boolean=false;
    this.selectedPaySlipList = [];
    jQuery(".checkbox-payslip-table").each((i, ele) => {
      this.alertService.fnLoading(true);
      if (jQuery(ele).prop('checked') == true) {
        let paySlipId = jQuery(ele).attr("data-sectionvalue");
        this.paySlipList.forEach((element:PaySlip)=>{
              if(element.PaySlipId==paySlipId){
                if(element.Status!='Used' && element.Status!='Review' && element.Status!='Approved'){
                  this.selectedPaySlipList.push(element);
                }else{
                  alreadyUsed=true;
                }               
              }
        });
      }
    }
    );

    if(!alreadyUsed){      
        this.accountsService.fnPostPayslipForApproval(this.selectedPaySlipList,this.userId,'Approved').subscribe((success:any)=>{         
          this.selectedPaySlipList.forEach((element:PaySlip) => {
            this.paySlipList.forEach((ele:PaySlip)=>{
              if(element.PaySlipId==ele.PaySlipId){
                  ele.Status="Approved";
              }
            });
          });
          this.alertService.fnLoading(false);
          this.alertService.alert(success._body);
          this.selectedPaySlipList=[];
        },(error: any) => {
        this.alertService.fnLoading(false);
        this.alertService.alert(this.LT == 'bn' ? 'নেটওয়ার্ক সমস্যাটির কারণে সিস্টেম পণ্য তালিকা প্রদর্শন করতে ব্যর্থ হয়েছে।' : 'System has failed to show product list because of network problem.');
      });
    }else{
      this.alertService.fnLoading(false);
      this.alertService.alert("You have selected Used/Approved pay slip. Please back to the screen and marked them unchecked.");
    }
  }

  public paySlipTableBind = {
    tableID: "payslip-table",
    tableClass: "table table-border ",
    tableName: this.LT == 'bn' ? 'রশিদের তালিকা' : 'Product List ',
    tableRowIDInternalName: "PaySlipId",
    tableColDef: [
      { headerName: this.LT == 'bn' ? 'রশিদ নম্বর' : 'Slip No ', width: '15%', internalName: 'SlipNo', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'বই নং' : 'Book No', width: '15%', internalName: 'BookNo', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'মূল্য (টাকা)' : 'Amount (TK)', width: '15%', internalName: 'Amount', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'অবস্থা' : 'Status', width: '15%', internalName: 'Status', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'অনুমোদনকারী' : 'Approved By', width: '10%', internalName: 'ApprovedByName', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'ব্যবহারকারী' : 'Used By', width: '10%', internalName: 'UsedByName', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'ব্যবহারের তারিখ' : 'Used Date', width: '10%', internalName: 'UsedDate', sort: true, type: "" },
      //{ headerName: this.LT=='bn'?'যিনি তৈরী করেছেন ':'Created By', width: '15%', internalName: 'CreatedByName', sort: true, type: "" },
    ],
    enabledSearch: true,
    enabledCheckbox: true,
    pageSize: 10,
    enabledPagination: true,
    enabledColumnFilter:true,
    enabledCellClick: true,
  };
}
