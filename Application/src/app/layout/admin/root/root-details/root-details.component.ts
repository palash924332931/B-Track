import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../../router.animations';
import { AlertService } from '../../../../shared/modules/alert/alert.service'
import { AdminService, CommonService, ConfigService } from '../../../../shared/services'
import { Root } from '../../../../shared/model/admin'
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root-details',
  templateUrl: './root-details.component.html',
  styleUrls: ['./root-details.component.scss'],
  animations: [routerTransition()]
})
export class RootDetailsComponent implements OnInit {

  public pageTitle: string = "Product Registration";
  public rootId: number;
  public LT:string=ConfigService.languageType;
  public IsEditItem: boolean = false;
  public rootDetails = new Root();
  public UserInfo = JSON.parse(localStorage.getItem("car-system-user-info-option-b"));
  public userId=1;
  constructor(private adminService: AdminService, private configService:ConfigService, private alertService: AlertService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.userId=this.UserInfo[0].Id;
    this.rootId = this.route.snapshot.params["rootId"];
    if (this.rootId > 0) {
      this.IsEditItem = true;
      this.fnGetRootDetails();
    } else {
      this.rootDetails.TargetTrip=2;
      this.IsEditItem = false;
    }
  }

  fnGetRootDetails() {
    this.alertService.fnLoading(true);
    this.adminService.fnGetRoot(this.userId,this.rootId).subscribe(
      (data: Root[]) => {
        this.rootDetails = data[0];
        this.alertService.fnLoading(false);
      },
      (error: any) => {
        this.alertService.fnLoading(false);
        this.alertService.alert(this.LT=='bn'?'নেটওয়ার্ক সমস্যার কারণে সিস্টেম মূল বিবরণগুলি দেখাতে ব্যর্থ হয়েছে।':'System has failed to show root details because of network problem.');
      }
    );
  }

  fnSaveRoot() {
    this.rootDetails.CreatedBy = this.userId;
    //this.rootDetails.Update = new Date().toISOString().slice(0, 19).replace('T', ' ');
    this.rootDetails.Update=this.configService.getCurrentDate();
    if (this.rootDetails.RootName == null || this.rootDetails.RootName == "") {
      this.alertService.alert(this.LT=='bn'?'দয়া করে রুটের নামটি লিখুন, তারপর তথ্য সংরক্ষন করুন।':'Route Name is required. Please review this field again.');
      return false;
    }else if (this.rootDetails.StartPoint == null || this.rootDetails.StartPoint == "") {
      this.alertService.alert(this.LT=='bn'?'দয়া করে প্রারম্ভিক স্থানের নামটি লিখুন, তারপর তথ্য সংরক্ষন করুন।':'Start point is required. Please review this field again.');
      return false;
    }else if (this.rootDetails.Distance == null ||  isNaN(this.rootDetails.Distance)) {
      this.alertService.alert(this.LT=='bn'?'দয়া করে রুটের দুরত্ব লিখুন এবং ইংরেজীতে লিখুন, তারপর তথ্য সংরক্ষন করুন।':'Distance is required. Please review this field again.');
      return false;
    }else if (this.rootDetails.TargetTrip == null ||  isNaN(this.rootDetails.TargetTrip)) {
      this.alertService.alert(this.LT=='bn'?'দয়া করে টার্গেট ট্রিপ লিখুন এবং ইংরেজীতে লিখুন, তারপর তথ্য সংরক্ষন করুন।':'Target Trip is required. Please review this field again.');
      return false;
    }
    this.rootDetails.Status="Active";
    if (this.IsEditItem) {
      this.alertService.fnLoading(true);      
    } else {
      this.rootDetails.RootId = 0;
      this.alertService.fnLoading(true);
      
    }

    this.adminService.fnPostRoot(this.rootDetails).subscribe(
        (success: any) => {
          this.alertService.fnLoading(false);
          this.alertService.confirm(this.LT=='bn'? success._body.replace(/"/g,"") + ' আপনি কি রুটের তালিকা ফিরে পেতে চান?':success._body.replace(/"/g,"") +  ' Do you want to back in root list?'
            , () => {
              this.router.navigate(["./admin/root"]);
            }
            , function () { });

        },
        (error: any) => {
          this.alertService.fnLoading(false);
          this.alertService.alert(this.LT=='bn'?'নেটওয়ার্ক সমস্যাটির কারণে সিস্টেম প্রদর্শন করতে ব্যর্থ হয়েছে সিস্টেম ':'System has failed to show product because of network problem.');
        }
      );
  }
  fnCreateNewProduct(){
    this.IsEditItem=false;
    this.rootDetails= new Root();
    this.rootDetails.TargetTrip=2;
    this.rootId=0;
  }

}
