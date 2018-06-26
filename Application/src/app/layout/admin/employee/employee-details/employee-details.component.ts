import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../../router.animations';
import { AlertService } from '../../../../shared/modules/alert/alert.service'
import { AdminService, CommonService, ConfigService,CustomNgbDateParserFormatter } from '../../../../shared/services'
import { User } from '../../../../shared/model/admin'
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef, ModalDismissReasons,NgbDateParserFormatter,NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  providers: [CustomNgbDateParserFormatter],
  styleUrls: ['./employee-details.component.scss'],
  animations: [routerTransition()]
})
export class EmployeeDetailsComponent implements OnInit {

  public LT:string=ConfigService.languageType;
  public employeeId: number;
  public IsEditEmployee: boolean = false;
  public employeeDetails = new User();
  public UserInfo = JSON.parse(localStorage.getItem("car-system-user-info-option-b"));
  public userId=1;
  private modalRef: NgbModalRef;
  public  closeResult: string;
  public corpJoinDate:any=null;
  public depotJoinDate:any=null;
  public retirementDate:any=null;
  public dateOfBirth:any=null;
  constructor(private adminService: AdminService, private configService:ConfigService, private alertService: AlertService, private router: Router, private route: ActivatedRoute,private modalService: NgbModal,private ngbDateParserFormatter: NgbDateParserFormatter,private customNgbDateParserFormatter: CustomNgbDateParserFormatter) { }

  ngOnInit() {
    this.userId=this.UserInfo[0].Id;
    this.employeeId = this.route.snapshot.params["employeeId"];
    if (this.employeeId > 0) {
      this.IsEditEmployee = true;
      this.fnGetEmployeeDetails();
    } else {
      this.IsEditEmployee = false;
    }
  }

  fnGetEmployeeDetails() {
    this.alertService.fnLoading(true);
    this.adminService.fnGetEmployee(this.userId,this.employeeId).subscribe(
      (data: User[]) => {
        this.employeeDetails = data[0];
        this.corpJoinDate = this.customNgbDateParserFormatter.parse(this.employeeDetails.CorpJoinDate||null);
        this.depotJoinDate=this.customNgbDateParserFormatter.parse(this.employeeDetails.DepotJoinDate||null); 
        this.retirementDate=this.customNgbDateParserFormatter.parse(this.employeeDetails.RetirementDate||null); 
        this.dateOfBirth=this.customNgbDateParserFormatter.parse(this.employeeDetails.DateOfBirth||null);
        this.alertService.fnLoading(false);
      },
      (error: any) => {
        this.alertService.fnLoading(false);
        this.alertService.alert(this.LT=='bn'?'নেটওয়ার্ক সমস্যার কারণে সিস্টেম কর্মচারী দেখাতে ব্যর্থ হয়েছে।':'System has failed to show employee because of network problem.');
      }
    );
  }

