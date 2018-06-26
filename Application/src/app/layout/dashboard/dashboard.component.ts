import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { ConfigService,ReportService } from '../../shared/services'
import { CarTypeReport,DailyCarLogReport } from '../../shared/model/report'

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {
    public alerts: Array<any> = [];
    public sliders: Array<any> = [];
    public UserInfo = JSON.parse(localStorage.getItem("car-system-user-info-option-b"));
    public LT:string=ConfigService.languageType;
    public UserId = 1;
    public onRootCar:number=0;
    public onPaidCar:number=0;
    public onDueCar:number=0;
    public onPaidAmount:number=0;
    public todayReceivedAmount:number=0;
    constructor(private reportService:ReportService, private configService:ConfigService) {
        this.sliders.push(
            {
                imagePath: 'assets/images/slider1.jpg',
                label: 'B-Track is a complete solution for BRTC to track details information of Buses.',
                text:
                    ''
            },
            {
                imagePath: 'assets/images/slider2.jpg',
                label: '',
                text: ''
            },
            {
                imagePath: 'assets/images/slider3.jpg',
                label: '',
                text:
                    'মাননীয় প্রধানমন্ত্রী ৫ এপ্রিল ২০১৮ তারিখে ভিডিও কনফারেন্সিংয়ের মাধ্যমে কোম্পানীগঞ্জ-মুরাদনগর-হোমনা মহাসড়ক ও গৌরীপুর-হোমনা সেতু কুমিল্লা শহরের শাসনগাছা রেলওয়ে ওভারপাস এবং কুমিল্লার পদুয়া বাজার রেলওয়ে ওভারপাসের শুভ উদ্বোধন করেন ।'
            }
        );

        this.alerts.push(
            {
                id: 1,
                type: 'success',
                message: `No Message available for this image`
            },
            {
                id: 2,
                type: 'warning',
                message: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Voluptates est animi quibusdam praesentium quam, et perspiciatis,
                consectetur velit culpa molestias dignissimos
                voluptatum veritatis quod aliquam! Rerum placeat necessitatibus, vitae dolorum`
            }
        );
    }

    ngOnInit() {
        this.UserId=this.UserInfo[0].Id;
        this.fnGetDailyPayment();
    }

    public closeAlert(alert: any) {
        const index: number = this.alerts.indexOf(alert);
        this.alerts.splice(index, 1);
    }

    fnGetDailyPayment() {
        //let LastUpdate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        let LastUpdate=this.configService.getCurrentDate();
        this.reportService.fnGetDashboardReport(this.UserId,LastUpdate).subscribe(
          (data: DailyCarLogReport[]) => {
            data.forEach((element:DailyCarLogReport) => {
                this.onRootCar=this.onRootCar+Number(element.NoOfOnRootCar);
                this.onPaidCar=this.onPaidCar+Number(element.NoOfPaidCar);
                this.onDueCar=this.onDueCar+Number(element.NoOfDueCar);
                this.onPaidAmount=this.onPaidAmount+Number(element.ReceivedAmount);
                this.todayReceivedAmount=this.todayReceivedAmount+Number(element.TodayReceivedAmount);
            });
          },
          (error: any) => {
            console.log("error", error);
             return false;
          }
        );
      }

    fnGetCarTypes() {
        //let LastUpdate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        let LastUpdate=this.configService.getCurrentDate();
        this.reportService.fnGetDailyCarTypesReport(this.UserId,LastUpdate).subscribe(
          (data: CarTypeReport[]) => {
            console.log(data);
            data.forEach((element:CarTypeReport) => {
                this.onRootCar=this.onRootCar+Number(element.NoOfOnRootCar);
            });
            
            // this.carTypeList = data || [];
            // this.alertService.fnLoading(false);
          },
          (error: any) => {
            console.log("error", error);
            //this.alertService.fnLoading(false);
            //this.alertService.alert(this.LT == 'bn' ? 'সিস্টেমটি বাসের ধরন লোড করতে ব্যর্থ হয়েছে। অ্যাডমিন সাথে যোগাযোগ করুন দয়া করে।' : 'System has failed to load bus type. Please contact with admin.');
            return false;
          }
        );
      }
}
