import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { AlertService } from '../../../shared/modules/alert/alert.service'
import { CarService, CommonService, ConfigService,StoreService } from '../../../shared/services'
import { CarDetails } from '../../../shared/model/car/car-details'
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
  animations: [routerTransition()]
})
export class ItemListComponent implements OnInit {

  public LT: string = ConfigService.languageType;
  public partsList: any[] = [];
  public UserId: number = 1;
  public UserInfo = JSON.parse(localStorage.getItem("car-system-user-info-option-b"));
  constructor(private alertService: AlertService, private carService: CarService, private router: Router,private storeService:StoreService) { }


  ngOnInit() {
    this.UserId = this.UserInfo[0].Id;
    this.fnGetPartsList();
  }

  fnGetPartsList() {
    this.alertService.fnLoading(true);
    this.storeService.fnGetPatsList(this.UserId).subscribe(
      (data: any[]) => {
        this.partsList = data || [];
        this.alertService.fnLoading(false);
      },
      (error: any) => {
        this.alertService.fnLoading(false);
        this.alertService.alert(this.LT == 'bn' ? 'নেটওয়ার্ক সমস্যাটির কারণে সিস্টেমটি বাস তালিকা দেখাতে ব্যর্থ হয়েছে।' : 'System has failed to show bus list because of network problem.');
      }
    );
  }

  fnNew() {
    this.router.navigate(["./store/items/0"]);
  }

  fnDownloadCarList() {
    this.carService.fnDownloadBusList('1');
  }

  fnPtableCallBack(event: any) {
    let data = event.record;
    if (event.action == "delete-item") {
      this.alertService.confirm(this.LT == 'bn' ? 'আপনি কি <b>' + data.RegistrationNo + '</b> বাসের তথ্য মুছে ফেলতে চান? ' : 'Do you want to delete bus which registration no <b>' + data.RegistrationNo + "</b>?",
        () => {
          this.alertService.fnLoading(true);
          this.carService.fnDeleteBus(data.CarId).subscribe(
            (success: any) => {
              this.alertService.fnLoading(false);
              this.fnGetPartsList();
              //this.alertService.alertResponeCode(success);               
            },
            (error: any) => {
              this.alertService.fnLoading(false);
              this.alertService.alert(this.LT == 'bn' ? 'সিস্টেম কর্মচারী তথ্য মুছে ফেলতে ব্যর্থ হয়েছে। অনুগ্রহপূর্বক আবার চেষ্টা করুন.' : 'System has failed to delete employee information. Please try again.');
            }
          );
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
  public partsListTableBind = {
    tableID: "parts-table",
    tableClass: "table table-border ",
    tableName: this.LT == 'bn' ? 'গাড়ির যন্ত্রাংশের তালিকা' : 'List of Parts',
    tableRowIDInternalName: "CarId",
    tableColDef: [
      { headerName: this.LT == 'bn' ? 'যন্ত্রাংশের কোড' : 'Parts Code ', width: '10%', internalName: 'PartsCode', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'যন্ত্রাংশের তারিখ' : 'Parts Name ', width: '15%', internalName: 'PartsName', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'যন্ত্রাংশের বিবরন' : 'Parts Description', width: '20%', internalName: 'PartsDescription', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'যন্ত্রাংশের ধরন' : 'Parts Size', width: '10%', internalName: 'PartsSize', sort: false, type: "" },
      { headerName: this.LT == 'bn' ? 'ব্র্যান্ড ' : 'Brand ', width: '10%', internalName: 'Brand', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'একক মূল্য' : 'Unit Price', width: '20%', internalName: 'UnitPrice', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'একক' : 'Units', width: '20%', internalName: 'Units', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'ব্যবহারযোগ্য' : 'Balance', width: '15%', internalName: 'Balance', sort: true, type: "" },      
    ],
    enabledSearch: true,
    enabledSerialNo: true,
    pageSize: 15,
    enabledPagination: true,
    enabledEditBtn: false,
    enabledCellClick: true,
    enabledColumnFilter: true,
  };
}

