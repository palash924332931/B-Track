import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { AlertService } from '../../../shared/modules/alert/alert.service'
import { Driver } from '../../../shared/model/car'
import { CarService, CommonService, ConfigService } from '../../../shared/services'
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.scss'],
  animations: [routerTransition()]
})
export class DriverComponent implements OnInit {

  public driverList: Driver[] = [];
  public userId=1;
  public UserInfo = JSON.parse(localStorage.getItem("car-system-user-info-option-b"));
  public LT:string=ConfigService.languageType;
  constructor(private alertService: AlertService, private carService: CarService, private router: Router) { }

  
  ngOnInit() {
    this.userId=this.UserInfo[0].Id;
    this.fnGetDrives();
  }

  fnGetDrives() {
    this.alertService.fnLoading(true);
    this.carService.fnGetDrivers(this.userId).then(
      (data: Driver[]) => {
        this.driverList = data || [];
        this.alertService.fnLoading(false);
      },
      (error: any) => {
        this.alertService.fnLoading(false);
        this.alertService.alert(this.LT=='bn'?'নেটওয়ার্ক সমস্যাটির কারণে সিস্টেমটি চালকের তালিকা প্রদর্শন করতে ব্যর্থ হয়েছে।':'System has failed to show driver list because of network problem.');
      }
    );
  }

  fnNewDriver () {
    this.router.navigate(["./car/driver/0"]);
  }

  fnPtableCallBack(event: any) {
    let data = event.record;
    if (event.action == "delete-item") {
      this.alertService.confirm(this.LT=='bn'?'আপনি কি <b>'+data.Name+'</b> চালকের তথ্য মুছে ফেলতে চান?':'Do you want to delete driver ' + data.Name + "?",
        () => {
          this.alertService.fnLoading(true);
          this.carService.fnDeleteDriver(data.DriverId).subscribe(
            (success: any) => {
              this.alertService.fnLoading(false);
              this.alertService.alert(success);
              this.fnGetDrives();
            },
            (error: any) => {
              this.alertService.alert(this.LT=='bn'?'সিস্টেম চালকের তথ্য মুছে ফেলতে ব্যর্থ হয়েছে। অনুগ্রহপূর্বক আবার চেষ্টা করুন.':'System has failed to delete driver information. Please try again.');
            }
          );
        }
        , function () { })
    } else if (event.action == "edit-item") {
      this.alertService.confirm(this.LT=='bn'?'আপনি কি <b>'+data.Name+'</b> চালকের তথ্য সম্পাদনা করতে চান?':'Do you want to edit driver' + data.Name + "?",
        () => {
          this.router.navigate(["./car/driver/" + data.DriverId]);
        }
        , function () { })
    }
  }  

  public driverTableBind = {
    tableID: "messtage-history-table",
    tableClass: "table table-border ",
    tableName: this.LT=='bn'?'চালকের তালিকা':'Driver List ',
    tableRowIDInternalName: "CarTypeId",
    tableColDef: [
      { headerName: this.LT=='bn'?'কর্মচারীর আইডি':'Employee Id ', width: '10%', internalName: 'EmployeeId', sort: true, type: "" },
      { headerName: this.LT=='bn'?'চালকের নাম (ইং)':'Name (Eng)', width: '10%', internalName: 'Name', sort: true, type: "" },
      { headerName: this.LT=='bn'?'নাম (বাংলা)':'Name (Bng)', width: '10%', internalName: 'NameInBangla', sort: true, type: "" },
      { headerName: this.LT=='bn'?'মোবাইল নম্বর':'Contact No', width: '10%', internalName: 'ContactNo', sort: true, type: "" },
      { headerName: this.LT=='bn'?'ড্রাইভিং লাইসেন্স':'Driving License', width: '10%', internalName: 'DrivingLicense', sort: true, type: "" },
      { headerName: this.LT=='bn'?'বর্তমান ঠিকানা':'Present Address', width: '20%', internalName: 'PresentAddress', sort: true, type: "" },
      { headerName: this.LT=='bn'?'ডিপোতে যোগদানের তাং':'Depot Join Date', width: '20%', internalName: 'DepotJoinDate', sort: true, type: "" },
      //{ headerName: this.LT=='bn'?'সাহায্যকারীর নাম':'Helper Name', width: '10%', internalName: 'HelperName', sort: true, type: "" },
      //{ headerName: this.LT=='bn'?'সাহায্যকারীর মোবাইল নম্বর':'Helper ContactNo', width: '10%', internalName: 'HelperContactNo', sort: true, type: "" },
      { headerName: this.LT=='bn'?'রেফারেন্স':'Reference', width: '20%', internalName: 'Reference', sort: true, type: "" },
      { headerName: this.LT=='bn'?'অবস্থা':'Status', width: '10%', internalName: 'Status', sort: true, type: "" },
    ],
    enabledSearch: true,
    pageSize: 25,
    enabledPagination: true,
    enabledEditBtn: true,
    enabledCellClick: true,
    enabledColumnFilter:true,
  };

}
