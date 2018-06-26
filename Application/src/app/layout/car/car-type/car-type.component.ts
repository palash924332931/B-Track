import { Component, OnInit,ViewChild } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { AlertService } from '../../../shared/modules/alert/alert.service'
import { CarType } from '../../../shared/model/car/car-type'
import { CarService, CommonService, ConfigService } from '../../../shared/services'
import { NgbModal, NgbModalRef, ModalDismissReasons, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-car-type',
  templateUrl: './car-type.component.html',
  styleUrls: ['./car-type.component.scss'],
  animations: [routerTransition()]
})
export class CarTypeComponent implements OnInit {
  @ViewChild('content') public childModal:any;
  public UserInfo = JSON.parse(localStorage.getItem("car-system-user-info-option-b"));
  public UserId = 1;
  public LT: string = ConfigService.languageType;
  public IsEditItem: boolean = false;
  public carTypeList: any[];
  public carTypes = new CarType();
  private modalRef: NgbModalRef;
  public closeResult: string;
  constructor(private carService: CarService, private configService:ConfigService, private alertService: AlertService, private modalService: NgbModal) {

  }

  ngOnInit() {
    this.UserId = this.UserInfo[0].Id;
    this.fnGetCarTypes();
  }

  fnGetCarTypes() {
    this.alertService.fnLoading(true);
    this.IsEditItem = false;
    this.carService.fnGetCarTypes(this.UserId).then(
      (data: any[]) => {
        console.log(data);
        this.carTypeList = data || [];
        this.alertService.fnLoading(false);
      },
      (error: any) => {
        console.log("error", error);
        this.alertService.fnLoading(false);
        this.alertService.alert(this.LT == 'bn' ? 'সিস্টেমটি বাসের ধরন লোড করতে ব্যর্থ হয়েছে। অ্যাডমিনের সাথে যোগাযোগ করুন দয়া করে।' : 'System has failed to load bus type. Please contact with admin.');
        return false;
      }
    );
  }