  fnSaveUser() {
    //to check group name;
    if (this.employeeDetails.Name == null || this.employeeDetails.Name == "") {
      this.alertService.alert(this.LT=='bn'?'কর্মকর্তার নাম এবং কর্মচারী আইডি খালি রাখতে পারেন না।':'Employee name and employee ID can not be left blank.');
      return false;
    }
    if (this.employeeDetails.EmployeeId == null || this.employeeDetails.EmployeeId == "") {
      this.alertService.alert(this.LT=='bn'?'কর্মকর্তার নাম এবং কর্মচারী আইডি খালি রাখতে পারেন না।':'Employee name and employee ID can not be left blank.');
      return false;
    }

    //this.employeeDetails.Update = new Date().toISOString().slice(0, 19).replace('T', ' ');
    this.employeeDetails.Update = this.configService.getCurrentDate();
    this.employeeDetails.CreatedBy=this.userId;

    if (this.IsEditEmployee) {
      this.alertService.fnLoading(true);
      this.adminService.fnPostEmployee(this.employeeDetails).subscribe(
        (success: any) => {
          this.alertService.fnLoading(false);
          this.alertService.confirm(this.LT=='bn'?success.replace(/"/g,'')+' আপনি কর্মচারী তালিকায় ফিরে পেতে চান?':success.replace(/"/g,'')+' Do you want to back in employee list?'
            , () => {
              this.router.navigate(["./admin/employee"]);
            }
            , function () { });

        },
        (error: any) => {
          this.alertService.fnLoading(false);
          this.alertService.alert(this.LT=='bn'?'নেটওয়ার্ক সমস্যার কারণে সিস্টেম কর্মচারী দেখাতে ব্যর্থ হয়েছে।':'System has failed to show employee because of network problem.');
        }
      );
    } else {
      if (this.employeeDetails.Password == null || this.employeeDetails.ConfirmPassword == null) {
        this.alertService.alert(this.LT=='bn'?'পাসওয়ার্ড খালি রাখতে পারেন না।':'Password can not be left blank.');
        return false;
      }
      if (this.employeeDetails.Password != this.employeeDetails.ConfirmPassword) {
        this.alertService.alert(this.LT=='bn'?'পাসওয়ার্ড এবং নিশ্চিত পাসওয়ার্ড মিলছে না, দয়া করে পুনরায় টাইপ করুন।':'Password and conformed password can not match. Please type again');
        return false;
      }
      this.alertService.fnLoading(true);
      this.employeeDetails.Id=0;
      this.adminService.fnPostEmployee(this.employeeDetails).subscribe(
        (success: string) => {
          this.alertService.fnLoading(false);
          this.alertService.confirm(this.LT=='bn'?success.replace(/"/g,'')+' আপনি কর্মচারী তালিকায় ফিরে পেতে চান?':success.replace(/"/g,'')+' Do you want to back employee list'
            , () => {
              this.router.navigate(["./admin/employee"]);
            }
            , function () { });
        },
        (error: any) => {
          this.alertService.fnLoading(false);
          this.alertService.alert(this.LT=='bn'?'সিস্টেম নেটওয়ার্ক সমস্যা হওয়ার কারণে কর্মচারী দখানোর জন্য ব্যর্থ হয়েছে।':'System has failerd to connect due to internet problem');
        }
      );
    }
  }
  fnCreateNewProduct() {
    this.IsEditEmployee = false;
    this.employeeDetails = new User();
    this.employeeId = 0;
  }

 public modalType:string;
configureableModalData:any[]=[];
  fnGenerateModal(content, actionName: string) {
    this.alertService.fnLoading(true)
    this.modalType = "Role selection";
    //generate modal
    this.adminService.fnGetRoles(this.userId).subscribe((data: any) => {
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
  onSelectCorpJoinDate(date: any) {
    if (date != null) {
      this.employeeDetails.CorpJoinDate = this.ngbDateParserFormatter.format(date);
    }
  }

  onSelectDateOfBirth(date: any) {
    if (date != null) {
      this.employeeDetails.DateOfBirth = this.ngbDateParserFormatter.format(date);
      //var date1 = new Date( this.employeeDetails.DateOfBirth);
      //console.log(date1.getMonth(),date1.getDay(),date.month);
      this.employeeDetails.RetirementDate=date.year+65+'-'+date.month+'-'+date.day;
      this.retirementDate=this.customNgbDateParserFormatter.parse( this.employeeDetails.RetirementDate||null);

    }
  }

  onSelectDepotJoinDate(date: any) {
    if (date != null) {
      this.employeeDetails.DepotJoinDate = this.ngbDateParserFormatter.format(date);
    }
  }
  
  onSelectRetirementDateDate(date: any) {
    if (date != null) {
      this.employeeDetails.RetirementDate = this.ngbDateParserFormatter.format(date);
    }
  }


  fnPtableModalCallBack(event: any) {
    console.log("event", event);
    if (this.modalType == "Role selection") {
      this.employeeDetails.RoleId = event.record.RoleId;
      this.employeeDetails.RoleName = event.record.Name;
    }
    this.modalRef.close();
  }
  public configureableModalTable = {
    tableID: "messtage-history-table",
    tableClass: "table table-border ",
    tableName: this.LT=='bn'?'কর্মচারীর উপাধি নির্বাচন করুন':'Select Employee Role ',
    tableRowIDInternalName: "ID",
    tableColDef: [
      { headerName: this.LT=='bn'?'উপাধি':'Role Title ', width: '40%', internalName: 'Name', sort: true, type: "" },
      { headerName: this.LT=='bn'?'প্রস্তুতকারী':'Created By', width: '45%', internalName: 'CreatedByName', sort: true, type: "" },
    ],
    enabledSearch: true,
    pageSize: 20,
    enabledPagination: false,
    enabledRadioBtn: true,
    enabledAutoScrolled: true,
    enabledCellClick: true,
    pTableStyle: {
      tableOverflowY: true,
      overflowContentHeight: '460px'
    }
  };
}
