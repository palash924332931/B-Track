import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../../router.animations';
import { AlertService } from '../../../../shared/modules/alert/alert.service'
import { AdminService, CommonService, ConfigService, CustomNgbDateParserFormatter } from '../../../../shared/services'
import { Vendor } from '../../../../shared/model/store/verdor'
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-demand-details',
  templateUrl: './demand-details.component.html',
  styleUrls: ['./demand-details.component.scss'],
  animations: [routerTransition()]
})
export class DemandDetailsComponent implements OnInit {

  public LT: string = ConfigService.languageType;
  public vendorId: number;
  public IsEdit: boolean = false;
  public vendorDetails = new Vendor();
  public UserInfo = JSON.parse(localStorage.getItem("car-system-user-info-option-b"));
  public userId = 1;
  constructor(private adminService: AdminService, private configService: ConfigService, private alertService: AlertService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.userId = this.UserInfo[0].Id;
    this.vendorId = this.route.snapshot.params["employeeId"];
    if (this.vendorId > 0) {
      this.IsEdit = true;
      this.fnGetEmployeeDetails();
    } else {
      this.IsEdit = false;
    }
  }

  fnGetEmployeeDetails() {
    this.alertService.fnLoading(true);
    this.adminService.fnGetEmployee(this.userId, this.vendorId).subscribe(
      (data: Vendor[]) => {
        this.vendorDetails = data[0];
        this.alertService.fnLoading(false);
      },
      (error: any) => {
        this.alertService.fnLoading(false);
        this.alertService.alert(this.LT == 'bn' ? 'নেটওয়ার্ক সমস্যার কারণে সিস্টেম কর্মচারী দেখাতে ব্যর্থ হয়েছে।' : 'System has failed to show employee because of network problem.');
      }
    );
  }

  fnSaveVendor() {
    // //to check group name;
    // if (this.employeeDetails.Name == null || this.employeeDetails.Name == "") {
    //   this.alertService.alert(this.LT=='bn'?'কর্মকর্তার নাম এবং কর্মচারী আইডি খালি রাখতে পারেন না।':'Employee name and employee ID can not be left blank.');
    //   return false;
    // }
    // if (this.employeeDetails.EmployeeId == null || this.employeeDetails.EmployeeId == "") {
    //   this.alertService.alert(this.LT=='bn'?'কর্মকর্তার নাম এবং কর্মচারী আইডি খালি রাখতে পারেন না।':'Employee name and employee ID can not be left blank.');
    //   return false;
    // }

    // //this.employeeDetails.Update = new Date().toISOString().slice(0, 19).replace('T', ' ');
    // this.employeeDetails.Update = this.configService.getCurrentDate();
    // this.employeeDetails.CreatedBy=this.userId;

    // if (this.IsEditEmployee) {
    //   this.alertService.fnLoading(true);
    //   this.adminService.fnPostEmployee(this.employeeDetails).subscribe(
    //     (success: any) => {
    //       this.alertService.fnLoading(false);
    //       this.alertService.confirm(this.LT=='bn'?success.replace(/"/g,'')+' আপনি কর্মচারী তালিকায় ফিরে পেতে চান?':success.replace(/"/g,'')+' Do you want to back in employee list?'
    //         , () => {
    //           this.router.navigate(["./admin/employee"]);
    //         }
    //         , function () { });

    //     },
    //     (error: any) => {
    //       this.alertService.fnLoading(false);
    //       this.alertService.alert(this.LT=='bn'?'নেটওয়ার্ক সমস্যার কারণে সিস্টেম কর্মচারী দেখাতে ব্যর্থ হয়েছে।':'System has failed to show employee because of network problem.');
    //     }
    //   );
    // } else {
    //   if (this.employeeDetails.Password == null || this.employeeDetails.ConfirmPassword == null) {
    //     this.alertService.alert(this.LT=='bn'?'পাসওয়ার্ড খালি রাখতে পারেন না।':'Password can not be left blank.');
    //     return false;
    //   }
    //   if (this.employeeDetails.Password != this.employeeDetails.ConfirmPassword) {
    //     this.alertService.alert(this.LT=='bn'?'পাসওয়ার্ড এবং নিশ্চিত পাসওয়ার্ড মিলছে না, দয়া করে পুনরায় টাইপ করুন।':'Password and conformed password can not match. Please type again');
    //     return false;
    //   }
    //   this.alertService.fnLoading(true);
    //   this.employeeDetails.Id=0;
    //   this.adminService.fnPostEmployee(this.employeeDetails).subscribe(
    //     (success: string) => {
    //       this.alertService.fnLoading(false);
    //       this.alertService.confirm(this.LT=='bn'?success.replace(/"/g,'')+' আপনি কর্মচারী তালিকায় ফিরে পেতে চান?':success.replace(/"/g,'')+' Do you want to back employee list'
    //         , () => {
    //           this.router.navigate(["./admin/employee"]);
    //         }
    //         , function () { });
    //     },
    //     (error: any) => {
    //       this.alertService.fnLoading(false);
    //       this.alertService.alert(this.LT=='bn'?'সিস্টেম নেটওয়ার্ক সমস্যা হওয়ার কারণে কর্মচারী দখানোর জন্য ব্যর্থ হয়েছে।':'System has failerd to connect due to internet problem');
    //     }
    //   );
    // }
  }
  fnCreateNewProduct() {
    this.IsEdit = false;
    this.vendorDetails = new Vendor();
    this.vendorId = 0;
  }


