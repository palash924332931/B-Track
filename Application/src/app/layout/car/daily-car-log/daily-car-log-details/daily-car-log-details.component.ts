import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../../router.animations';
import { AlertService } from '../../../../shared/modules/alert/alert.service'
import { CarService, AdminService, CommonService, CustomNgbDateParserFormatter, ConfigService } from '../../../../shared/services'
import { DailyCarHistory } from '../../../../shared/model/car'
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, NgbModalRef, ModalDismissReasons, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-daily-car-log-details',
  templateUrl: './daily-car-log-details.component.html',
  styleUrls: ['./daily-car-log-details.component.scss'],
  providers: [CustomNgbDateParserFormatter],
  animations: [routerTransition()]
})
export class DailyCarLogDetailsComponent implements OnInit {
  public userId = 1;
  public LT: string = ConfigService.languageType;
  public CarLogId: number;
  public IsEditItem: boolean = false;
  public dailyLogDetails = new DailyCarHistory();
  private modalRef: NgbModalRef;
  public closeResult: string;
  public UserInfo = JSON.parse(localStorage.getItem("car-system-user-info-option-b"));
  public checkInTime = { hour: 0, minute: 0 };
  public checkOutTime: any = null;
  public checkInDate = null;
  public previousDate = null;
  public selectedRoute: any = null;
  public oldRecordSearchDate: any = null;
  public isSavedNewRecord:boolean=false;
  constructor(private carService: CarService, private configService: ConfigService, private adminService: AdminService, private alertService: AlertService, private ngbDateParserFormatter: NgbDateParserFormatter, private customNgbDateParserFormatter: CustomNgbDateParserFormatter, private router: Router, private route: ActivatedRoute, private modalService: NgbModal, private commonService: CommonService) { }

  ngOnInit() {
    this.isSavedNewRecord=false;
    this.userId = this.UserInfo[0].Id;
    this.CarLogId = this.route.snapshot.params["logId"];
    var displayDate = new Date().toLocaleDateString();
    //let date2 = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let date2 = this.configService.getCurrentDate();
    let dateTime = new Date();
    this.checkInDate = this.customNgbDateParserFormatter.parse(date2 || null);
    this.checkInTime = { hour: dateTime.getHours(), minute: dateTime.getMinutes() };
    this.oldRecordSearchDate = this.commonService.fnAddDays(dateTime, -1);
    this.previousDate = this.customNgbDateParserFormatter.parse(this.oldRecordSearchDate || null);

    if (this.CarLogId > 0) {
      this.IsEditItem = true;
      this.fnGetdailyLogDetails();
    } else {
      this.dailyLogDetails.CheckInDate = this.ngbDateParserFormatter.format(this.checkInDate);
      this.dailyLogDetails.CheckInTime = this.checkInTime.hour + ":" + this.checkInTime.minute;
      this.dailyLogDetails.CheckInByName = this.UserInfo[0].Name;
      this.dailyLogDetails.CheckInBy = this.userId;
      this.dailyLogDetails.TripType = 'Normal Trip';
      this.dailyLogDetails.IsUnwantedReturn = false;
      this.IsEditItem = false;
      this.dailyLogDetails.IsUnOfficialDay = false;
      this.dailyLogDetails.AdditionalIncomeType = "";
      this.dailyLogDetails.Status = "Active";
    }
  }

  fnGetdailyLogDetails() {
    this.alertService.fnLoading(true);
    this.carService.fnGetDilyCarLog(this.userId, this.CarLogId).then(
      (data: DailyCarHistory[]) => {
        debugger
        this.dailyLogDetails = data[0] || new DailyCarHistory();
        this.checkInDate = this.customNgbDateParserFormatter.parse(this.dailyLogDetails.CheckInDate || null);
        if (this.dailyLogDetails.CheckInTime != null) {
          this.checkInTime = { hour: Number(this.dailyLogDetails.CheckInTime.split(":")[0]), minute: Number(this.dailyLogDetails.CheckInTime.split(":")[1]) };
        }
        if (this.dailyLogDetails.CheckOutTime != null) {
          this.checkOutTime = { hour: Number(this.dailyLogDetails.CheckOutTime.split(":")[0]), minute: Number(this.dailyLogDetails.CheckOutTime.split(":")[1]) };
        }
        this.alertService.fnLoading(false);
      },
      (error: any) => {
        this.alertService.fnLoading(false);
        this.alertService.alert(this.LT == 'bn' ? 'নেটওয়ার্ক সমস্যার কারনে সিস্টেমটি কর্মচারী দেখাতে ব্যর্থ হয়েছে।' : 'System has failed to show employee because of network problem.');
      }
    );
  }

