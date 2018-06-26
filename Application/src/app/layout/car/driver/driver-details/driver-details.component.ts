import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../../router.animations';
import { AlertService } from '../../../../shared/modules/alert/alert.service'
import { CarService, CommonService,CustomNgbDateParserFormatter, ConfigService } from '../../../../shared/services'
import { Driver } from '../../../../shared/model/car'
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef, ModalDismissReasons,NgbDateParserFormatter,NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-driver-details',
  templateUrl: './driver-details.component.html',
  styleUrls: ['./driver-details.component.scss'],
  providers: [CustomNgbDateParserFormatter],
  animations: [routerTransition()]
})
export class DriverDetailsComponent implements OnInit {

  public driverId: number;
  public LT:string=ConfigService.languageType;
  public IsEditItem: boolean = false;
  public driverDetails = new Driver();
  public UserInfo = JSON.parse(localStorage.getItem("car-system-user-info-option-b"));
  public userId=1;
  public corpJoinDate:any=null;
  public depotJoinDate:any=null;
  public retirementDate:any=null;
  public dateOfBirth:any=null;
  constructor(private carService: CarService,private configService:ConfigService, private alertService: AlertService, private router: Router, private route: ActivatedRoute,private ngbDateParserFormatter: NgbDateParserFormatter,private customNgbDateParserFormatter: CustomNgbDateParserFormatter) { }

  ngOnInit() {
    this.userId=this.UserInfo[0].Id;
    this.driverId = this.route.snapshot.params["driverId"];
    if (this.driverId > 0) {
      this.IsEditItem = true;
      this.fnGeDriverDetails();
    } else {
      this.IsEditItem = false;
    }
  }

  fnGeDriverDetails() {
    this.alertService.fnLoading(true);
    this.carService.fnGetDriver(this.userId,this.driverId).then(
      (data: Driver[]) => {
        this.driverDetails = data[0];    
        this.corpJoinDate = this.customNgbDateParserFormatter.parse(this.driverDetails.CorpJoinDate||null);
        this.depotJoinDate=this.customNgbDateParserFormatter.parse(this.driverDetails.DepotJoinDate||null); 
        this.retirementDate=this.customNgbDateParserFormatter.parse(this.driverDetails.RetirementDate||null); 
        this.dateOfBirth=this.customNgbDateParserFormatter.parse(this.driverDetails.DateOfBirth||null);
        this.alertService.fnLoading(false);
      },
      (error: any) => {
        this.alertService.fnLoading(false);
        this.alertService.alert(this.LT=='bn'?'নেটওয়ার্ক সমস্যার কারণে সিস্টেম চালকের তথ্য দেখাতে ব্যর্থ হয়েছে। অনুগ্রহপূর্বক আবার চেষ্টা করুন.':'System has failed to show driver information because of network problem. Please try again.');
      }
    );
  }

  fnSaveDriver() {
    //to check group name;
    if (this.driverDetails.EmployeeId == null || this.driverDetails.EmployeeId == "") {
      this.alertService.alert(this.LT=='bn'?'কর্মচারী আইডি প্রয়োজন। দয়া করে আবার এই ক্ষেত্রটি পর্যালোচনা করুন।':'Employee Id is required. Please review this field again.');
      return false;
    }
    if (this.driverDetails.DrivingLicense == null || this.driverDetails.DrivingLicense == "") {
      this.alertService.alert(this.LT=='bn'?'ড্রাইভিং লাইসেন্স প্রয়োজন। দয়া করে আবার এই ক্ষেত্রটি পর্যালোচনা করুন।':'Driving License is required. Please review this field again.');
      return false;
    }else if (this.driverDetails.Name == null || this.driverDetails.Name == "") {
      this.alertService.alert(this.LT=='bn'?'চালকের নাম প্রয়োজন। দয়া করে আবার এই ক্ষেত্রটি পর্যালোচনা করুন।':'Driver Name is required. Please review this field again.');
      return false;
    }else if (this.driverDetails.ContactNo == null || this.driverDetails.ContactNo == "") {
      this.alertService.alert(this.LT=='bn'?'চালকের মোবাইল নম্বর প্রয়োজন। দয়া করে মোবাইল নম্বরটি বসান।':'Driver contact number is required. Please review this field again.');
      return false;
    }

    //this.driverDetails.Update = new Date().toISOString().slice(0, 19).replace('T', ' ');  
    this.driverDetails.Update =this.configService.getCurrentDate();
    this.driverDetails.CreatedBy=this.userId;   
 
    if (this.IsEditItem) {
      
    } else {
      this.driverDetails.DriverId=0;        
      
    }

    this.alertService.fnLoading(true);
      this.carService.fnPostDriver(this.driverDetails).subscribe(
        (success: any) => {
          this.alertService.fnLoading(false);
          this.alertService.confirm(this.LT=='bn'?success._body.replace(/"/g,"") +' আপনি কি ড্রাইভার তালিকায় ফিরে পেতে চান?':success._body.replace(/"/g,"") + ' Do you want to back in driver list?'
            , () => {
              this.router.navigate(["./car/driver"]);
            }
            , function () { });
        },
        (error: any) => {
          this.alertService.fnLoading(false);
          this.alertService.alert(this.LT=='bn'?'নেটওয়ার্ক সমস্যার কারণে সিস্টেমটি তথ্য সংরক্ষণ করতে ব্যর্থ হয়েছে।':'System has failed to save information because of network problem.');
        }
      );
  }

  onSelectCorpJoinDate(date: any) {
    if (date != null) {
      this.driverDetails.CorpJoinDate = this.ngbDateParserFormatter.format(date);
    }
  }

  onSelectDateOfBirth(date: any) {
    if (date != null) {
      this.driverDetails.DateOfBirth = this.ngbDateParserFormatter.format(date);
      //var date1 = new Date( this.driverDetails.DateOfBirth);
      this.driverDetails.RetirementDate=date.year+65+'-'+date.month+'-'+date.day;
      this.retirementDate=this.customNgbDateParserFormatter.parse( this.driverDetails.RetirementDate||null);

    }
  }

  onSelectDepotJoinDate(date: any) {
    if (date != null) {
      this.driverDetails.DepotJoinDate = this.ngbDateParserFormatter.format(date);
    }
  }
  
  onSelectRetirementDateDate(date: any) {
    if (date != null) {
      this.driverDetails.RetirementDate = this.ngbDateParserFormatter.format(date);
    }
  }

  fnCreateNewItem() {
    this.IsEditItem = false;
    this.driverDetails = new Driver();
    this.driverId = 0;
  }

}
 
