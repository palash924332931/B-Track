import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { AlertService } from '../../../shared/modules/alert/alert.service'
import { AdminService, CommonService, ConfigService } from '../../../shared/services'
import { User } from '../../../shared/model/admin'
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
  animations: [routerTransition()]
})
export class EmployeeComponent implements OnInit {

  public LT:string=ConfigService.languageType;
  public employeeList: User[] = [];
  public userId=1;
  public UserInfo = JSON.parse(localStorage.getItem("car-system-user-info-option-b"));
  constructor(private alertService: AlertService, private adminService: AdminService, private router: Router) { }

  
  ngOnInit() {
    this.userId=this.UserInfo[0].Id;
    this.fnGetEmployees();
  }
  fnGetEmployees() {
    this.alertService.fnLoading(true);
    this.adminService.fnGetEmployees(this.userId).subscribe(
      (data: User[]) => {
        this.employeeList = data || [];
        this.alertService.fnLoading(false);
      },
      (error: any) => {
        this.alertService.fnLoading(false);
        this.alertService.alert(this.LT=='bn'?'নেটওয়ার্ক সমস্যার কারণে সিস্টেম কর্মচারী তালিকায় দেখাতে ব্যর্থ হয়েছে।':'System has failed to show employee list because of network problem.');
      }
    );
  }
  fnNewEmployee () {
    this.router.navigate(["./admin/employee/0"]);
  }

  fnPtableCallBack(event: any) {
    let data = event.record;
    if (event.action == "delete-item") {
      this.alertService.confirm(this.LT=='bn'?'আপনি কি <b>' + data.Name + '</b> কর্মচারী মুছে ফেলতে চান?':'Do you want to delete employee <b>'  + data.Name + '</b>?',
        () => {
          this.adminService.fnDeleteEmployee(data.Id).subscribe(
            (success: any) => {
              //this.alertService.alert(success);
              this.fnGetEmployees();
            },
            (error: any) => {
              this.alertService.alert(this.LT=='bn'?'সিস্টেম কর্মচারী তথ্য মুছে ফেলতে ব্যর্থ হয়েছে। অনুগ্রহপূর্বক আবার চেষ্টা করুন':'System has failed to delete employee information. Please try again.');
            }
          );
        }
        , function () { })
    } else if (event.action == "edit-item") {
      this.alertService.confirm(this.LT=='bn'?'আপনি কি <b>' + data.Name + '</b> কর্মচারী সম্পাদনা করতে চান ?':'Do you want to edit employee <b>'  + data.Name + '</b>?',
        () => {
          this.router.navigate(["./admin/employee/" + data.Id]);
        }
        , function () { })
    }
  }
  public employeeTableBind = {
    tableID: "messtage-history-table",
    tableClass: "table table-border ",
    tableName: this.LT=='bn'?'কর্মচারীর তালিকা':'Employee List',
    tableRowIDInternalName: "ID",
    tableColDef: [
      { headerName: this.LT=='bn'?'কর্মচারীর আইডি':'Employee ID', width: '10%', internalName: 'EmployeeId', sort: true, type: "" },
      { headerName: this.LT=='bn'?'নাম (ইং)':'Name (Eng.)', width: '10%', internalName: 'Name', sort: true, type: "" },
      { headerName: this.LT=='bn'?'নাম (বাংলায়)':'Name (Bng.)', width: '10%', internalName: 'NameInBangla', sort: true, type: "" },
      { headerName: this.LT=='bn'?'পদবী':'Designation', width: '10%', internalName: 'RoleName', sort: false, type: "" },
      { headerName: this.LT=='bn'?'বর্তমান ঠিকানা':'Present Address', width: '20%', internalName: 'PresentAddress', sort: true, type: "" },
      { headerName: this.LT=='bn'?'স্থায়ী ঠিকানা':'Permanent Address', width: '20%', internalName: 'PermanentAddress', sort: true, type: "" },
      { headerName: this.LT=='bn'?'মোবাইল নম্বর':'Mobile Number', width: '20%', internalName: 'ContactNo', sort: true, type: "" },
      { headerName: this.LT=='bn'?'অবস্থা':'Status', width: '10%', internalName: 'Status', sort: true, type: "" }
    ],
    enabledSearch: true,
    enabledSerialNo: true,
    pageSize: 15,
    enabledPagination: true,
    enabledEditBtn: true,
    enabledCellClick: true,
    enabledColumnFilter:true,
  };

}