  fnSaveDailyLog() {
    this.dailyLogDetails.CreatedBy = this.userId;
    //to check group name;
    if (this.dailyLogDetails.CarId == null || this.dailyLogDetails.CarId == undefined) {
      this.alertService.alert(this.LT == 'bn' ? 'আপনার কাজ শুরুর পূর্বে দয়া করে গাড়ী নির্বাচন করুন।' : 'Please select bus before proced your task.');
      return false;
    } else if ((this.dailyLogDetails.RootId == null || this.dailyLogDetails.RootId == undefined)&& this.dailyLogDetails.TripType!='Reserve') {
      this.alertService.alert(this.LT == 'bn' ? 'আপনার কাজ শুরুর পূর্বে দয়া করে রুটের তথ্য নির্বাচন করুন।' : 'Please select root information before proced your task.');
      return false;
    }
    else if (this.dailyLogDetails.DriverId == null || this.dailyLogDetails.DriverId == undefined) {
      this.alertService.alert(this.LT == 'bn' ? 'আপনার কাজ শুরুর পূর্বে দয়া করে চালকের তথ্য নির্বাচন করুন।' : 'Please select driver information before proced your task.');
      return false;
    }
    //this.dailyLogDetails.Update = new Date().toISOString().slice(0, 19).replace('T', ' ');
    this.dailyLogDetails.Update = this.configService.getCurrentDate();
    this.alertService.fnLoading(true);
    if (!this.IsEditItem) {
      this.dailyLogDetails.CarLogId = 0;
      this.dailyLogDetails.CreatedBy = this.userId;
    }

    this.carService.fnPostDailyCarLog(this.dailyLogDetails).subscribe(
      (success: any) => {
        this.alertService.fnLoading(false);
        this.alertService.confirm(this.LT == 'bn' ? success._body.replace(/"/g, '') + ' আপনি কি গাড়ীর লগ তালিকাটি ফিরে পেতে চান?' : success._body.replace(/"/g, '') + ' Do you want to back in bus log list?'
          , () => {
            this.router.navigate(["./car/car-log"]);
          }
          , ()=> { this.isSavedNewRecord=true;});

      },
      (error: any) => {
        this.alertService.fnLoading(false);
        this.alertService.alert(this.LT == 'bn' ? 'নেটওয়ার্ক সমস্যার কারনে সিস্টেমটি গাড়ীর লগ তালিকাটি প্রদর্শন করতে ব্যর্থ হয়েছেন।' : 'System has failed to show bus log list because of network problem.');
      }
    );
  }

  fnCreateNewProduct() {
    this.isSavedNewRecord=false;
    this.IsEditItem = false;
    this.dailyLogDetails = new DailyCarHistory();
    let date2 = this.configService.getCurrentDate();
    this.checkInDate = this.customNgbDateParserFormatter.parse(date2 || null);
    this.dailyLogDetails.CheckInDate = this.ngbDateParserFormatter.format(this.customNgbDateParserFormatter.parse(date2 || null));
    this.dailyLogDetails.CheckInTime = this.checkInTime.hour + ":" + this.checkInTime.minute;
    this.dailyLogDetails.CheckInByName = this.UserInfo[0].Name;
    this.dailyLogDetails.CheckInBy = this.userId;
    this.dailyLogDetails.TripType = 'Normal Trip';
    this.dailyLogDetails.IsUnwantedReturn = false;
    this.CarLogId = 0;
    this.dailyLogDetails.IsUnOfficialDay = false;
    this.dailyLogDetails.AdditionalIncomeType = "";
    this.dailyLogDetails.Status = "Active";
    this.router.navigate(["./car/car-log/0"]);
  }

  fnChangeTotalDistance() {
    if (this.dailyLogDetails.TripNo) {
      let onRouteDistance = (this.dailyLogDetails.TripNo * (this.dailyLogDetails.Distance == null || undefined ? 0 : this.dailyLogDetails.Distance));
      this.dailyLogDetails.TotalDistance = Number(onRouteDistance) + Number((this.dailyLogDetails.DifferentRouteDistance == null ? 0 : this.dailyLogDetails.DifferentRouteDistance));
    } else {
      this.dailyLogDetails.TotalDistance = 0 + this.dailyLogDetails.DifferentRouteDistance == null ? 0 : this.dailyLogDetails.DifferentRouteDistance;
    }
  }

