import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { AlertService } from '../../../shared/modules/alert/alert.service'
import { CarService, CommonService, ConfigService,AdminService } from '../../../shared/services'
import { Vendor } from '../../../shared/model/store/verdor'
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.scss'],
  animations: [routerTransition()]
})
export class VendorComponent implements OnInit {

  public LT: string = ConfigService.languageType;
  public vendorList: Vendor[] = [];
  public UserId: number = 1;
  public UserInfo = JSON.parse(localStorage.getItem("car-system-user-info-option-b"));
  constructor(private alertService: AlertService, private carService: CarService,private adminService:AdminService, private router: Router) { }


  ngOnInit() {
    this.UserId = this.UserInfo[0].Id;
    this.fnGetVendors();
  }

  fnGetVendors() {
    this.alertService.fnLoading(true);
    this.adminService.fnGetVendor(this.UserId,0,'All').subscribe(
      (data: Vendor[]) => {
        this.vendorList = data || [];
        this.alertService.fnLoading(false);
      },
      (error: any) => {
        this.alertService.fnLoading(false);
        this.alertService.alert(this.LT == 'bn' ? 'তথ্য দেখাতে ব্যর্থ হয়েছে। অনুরোধ করে আবার চেষ্টা করুন' : 'System has failed to show vendor list. Please try again.');
      }
    );
  }

  fnNewVendor() {
    this.router.navigate(["./admin/vendor/0"]);
  } 

  fnPtableCallBack(event: any) {
    let data = event.record;
    if (event.action == "delete-item") {
      this.alertService.confirm(this.LT == 'bn' ? 'আপনি কি <b>' + data.Name + '</b> সরবরাহকারী প্রতিষ্ঠানের তথ্য মুছে ফেলতে চান? ' : 'Do you want to delete vendor information  which registration no <b>' + data.Name + "</b>?",
        () => {
          this.alertService.fnLoading(true);
          this.adminService.fnDeleteVendor(data.VendorId,this.UserId).subscribe(
            (success: any) => {
              this.alertService.fnLoading(false);
              this.fnGetVendors();           
            },
            (error: any) => {
              this.alertService.fnLoading(false);
              this.alertService.alert(this.LT == 'bn' ? 'সিস্টেম সরবরাহকারী প্রতিষ্ঠানের তথ্য মুছে ফেলতে ব্যর্থ হয়েছে। অনুগ্রহপূর্বক আবার চেষ্টা করুন.' : 'System has failed to delete vendor information. Please try again.');
            }
          );
        }
        , function () { })
    } else if (event.action == "edit-item") {
      this.alertService.confirm(this.LT == 'bn' ? 'আপনি কি <b>' + data.Name + '</b> সরবরাহকারী প্রতিষ্ঠানের তথ্য সম্পাদনা করতে চান?' : 'Do you want to edit information of vendor <b>' + data.Name + "</b>?",
        () => {
          this.router.navigate(["./admin/vendor/" + data.VendorId]);
        }
        , function () { })
    }
  }
  public vendorListTableBind = {
    tableID: "messtage-history-table",
    tableClass: "table table-border ",
    tableName: this.LT == 'bn' ? 'সরবরাহকারী প্রতিষ্ঠানের তালিকা' : ' Vendor List',
    tableRowIDInternalName: "CarId",
    tableColDef: [
      { headerName: this.LT == 'bn' ? 'প্রতিষ্ঠানের নাম' : 'Name ', width: '10%', internalName: 'Name', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'প্রতিষ্ঠানের ঠিকানা' : 'Address ', width: '15%', internalName: 'Address', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'প্রতিনিধির নাম' : 'Contact Person', width: '15%', internalName: 'ContactPerson', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'প্রতিনিধির ফোন নং' : 'Contact No', width: '15%', internalName: 'ContactNo', sort: false, type: "" },
      { headerName: this.LT == 'bn' ? 'মন্তব্য' : 'Remark', width: '15%', internalName: 'Remark', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'সরবরাহকৃত মালের ধরন' : 'Product Category', width: '10%', internalName: 'ActivityType', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'প্রতিষ্ঠানের টিন নং' : 'TIN No', width: '10%', internalName: 'TINNo', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'অবস্থা' : 'Status', width: '10%', internalName: 'Status', sort: true, type: "" }
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

