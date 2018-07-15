import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { AlertService } from '../../../shared/modules/alert/alert.service'
import { CarService, CommonService, ConfigService } from '../../../shared/services'
import { CarDetails } from '../../../shared/model/car/car-details'
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import * as jspdf from 'jspdf';
//declare var jspdf:any;
@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.scss'],
  animations: [routerTransition()]
})
export class CarListComponent implements OnInit {

  public LT: string = ConfigService.languageType;
  public busList: CarDetails[] = [];
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
        this.busList = data || [];
        this.alertService.fnLoading(false);
      },
      (error: any) => {
        this.alertService.fnLoading(false);
        this.alertService.alert(this.LT == 'bn' ? 'নেটওয়ার্ক সমস্যাটির কারণে সিস্টেমটি বাস তালিকা দেখাতে ব্যর্থ হয়েছে।' : 'System has failed to show bus list because of network problem.');
      }
    );
  }

  fnNewBus() {
    this.router.navigate(["./car/car-list/0"]);
  }

  fnDownloadCarList() {
    this.carService.fnDownloadBusList('1');
  }

  fnPtableCallBack(event: any) {
    let data = event.record;
    if (event.action == "delete-item") {
      this.alertService.confirm(this.LT == 'bn' ? 'আপনি কি <b>' + data.RegistrationNo + '</b> গাড়ির তথ্য মুছে ফেলতে চান? ' : 'Do you want to delete Car which registration no <b>' + data.RegistrationNo + "</b>?",
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
              this.alertService.alert(this.LT == 'bn' ? 'সিস্টেম গাড়ির তথ্য মুছে ফেলতে ব্যর্থ হয়েছে। অনুগ্রহপূর্বক আবার চেষ্টা করুন.' : 'System has failed to delete Car information. Please try again.');
            }
          );
        }
        , function () { })
    } else if (event.action == "edit-item") {
      this.alertService.confirm(this.LT == 'bn' ? 'আপনি কি <b>' + data.RegistrationNo + '</b> গাড়ির তথ্য সম্পাদনা করতে চান?' : 'Do you want to edit information of Car <b>' + data.RegistrationNo + "</b>?",
        () => {
          this.router.navigate(["./car/car-list/" + data.CarId]);
        }
        , function () { })
    }
  }
  public busListTableBind = {
    tableID: "messtage-history-table",
    tableClass: "table table-border ",
    tableName: this.LT == 'bn' ? 'গাড়ির তালিকা' : 'Car List',
    tableRowIDInternalName: "CarId",
    tableColDef: [
      { headerName: this.LT == 'bn' ? 'নিবন্ধন নম্বর' : 'Reg No ', width: '10%', internalName: 'RegistrationNo', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'নিবন্ধনের তারিখ' : 'Reg. Date ', width: '15%', internalName: 'RegistrationDate', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'গাড়ির প্রকার' : 'Car Type', width: '20%', internalName: 'Type', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'প্রথম রুটের তারিখ' : 'On Root Date', width: '10%', internalName: 'OnRootDate', sort: false, type: "" },
      { headerName: this.LT == 'bn' ? 'সিটের সংখ্যা' : 'No. of Seat ', width: '10%', internalName: 'NoOfSeat', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'নিষ্ক্রিয় হওয়ার কারণ' : 'Reason For Inactive', width: '20%', internalName: 'ReasonForStop', sort: true, type: "" },
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