  fnPrintCarLog() {
    let printContents, popupWin;
    /*
    <tr> <td colspan="2" align="center">জোয়ারসাহারা বাস ডিপো </td> </tr>
          <tr> <td colspan="2" align="center">খিলক্ষেত, ঢাকা।</td> </tr>
    */
    printContents = `<table style="width:100%">
          <tr>
          <td colspan="2" align="center">বাংলাদেশ সড়ক পরিবহন কর্পোরেশন </td> </tr>
          <tr> <td colspan="2" align="center">${this.UserInfo[0].CompnayNameBangla} </td> </tr>
          <tr> <td colspan="2" align="center">${this.UserInfo[0].CompanyAddressBangla}</td> </tr>
          <tr> <td colspan="2" align="center">ওয়েবিল</td> </tr>
         <tr>
           <td align="left">
               <table>
                 <tr><td>গাড়ীর নংঃ </td><td>${this.dailyLogDetails.RegistrationNo}</td></tr>
                 <tr><td>চালকের নামঃ</td><td>${this.dailyLogDetails.DriverName}</td></tr>
                 <tr><td>রুটের নামঃ</td><td>${this.dailyLogDetails.RootName}</td></tr>

               </table>
           </td>
             <td align="right">
               <table>
                 <tr><td>বাহির হওয়ার তারিখঃ</td><td>${this.commonService.fnConvertEngToBangDigit(this.dailyLogDetails.CheckInDate)}</td></tr>
                 <tr><td>বাহির হওয়ার সময়ঃ</td><td>${this.commonService.fnConvertEngToBangDigit(this.dailyLogDetails.CheckInTime)}</td></tr>
                 <tr><td>প্রবেশের সময়ঃ</td><td>${this.dailyLogDetails.CheckOutTime == null ? '' : this.dailyLogDetails.CheckOutTime}</td></tr>  
               </table>
             </td>
          </tr>
          <tr> 
            <td colspan="2" align="center"><br/><br/><br/>
                <table border="1px solid black"  style="border-collapse:collapse;width:100%">
                    <tr><td rowspan="2">ট্রিপ নং</td><td colspan="3" align="center">${this.dailyLogDetails.StartPoint}</td> <td colspan="3" align="center">${this.dailyLogDetails.EndPoint}</td> <td rowspan="2" align="center" width="110px;">মন্তব্য</td></tr>
                    <tr><td>পৌঁছানোর সময়</td> <td >ছাডার সময়</td> <td width="100px;" align="center">স্বাক্ষর</td> <td>পৌঁছানোর সময়</td> <td >ছাডার সময়</td>  <td width="100px;" align="center">স্বাক্ষর</td></tr>
                    <tr>
                      <td>১</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                    </tr>
                    <tr>
                      <td>২</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                    </tr>
                    <tr>
                      <td>৩</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                    </tr>
                    <tr>
                      <td>৪</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                    </tr>
                    <tr>
                      <td>৫</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                    </tr>
                    <tr>
                      <td>৬</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                    </tr>
              </table>
            </td> 
          </tr>
      </table>
      `;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
        <html>
          <head>
            <title>ওয়েবিল (system generated:B-Track)</title>
            <style>
            //........Customized style.......
            </style>
          </head>
      <body onload="window.print();window.close()">${printContents}</body>
        </html>`);
    popupWin.document.close();
  }

  onSelectCheckInDate(date: any) {
    if (date != null) {
      this.dailyLogDetails.CheckInDate = this.ngbDateParserFormatter.format(date);
    }
  }

  onSelectCheckInTime(event: any) {
    if (event != null) {
      let checkInTime = event.hour + ":" + event.minute;
      this.dailyLogDetails.CheckInTime = checkInTime;
    }
    console.log("Ok", event);
  }

  onSelectPreviousDate(date: any) {
    if (event != null) {
      this.oldRecordSearchDate = this.ngbDateParserFormatter.format(date);;
    }
    console.log("Ok", event);
  }

  onSelectCheckOutTime(event: any) {
    if (event != null) {
      let checkOutTime = event.hour + ":" + event.minute;
      this.dailyLogDetails.CheckOutTime = checkOutTime;
    }
    console.log("Ok", event);
  }

  public modalType: string;
  configureableModalData: any[] = [];
  fnGenerateModal(content, actionName: string) {
    this.alertService.fnLoading(true)
    this.modalType = actionName;
    //generate modal
    if (this.modalType == "Select Root") {
      this.configureableModalTable.tableName = this.LT == 'bn' ? 'তালিকা থেকে রুট নির্বাচন করুন' : 'Select Route From List';
      this.configureableModalTable.tableColDef = [
        { headerName: this.LT == 'bn' ? 'রুটের নাম' : 'Route Name ', width: '25%', internalName: 'RootName', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'যাত্রাশুরুর স্থান' : 'Start Point', width: '25%', internalName: 'StartPoint', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'যাত্রাশেষের স্থান' : 'End Point', width: '25%', internalName: 'EndPoint', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'দূরত্ব (কি,মি)' : 'Distance (km)', width: '25%', internalName: 'Distance', sort: true, type: "" },
      ]

      this.adminService.fnGetRoots(this.userId).subscribe((data: any) => {
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
    else if (this.modalType == "Select Bus") {
      this.configureableModalTable.tableName = this.LT == 'bn' ? 'গাড়ি নির্বাচন করুন' : 'Select Bus from the list.';
      this.configureableModalTable.tableColDef = [
        { headerName: this.LT == 'bn' ? 'নিবন্ধন নম্বর' : 'Registration No ', width: '25%', internalName: 'RegistrationNo', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'গাড়ির ধরণ' : 'Bus Type ', width: '25%', internalName: 'Type', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'বিবরণ' : 'Description', width: '25%', internalName: 'Description', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'অবস্থা' : 'Status', width: '25%', internalName: 'Status', sort: true, type: "" },
      ]

      this.carService.fnGetBuses(this.userId).then((data: any) => {
        console.log("data", data);
        this.alertService.fnLoading(false);
        data = data.filter((rc: any) => { if (rc.Status == 'Active') { return true; } else { return false; } }) || [];
        this.configureableModalData = data || [];

        this.modalRef = this.modalService.open(content);
        this.modalRef.result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      });
    } else if (this.modalType == "Select Driver") {
      this.configureableModalTable.tableName = this.LT == 'bn' ? 'চালক নির্বাচন করুন' : 'Select Driver from list.';
      this.configureableModalTable.tableColDef = [
        { headerName: this.LT == 'bn' ? 'কর্মচারীর আইডি' : 'Employee Id ', width: '25%', internalName: 'EmployeeId', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'চালকের নাম' : 'Name ', width: '25%', internalName: this.LT=='bn'?'NameInBangla':'Name', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'মোবাইল নম্বর' : 'Phone Number', width: '25%', internalName: 'PhoneNo', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'ড্রাইভিং লাইসেন্স' : 'Driving LI', width: '25%', internalName: 'Status', sort: true, type: "" },
      ]

      this.carService.fnGetDrivers(this.userId).then((data: any) => {
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
    } else if (this.modalType == "Select Employee checkedIn" || this.modalType == "Select Employee checkedOut") {
      this.configureableModalTable.tableName = this.LT == 'bn' ? 'দস্তখত্কারী নির্বাচন করুন' : 'Select Authorized Person.';
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
          //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      }, (error: any) => {
        this.alertService.fnLoading(false);
      });
    }
    else if (this.modalType == "Select Previous Bus Record") {
      this.configureableModalTable.tableName = this.LT == 'bn' ? 'পুরাতন রেকড থেকে নির্বাচন করুন (' + this.oldRecordSearchDate + ' )' : 'Select from Previous Bus Record (' + this.oldRecordSearchDate + ' )';
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
      this.carService.fnGetDilyCarLogListDateRange(this.userId, 'ALL', this.oldRecordSearchDate, this.oldRecordSearchDate).then((data: any) => {
        console.log("data", data);
        this.alertService.fnLoading(false)
        this.configureableModalData = data || [];
        this.modalRef = this.modalService.open(content, { size: 'lg', backdrop: 'static' });
        this.modalRef.result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      }, (error: any) => {
        this.alertService.fnLoading(false);
      });
    }
  }

  fnChangeRouteStartPoint() {
    if (this.selectedRoute != null) {
      if (this.dailyLogDetails.RouteStartPoint == this.selectedRoute.StartPoint) {
        this.dailyLogDetails.RouteStartPoint = this.selectedRoute.EndPoint;
      } else {
        this.dailyLogDetails.RouteStartPoint = this.selectedRoute.StartPoint;
      }
    }
  }

  fnSearchOldRecord() {
    this.configureableModalTable.tableName = this.LT == 'bn' ? 'পুরাতন রেকড থেকে নির্বাচন করুন (' + this.oldRecordSearchDate + ' )' : 'Select from Previous Bus Record (' + this.oldRecordSearchDate + ' )';
    this.carService.fnGetDilyCarLogListDateRange(this.userId, 'ALL', this.oldRecordSearchDate, this.oldRecordSearchDate).then((data: any) => {
      console.log("data", data);
      this.alertService.fnLoading(false)
      this.configureableModalData = data || [];
    }, (error: any) => {
      this.alertService.fnLoading(false);
    });
  }

  fnPtableModalCallBack(event: any) {
    console.log("event", event);
    if (this.modalType == "Select Root") {
      this.selectedRoute = event.record;
      this.dailyLogDetails.RootId = event.record.RootId;
      this.dailyLogDetails.RootName = event.record.RootName;
      this.dailyLogDetails.StartPoint = event.record.StartPoint;
      this.dailyLogDetails.EndPoint = event.record.EndPoint;
      this.dailyLogDetails.Distance = event.record.Distance;
      this.dailyLogDetails.RouteStartPoint = event.record.StartPoint;
    } else if (this.modalType == "Select Bus") {
      this.dailyLogDetails.CarId = event.record.CarId;
      this.dailyLogDetails.RegistrationNo = event.record.RegistrationNo;
      this.dailyLogDetails.TypeName = event.record.Type;
    } else if (this.modalType == "Select Driver") {
      this.dailyLogDetails.DriverId = event.record.DriverId;
      this.dailyLogDetails.DriverName = event.record.Name;
      this.dailyLogDetails.HelperName = event.record.HelperName;
    }
    else if (this.modalType == "Select Employee checkedIn") {
      this.dailyLogDetails.CheckInBy = event.record.Id;
      this.dailyLogDetails.CheckInByName = event.record.Name;
    }
    else if (this.modalType == "Select Employee checkedOut") {
      this.dailyLogDetails.CheckOutBy = event.record.Id;
      this.dailyLogDetails.CheckOutByName = event.record.Name;
    } else if (this.modalType == 'Select Previous Bus Record') {
      this.dailyLogDetails = event.record || new DailyCarHistory();
      let date2 = this.configService.getCurrentDate();
      let dateTime = new Date();
      this.checkInDate = this.customNgbDateParserFormatter.parse(date2 || null);
      this.checkInTime = { hour: dateTime.getHours(), minute: dateTime.getMinutes() };
      this.dailyLogDetails.CheckInDate = this.ngbDateParserFormatter.format(this.checkInDate);
      this.dailyLogDetails.CheckInTime = this.checkInTime.hour + ":" + this.checkInTime.minute;
      this.dailyLogDetails.CheckInByName = this.UserInfo[0].Name;
      this.dailyLogDetails.CheckInBy = this.userId;
      this.dailyLogDetails.IsUnwantedReturn = false;
      this.dailyLogDetails.AdditionalIncomeType = "";
      this.dailyLogDetails.OnRouteIncome = 0;
      this.dailyLogDetails.DifferentRouteDistance = 0;
      this.dailyLogDetails.DifferentRouteIncome = 0;
      this.dailyLogDetails.TripNo = 0;
      this.dailyLogDetails.TotalDistance = 0;
      this.dailyLogDetails.IsUnOfficialDay = false;
      this.dailyLogDetails.AdditionalIncomeType = "";
      this.dailyLogDetails.Status = "Active";
    }
    this.modalRef.close();
  }

  public configureableModalTable = {
    tableID: "messtage-history-table",
    tableClass: "table table-border ",
    tableName: this.LT == 'bn' ? 'কর্মচারীর পদবি নির্বাচন করুন' : 'Select Employee Role',
    tableRowIDInternalName: "ID",
    tableColDef: [
      { headerName: this.LT == 'bn' ? 'পদবি' : 'Role Title ', width: '40%', internalName: 'Name', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'যিনি তৈরী করেছেন' : 'Created By', width: '45%', internalName: 'CreatedByName', sort: true, type: "" },
    ],
    enabledSearch: true,
    pageSize: 10,
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
