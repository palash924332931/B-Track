import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../../router.animations';
import { AlertService } from '../../../../shared/modules/alert/alert.service'
import { CarService, AdminService, CommonService, CustomNgbDateParserFormatter, ConfigService,StoreService } from '../../../../shared/services'
import { POL } from '../../../../shared/model/store'
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pol-details',
  templateUrl: './pol-details.component.html',
  styleUrls: ['./pol-details.component.scss'],
  providers: [CustomNgbDateParserFormatter],
  animations: [routerTransition()]
})
export class PolDetailsComponent implements OnInit {

  public polId: number;
  public LT: string = ConfigService.languageType;
  public IsEditItem: boolean = false;
  public polDetails = new POL();
  public checkInDate: any = null;
  public currentDate: any = null;
  public onRootDate: any = null;
  public UserInfo = JSON.parse(localStorage.getItem("car-system-user-info-option-b"));
  public userId = 1;
  private modalRef: NgbModalRef;
  public closeResult: string;
  constructor(private carService: CarService, private configService: ConfigService, private alertService: AlertService, private ngbDateParserFormatter: NgbDateParserFormatter, private customNgbDateParserFormatter: CustomNgbDateParserFormatter, private router: Router, private route: ActivatedRoute, private modalService: NgbModal, private adminService: AdminService, private storeService:StoreService) { }

  ngOnInit() {
    this.userId = this.UserInfo[0].Id;
    this.polId = this.route.snapshot.params["polId"];
    let date2 = this.configService.getCurrentDate();
    this.currentDate =date2;
    
    if (this.polId > 0) {
      this.IsEditItem = true;
      this.fnGetPOLDetails();
    } else {      
      this.checkInDate = this.customNgbDateParserFormatter.parse(date2 || null);
      this.polDetails.CheckInDate = this.ngbDateParserFormatter.format(this.checkInDate);    
      this.IsEditItem = false;
    }
  }

  fnGetPOLDetails() {
    this.alertService.fnLoading(true);
    this.storeService.fnGetPOLLogList(this.userId,this.polId,this.currentDate,this.currentDate,"Single").subscribe(
      (data: POL[]) => {
        this.polDetails = data[0];
        this.checkInDate = this.customNgbDateParserFormatter.parse(this.polDetails.CheckInDate || null);
        this.alertService.fnLoading(false);
      },
      (error: any) => {
        this.alertService.fnLoading(false);
        this.alertService.alert(this.LT == 'bn' ? 'নেটওয়ার্ক সমস্যার কারণে সিস্টেমটি বাসের তথ্য প্রদর্শন করতে ব্যর্থ হয়েছে। অনুগ্রহপূর্বক আবার চেষ্টা করুন.' : 'System has failed to show bus information because of network problem. Please try again.');
      }
    );
  }

