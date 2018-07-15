import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { AlertService } from '../../../shared/modules/alert/alert.service'
import { CarService, CommonService, ConfigService } from '../../../shared/services'
import { CarDetails } from '../../../shared/model/car/car-details'
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-demand-list',
  templateUrl: './demand-list.component.html',
  styleUrls: ['./demand-list.component.scss'],
  animations: [routerTransition()]
})
export class DemandListComponent implements OnInit {

  public LT: string = ConfigService.languageType;
  public jobList: CarDetails[] = [];
  public UserId: number = 1;
  public UserInfo = JSON.parse(localStorage.getItem("car-system-user-info-option-b"));
  constructor(private alertService: AlertService, private carService: CarService, private router: Router) { }


  ngOnInit() {
    this.UserId = this.UserInfo[0].Id;
    this.fnGetBuses();
  }

  fnGetBuses() {
    this.alertService.fnLoading(true);
    this.carService.fnGetBuses(this.UserId).then(
      (data: CarDetails[]) => {
        this.jobList = data || [];
        this.alertService.fnLoading(false);
      },
      (error: any) => {
        this.alertService.fnLoading(false);
        this.alertService.alert(this.LT == 'bn' ? 'নেটওয়ার্ক সমস্যাটির কারণে সিস্টেমটি বাস তালিকা দেখাতে ব্যর্থ হয়েছে।' : 'System has failed to show bus list because of network problem.');
      }
    );
  }

  fnNewBus() {
    this.router.navigate(["./store/demand/0"]);
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
              this.fnGetBuses();
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
          this.router.navigate(["./store/jobs/" + data.CarId]);
        }
        , function () { })
    }
  }
  public jobListTableBind = {
    tableID: "messtage-history-table",
    tableClass: "table table-border ",
    tableName: this.LT == 'bn' ? 'চাহিদা তালিকা' : 'Demand List',
    tableRowIDInternalName: "CarId",
    tableColDef: [
      { headerName: this.LT == 'bn' ? 'চাহিদা নম্বর' : 'Job No ', width: '10%', internalName: 'JobNo', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'চাহিদার তারিখ' : 'Job Date ', width: '15%', internalName: 'JobDate', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'বাস নং' : 'Bus No', width: '20%', internalName: 'BusNo', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'মন্তব্য' : 'Remark', width: '10%', internalName: 'Remark', sort: false, type: "" },
      { headerName: this.LT == 'bn' ? 'মোট টাকার পরিমাণ' : 'Total Amount ', width: '10%', internalName: 'TotalAmount', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'নিষ্ক্রিয় হওয়ার কারণ' : 'Jobed By', width: '20%', internalName: 'JobedBy', sort: true, type: "" },
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