  fnPtableCallBack(event: any) {
    let data = event.record;
    if (event.action == "delete-item") {
      this.alertService.confirm(this.LT == 'bn' ? 'আপনি কি <b>' + data.RegistrationNo + '</b> বাসের তথ্য মুছে ফেলতে চান? ' : 'Do you want to delete bus which registration no <b>' + data.RegistrationNo + "</b>?",
        () => {
          this.alertService.fnLoading(true);
          // this.carService.fnDeleteBus(data.CarId).subscribe(
          //   (success: any) => {
          //     this.alertService.fnLoading(false);
          //     this.fnGetVendors();             
          //   },
          //   (error: any) => {
          //     this.alertService.fnLoading(false);
          //     this.alertService.alert(this.LT == 'bn' ? 'সিস্টেম কর্মচারী তথ্য মুছে ফেলতে ব্যর্থ হয়েছে। অনুগ্রহপূর্বক আবার চেষ্টা করুন.' : 'System has failed to delete employee information. Please try again.');
          //   }
          // );
        }
        , function () { })
    } else if (event.action == "edit-item") {
      this.alertService.confirm(this.LT == 'bn' ? 'আপনি কি <b>' + data.RegistrationNo + '</b> বাস সম্পাদনা করতে চান?' : 'Do you want to edit information of bus <b>' + data.RegistrationNo + "</b>?",
        () => {
          this.router.navigate(["./car/car-list/" + data.CarId]);
        }
        , function () { })
    }
  }
  public jobItemList: any[] = [];

  public jobItemListTableBind = {
    tableID: "messtage-history-table",
    tableClass: "table table-border ",
    tableName: this.LT == 'bn' ? 'যন্ত্রাংশের  তালিকা' : 'List of Parts',
    tableRowIDInternalName: "CarId",
    tableColDef: [
      { headerName: this.LT == 'bn' ? 'যন্ত্রাংশের  নাম' : 'Parts Name ', width: '15%', internalName: 'ItemName', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'যন্ত্রাংশের মুল্য' : 'Unit Price ', width: '20%', internalName: 'UnitPrice', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'একক' : 'Units', width: '20%', internalName: 'Units', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'যন্ত্রাংশের পরিমাণ' : 'Quantity', width: '10%', internalName: 'Quantity', sort: false, type: "" },
      { headerName: this.LT == 'bn' ? 'ব্যবহারযোগ্য' : 'Balance', width: '20%', internalName: 'Balance', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'অবস্থা' : 'Status', width: '15%', internalName: 'Status', sort: true, type: "" }
    ],
    enabledSearch: false,
    enabledSerialNo: true,
    pageSize: 15,
    enabledPagination: true,
    enabledEditBtn: true,
    enabledCellClick: true,
    enabledColumnFilter: true,
  };
}