  fnSavePOLDetails() {
    //to check group name;
    if (this.polDetails.CarId == null || this.polDetails.RegistrationNo == "") {
      this.alertService.alert(this.LT=='bn'?'নিবন্ধন নম্বর প্রয়োজন। দয়া করে আবার এই ক্ষেত্রটি পর্যালোচনা করুন।':'Registration no. is required. Please review this field again.');
      return false;
    }else if (this.polDetails.DriverId == null || this.polDetails.DriverName == "") {
      this.alertService.alert(this.LT=='bn'?'চালক পছন্দ করুন, তারপর তথ্য সংরক্ষণ করুন।':'Car is required to save this information. Please review this field again.');
      return false;
    }else if (this.polDetails.CheckInDate == null || this.polDetails.CheckInDate == "") {
      this.alertService.alert(this.LT=='bn'?'ইস্যুর তারিখ দিন, তারপর তথ্য সংরক্ষণ করুন।':'Issue Date is required to save this information. Please review this field again.');
      return false;
    }

    //this.polDetails.Update = new Date().toISOString().slice(0, 19).replace('T', ' '); 
    this.polDetails.Updated = this.configService.getCurrentDate();  
    this.polDetails.CreatedBy=this.userId;     
    if (this.IsEditItem) {

    } else {
      this.polDetails.POLId=0;
      this.polDetails.Created = this.configService.getCurrentDate();
    }
    
    this.polDetails.CNG=Number(this.polDetails.CNG||0).toFixed(2).toString();
    this.polDetails.Diesel=Number(this.polDetails.Diesel||0).toFixed(2).toString();
    this.polDetails.EngineOil=Number(this.polDetails.EngineOil||0).toFixed(2).toString();
    this.polDetails.PowerOil=Number(this.polDetails.PowerOil||0).toFixed(2).toString();
    this.polDetails.GearOil=Number(this.polDetails.GearOil||0).toFixed(2).toString();
    this.polDetails.Grease=Number(this.polDetails.Grease||0).toFixed(2).toString();

    this.alertService.fnLoading(true);
      this.storeService.fnPostPLO(this.polDetails).subscribe(
        (success: any) => {
          this.alertService.fnLoading(false);
          this.alertService.confirm(this.LT=='bn'?success._body.replace(/"/g,"") + ' আপনি কি পিওএল তালিকায় ফিরে যেতে চান?':success._body.replace(/"/g,"")  +' Do you want to back in POL list?'
            , () => {
              this.router.navigate(["./store/pol"]);
            }
            , function () { });
        },
        (error: any) => {
          this.alertService.fnLoading(false);
          this.alertService.alert(this.LT=='bn'?' সিস্টেম পিওএলের তথ্য সংরক্ষণ করতে ব্যর্থ হয়েছে।':'System has failed to save POL information.');
        }
      );
  }

  fnCreateNewProduct() {
    this.IsEditItem = false;
    this.polDetails = new POL();
    this.polId = 0;
  }

  onSelectCheckInDateDate(date: any) {
    if (date != null) {
      this.polDetails.CheckInDate = this.ngbDateParserFormatter.format(date);
    } else {
      this.polDetails.CheckInDate = null;
    }
  }