  fnAddCarType() {
    if (this.carTypes.Type == null || this.carTypes.Type.trim() == "") {
      this.alertService.alert(this.LT == 'bn' ? 'গাড়ির প্রকার প্রয়োজন। দয়া করে পুনরায় গাড়ির প্রকার ক্ষেত্র পর্যালোচনা করুন।' : 'Bus type is required. Please review bus type field again.');
      return false;
    }

    if (this.IsEditItem != true) {
      var date = new Date();
      //let LastUpdate = new Date().toISOString().slice(0, 19).replace('T', ' ');
      let LastUpdate = this.configService.getCurrentDate();
      this.carTypes.UpdatedTime = LastUpdate;
      this.carTypes.CreatedBy = this.UserId;
      this.carTypes.CarTypeId = 0;
      this.carService.fnPostsCarType(this.carTypes).subscribe(
        (success: any) => {
          console.log("success", success);
          this.carTypes = new CarType();
          this.alertService.alert(success._body.replace(/"/g,''),
            () => {
              this.fnGetCarTypes();
            });
        },
        (error: any) => {
          this.alertService.alert(this.LT == 'bn' ? 'সিস্টেম গাড়ির প্রকার তথ্য সংরক্ষণ করতে ব্যর্থ হয়েছে। অনুগ্রহপূর্বক আবার চেষ্টা করুন.' : 'System has failed to save bus type information. Please try again.');
        });
    } else if (this.IsEditItem == true) {
      var date = new Date();
      //let LastUpdate = new Date().toISOString().slice(0, 19).replace('T', ' ');
      let LastUpdate =this.configService.getCurrentDate();
      this.carTypes.UpdatedTime = LastUpdate;
      this.carService.fnPostsCarType(this.carTypes).subscribe(
        (success: any) => {
          console.log("success", success);
          this.carTypes = new CarType();
          this.alertService.alert(success._body.replace(/"/g,''),
            () => {
              this.fnGetCarTypes();
            });
        },
        (error: any) => {
          this.alertService.alert(this.LT == 'bn' ? 'সিস্টেম গাড়ির প্রকার তথ্য আপডেট করতে ব্যর্থ হয়েছে। অনুগ্রহপূর্বক আবার চেষ্টা করুন.' : 'System has failed to update bus type information. Please try again.');
        });

    }

  }

  fnPtableCallBack(event: any) {
    var data = event.record;
    if (event.action == "delete-item") {
      this.alertService.confirm(this.LT == 'bn' ? 'আপনি কি গাড়ির প্রকার <b>' + data.Type + '</b>  মুছে ফেলতে চান?' : 'Do you want to delete bus type <b>' + data.Type + '</b>?',
        () => {//confirm click
          this.carService.fnDeleteCarType(data.CarTypeId).subscribe(
            (success: any) => {
              this.fnGetCarTypes();
            },
            (error: any) => {
              this.alertService.alert(this.LT == 'bn' ? 'সিস্টেম গাড়ির প্রকার তথ্যটি মুছে ফেলতে ব্যর্থ হয়েছে। অনুগ্রহপূর্বক আবার চেষ্টা করুন.' : 'System has failed to delete type information. Please try again.');
            }
          );
        },
        () => { });
    } else if (event.action == "edit-item") {
      this.IsEditItem = true;
      this.carTypes = data;
    }

  }

  fnReadyForNewRecord() {
    this.IsEditItem = false;
    this.carTypes = new CarType();
  }

  public carTypeTableBind = {
    tableID: "messtage-history-table",
    tableClass: "table table-border ",
    tableName: this.LT == 'bn' ? 'গাড়ির প্রকার তালিকা' : 'List of Bus Types ',
    tableRowIDInternalName: "CarTypeId",
    tableColDef: [
      { headerName: this.LT == 'bn' ? 'গাড়ির প্রকার' : 'Type ', width: '30%', internalName: 'Type', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'গাড়ির বিবরণ' : 'Description', width: '30%', internalName: 'Description', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'গাড়ির সংখ্যা' : 'Number of Buses', width: '30%', internalName: 'NoOfCar', sort: true, type: "button", onClick: "Yes" },
    ],
    enabledSearch: true,
    pageSize: 25,
    enabledPagination: true,
    enabledEditBtn: true,
    enabledCellClick: true,
    enabledColumnFilter: true,
  };



  public modalType: string;
  configureableModalData: any[] = [];
  fnPtableCellClick(event: any) {
    let record=event.record;
    if(event.cellName=='NoOfCar'){
      this.carService.fnGetBusesOnType(this.UserId,event.record.CarTypeId).then((data: any) => {
        console.log("data", data);
        this.alertService.fnLoading(false)
        this.configureableModalData = data || [];

        this.modalRef = this.modalService.open(this.childModal,{ size: 'lg', backdrop: 'static' });
        this.modalRef.result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      });
    }
  }  


  fnPtableModalCallBack(event: any) {    
    this.modalRef.close();
  }

  public configureableModalTable = {
    tableID: "messtage-history-table",
    tableClass: "table table-border ",
    tableName: this.LT=='bn'?'গাড়ির তালিকা':'List of Buses',
    tableRowIDInternalName: "CarId",
    tableColDef: [
      { headerName: this.LT=='bn'?'নিবন্ধন নম্বর':'Reg No ', width: '10%', internalName: 'RegistrationNo', sort: true, type: "" },
      { headerName: this.LT=='bn'?'নিবন্ধনের তারিখ':'Reg. Date ', width: '12%', internalName: 'RegistrationDate', sort: true, type: "" },
      { headerName: this.LT=='bn'?'প্রকার':'Type', width: '10%', internalName: 'Type', sort: true, type: "" },
      { headerName: this.LT=='bn'?'প্রথম রুটের তারিখ':'On Root Date', width: '15%', internalName: 'OnRootDate', sort: false, type: "" },
      { headerName: this.LT=='bn'?'সিটের সংখ্যা':'No. of Seat ', width: '10%', internalName: 'NoOfSeat', sort: true, type: "" },
      { headerName: this.LT=='bn'?'নিষ্ক্রিয় হওয়ার কারণ':'Reason For Inactive', width: '20%', internalName: 'ReasonForStop', sort: true, type: "" },
      { headerName: this.LT=='bn'?'অবস্থা':'Status', width: '10%', internalName: 'Status', sort: true, type: "" }
    ],
    enabledSearch: true,
    enabledSerialNo: true,
    pageSize: 15,
    enabledPagination: false,
    enabledAutoScrolled: true,
    pTableStyle: {
      tableOverflowY: true,
      overflowContentHeight: '460px'
    }
  };

}
