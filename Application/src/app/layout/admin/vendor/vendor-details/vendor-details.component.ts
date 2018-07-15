import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../../router.animations';
import { AlertService } from '../../../../shared/modules/alert/alert.service'
import { AdminService, CommonService, ConfigService,CustomNgbDateParserFormatter } from '../../../../shared/services'
import { Vendor } from '../../../../shared/model/store/verdor'
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vendor-details',
  templateUrl: './vendor-details.component.html',
  styleUrls: ['./vendor-details.component.scss'],
  animations: [routerTransition()]
})
export class VendorDetailsComponent implements OnInit {

  public LT:string=ConfigService.languageType;
  public vendorId: number;
  public IsEdit: boolean = false;
  public vendorDetails = new Vendor();
  public UserInfo = JSON.parse(localStorage.getItem("car-system-user-info-option-b"));
  public userId=1;
  constructor(private adminService: AdminService, private configService:ConfigService, private alertService: AlertService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.userId=this.UserInfo[0].Id;
    this.vendorId = this.route.snapshot.params["vendorId"]||0;
    if (this.vendorId > 0) {
      this.IsEdit = true;
      this.fnGetVendor();
    } else {
      this.IsEdit = false;
    }
  }

  fnGetVendor() {
    this.alertService.fnLoading(true);
    this.adminService.fnGetVendor(this.userId,this.vendorId,'Single').subscribe(
      (data: Vendor[]) => {
        this.vendorDetails = data[0];        
        this.alertService.fnLoading(false);
      },
      (error: any) => {
        this.alertService.fnLoading(false);
        this.alertService.alert(this.LT == 'bn' ? 'তথ্য দেখাতে ব্যর্থ হয়েছে। অনুরোধ করে আবার চেষ্টা করুন' : 'System has failed to show vendor list. Please try again.');
      }
    );
  }

  fnSaveVendor() {
    // //to check vendor name;
    if (this.vendorDetails.Name == null || this.vendorDetails.Name == "") {
      this.alertService.alert(this.LT=='bn'?'অনুগ্রহপুর্বক সরবরাহকারী প্রতিষ্ঠানের নাম প্রদান করুন।':'Please check vendor name again.');
      return false;
    }
    if (this.vendorDetails.ContactPerson == null || this.vendorDetails.ContactPerson == "") {
      this.alertService.alert(this.LT=='bn'?'পার্টির যে ব্যক্তির সাথে যোগাযোগ করবেন তার নাম এবং মোবাইল নং তথ্য প্রদান করুন।':'Contact person and contact number can not be blank. Please review again.');
      return false;
    }

   
     this.vendorDetails.CreatedBy=this.userId;

    if (this.IsEdit) {

    }
      this.alertService.fnLoading(true);
      this.adminService.fnPostVendor(this.vendorDetails).subscribe(
        (success: any) => {
          this.alertService.fnLoading(false);
          this.alertService.confirm(this.LT=='bn'?success._body.replace(/"/g,"")+' আপনি সরবরাহকারী প্রতিষ্ঠানের তালিকায় ফিরে যেতে চান?':success._body.replace(/"/g,"")+' Do you want to back in vendor list?'
            , () => {
              this.router.navigate(["./admin/vendor"]);
            }
            , function () { });

        },
        (error: any) => {
          this.alertService.fnLoading(false);
          this.alertService.alert(this.LT=='bn'?'নেটওয়ার্ক সমস্যার কারণে সিস্টেম তথ্য সংরক্ষন করতে ব্যর্থ হয়েছে।':'System has failed to save vendor information. Please try again.');
        }
      );
  }

  fnCreateNewRecord() {
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
  

  public jobItemListTableBind = {
    tableID: "messtage-history-table",
    tableClass: "table table-border ",
    tableName: this.LT == 'bn' ? 'পার্টির তালিকা' : 'List of Vendor',
    tableRowIDInternalName: "CarId",
    tableColDef: [
      { headerName: this.LT == 'bn' ? 'পার্টির নাম' : 'Name ', width: '15%', internalName: 'Name', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'পার্টির ঠিকানা' : 'Address ', width: '20%', internalName: 'Address', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'পরিচিত ব্যক্তি' : 'Contact Person', width: '20%', internalName: 'ContactPerson', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'ফোন নং' : 'Contact No', width: '10%', internalName: 'ContactNo', sort: false, type: "" },
      { headerName: this.LT == 'bn' ? 'মন্তব্য' : 'Remark', width: '20%', internalName: 'Remark', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'অবস্থা' : 'Status', width: '15%', internalName: 'Status', sort: true, type: "" }
    ],
    enabledSearch: true,
    enabledSerialNo: true,
    pageSize: 15,
    enabledPagination: true,
    enabledEditBtn: true,
    enabledCellClick: true,
    enabledColumnFilter: true,
  };
}