  public modalType: string;
  configureableModalData: any[] = [];
  fnGenerateModal(content, actionName: string) {
    this.alertService.fnLoading(true)
    this.modalType = actionName;
    //generate modal
    if (this.modalType == "Car selection") {
      this.configureableModalTable.tableName = this.LT == 'bn' ? 'গাড়ি নির্বাচন করুন' : 'Select Bus from the list.';
      this.configureableModalTable.tableColDef = [
        { headerName: this.LT == 'bn' ? 'নিবন্ধন নম্বর' : 'Registration No ', width: '25%', internalName: 'RegistrationNo', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'গাড়ির ধরণ' : 'Bus Type ', width: '25%', internalName: 'Type', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'বিবরণ' : 'Description', width: '25%', internalName: 'Description', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'অবস্থা' : 'Status', width: '25%', internalName: 'Status', sort: true, type: "" },
      ]

      this.carService.fnGetBuses(this.userId).then((data: any) => {
        console.log("data", data);
        this.alertService.fnLoading(false)
        this.configureableModalData = data || [];

        this.modalRef = this.modalService.open(content, { size: 'lg', backdrop: 'static' });
        this.modalRef.result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.alertService.fnLoading(false)
          //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      });
    } else if (this.modalType == "Driver selection") {
      this.configureableModalTable.tableName = this.LT == 'bn' ? 'চালক নির্বাচন করুন' : 'Select Driver from list.';
      this.configureableModalTable.tableColDef = [
        { headerName: this.LT == 'bn' ? 'কর্মচারীর আইডি' : 'Employee Id ', width: '25%', internalName: 'EmployeeId', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'চালকের নাম' : 'Name ', width: '25%', internalName: this.LT == 'bn' ? 'NameInBangla' : 'Name', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'মোবাইল নম্বর' : 'Phone Number', width: '25%', internalName: 'PhoneNo', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'ড্রাইভিং লাইসেন্স' : 'Driving LI', width: '25%', internalName: 'Status', sort: true, type: "" },
      ]

      this.carService.fnGetDrivers(this.userId).then((data: any) => {
        console.log("data", data);
        this.alertService.fnLoading(false)
        this.configureableModalData = data || [];

        this.modalRef = this.modalService.open(content, { size: 'lg' });
        this.modalRef.result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.alertService.fnLoading(false)
          //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      });
    } else if (this.modalType == "User selection") {
      this.configureableModalTable.tableName = this.LT == 'bn' ? 'ইস্যুকারী নির্বাচন করুন' : 'Select Authorized Person.';
      this.configureableModalTable.tableColDef = [
        { headerName: this.LT == 'bn' ? 'কর্মচারীর আইডি' : 'Employee Id ', width: '25%', internalName: 'EmployeeId', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'নাম ' : 'Name ', width: '25%', internalName: 'Name', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'পদবী' : 'Phone Number', width: '25%', internalName: 'RoleName', sort: true, type: "" },
      ]

      this.adminService.fnGetEmployees(this.userId).subscribe((data: any) => {
        console.log("data", data);
        this.alertService.fnLoading(false)
        this.configureableModalData = data || [];

        this.modalRef = this.modalService.open(content);
        this.modalRef.result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.alertService.fnLoading(false)
          //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      }, (error: any) => {
        this.alertService.fnLoading(false);
      });
    }
    else if (this.modalType == "Select Previous Bus Record") {
      this.configureableModalTable.tableName = this.LT == 'bn' ? 'গাডির রেকড থেকে নির্বাচন করুন (' + this.currentDate + ' )' : 'Select from Car Record (' + this.currentDate + ' )';
      this.configureableModalTable.tableColDef = [
        { headerName: this.LT == 'bn' ? 'বহির্গমনের তাং' : 'Departure Date', width: '15%', internalName: 'CheckInDate', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'চালকের নাম' : 'Driver Name ', width: '10%', internalName: 'DriverName', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'রেজিঃ নং' : 'Bus Reg. No', width: '10%', internalName: 'RegistrationNo', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'গাড়ীর প্রকার' : 'Bus Type', width: '15%', internalName: 'TypeName', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'রুটের নাম' : 'Route Name', width: '15%', internalName: 'RootName', sort: false, type: "" },
        { headerName: this.LT == 'bn' ? 'যাত্রা শুরুর স্থান' : 'Start Point', width: '15%', internalName: 'RouteStartPoint', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'রুটের দূরত্ব' : 'Route Distance', width: '15%', internalName: 'Distance', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'ট্রিপের ধরন' : 'Trip Type', width: '15%', internalName: 'TripType', sort: true, type: "" },
      ]
      this.carService.fnGetDilyCarLogListDateRange(this.userId, 'ALL', this.currentDate, this.currentDate).then((data: any) => {
        console.log("data", data);
        this.alertService.fnLoading(false)
        this.configureableModalData = data || [];
        this.modalRef = this.modalService.open(content, { size: 'lg', backdrop: 'static' });
        this.modalRef.result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.alertService.fnLoading(false)
          //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      }, (error: any) => {
        this.alertService.fnLoading(false);
      });
    }


  }


  fnPtableModalCallBack(event: any) {
    console.log("event", event);
    if (this.modalType == "Car selection") {
      this.polDetails.CarId = event.record.CarId;
      this.polDetails.RegistrationNo = event.record.RegistrationNo;
    } else if (this.modalType == "Driver selection") {
      this.polDetails.DriverId = event.record.DriverId;
      this.polDetails.DriverName = event.record.Name;
    } else if (this.modalType == "User selection") {
      this.polDetails.IssuedById = event.record.Id;
      this.polDetails.IssuedByName = event.record.Name;
    } else if (this.modalType == "Select Previous Bus Record") {
      this.polDetails.CarId = event.record.CarId;
      this.polDetails.RegistrationNo = event.record.RegistrationNo;
      this.polDetails.DriverId = event.record.DriverId;
      this.polDetails.DriverName = event.record.DriverName;
    }
    this.modalRef.close();
  }

  public configureableModalTable = {
    tableID: "messtage-history-table",
    tableClass: "table table-border ",
    tableName: this.LT == 'bn' ? 'গাড়ির প্রকার নির্বাচন করুন' : 'Select Bus Type',
    tableRowIDInternalName: "ID",
    tableColDef: [
      { headerName: this.LT == 'bn' ? 'গাড়ির প্রকার' : 'Bus Type', width: '40%', internalName: 'Type', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'বিবরণ' : 'Description', width: '45%', internalName: 'Description', sort: true, type: "" },
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

