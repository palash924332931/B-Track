import { Component, OnInit, ViewChild } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { AlertService } from '../../../shared/modules/alert/alert.service'
import { CarType } from '../../../shared/model/car/car-type'
import { CarTypeReport, DailyCarLogReport } from '../../../shared/model/report'
import { CarService, CommonService, ConfigService, ReportService, CustomNgbDateParserFormatter } from '../../../shared/services'
import { NgbModal, NgbModalRef, ModalDismissReasons, NgbTimeStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'app-monthly-incom-chart',
  templateUrl: './monthly-incom-chart.component.html',
  styleUrls: ['./monthly-incom-chart.component.scss'],
  animations: [routerTransition()],
  providers: [CustomNgbDateParserFormatter]
})
export class MonthlyIncomChartComponent implements OnInit {
  public UserInfo = JSON.parse(localStorage.getItem("car-system-user-info-option-b"));
  public UserId = 1;
  public LT: string = ConfigService.languageType;
  public IsEditItem: boolean = false;
  public monthlyReportData: DailyCarLogReport[];
  public monthlyReportDataRouteWise: any[] = [];
  public carTypes = new CarTypeReport();
  private modalRef: NgbModalRef;
  public closeResult: string;
  public reportDateSelected: any;
  public reportDate: string;
  public fromDateSelected: any = null;
  public toDateSelected: any = null;
  public fromDate: string = null;
  public toDate: string = null;
  public status = 'Bus Wise'
  constructor(private carService: CarService, private alertService: AlertService, private modalService: NgbModal, private reportService: ReportService, private configService: ConfigService, private customNgbDateParserFormatter: CustomNgbDateParserFormatter, private ngbDateParserFormatter: NgbDateParserFormatter) {

  }

  ngOnInit() {
    var date = new Date();
    this.fromDate = this.configService.fnFormatDate(new Date(date.getFullYear(), date.getMonth(), 1));
    this.toDate = this.configService.fnFormatDate(new Date(date.getFullYear(), date.getMonth() + 1, 0));
    //this.toDate = this.configService.getCurrentDate();
    //this.toDate = this.configService.getCurrentDate();

    console.log("date", date, "firstDay", "lastDay", "this.fromDate", this.fromDate);
    this.fromDateSelected = this.customNgbDateParserFormatter.parse(this.fromDate || null);
    this.toDateSelected = this.customNgbDateParserFormatter.parse(this.toDate || null);
    this.status = 'Bus Wise'


    this.reportDate = this.configService.getCurrentDate();
    this.reportDateSelected = this.customNgbDateParserFormatter.parse(this.reportDate || null);
    this.UserId = this.UserInfo[0].Id;
   // this.monthlyIncomeReport.tableName = this.LT == 'bn' ? this.fromDate + ' থেকে ' + this.toDate + ' তারিখের আয়ের প্রতিবেদন' : 'Income Report ' + this.fromDate + ' to ' + this.toDate,
      this.fnGetDailyPayment();
  }
public series:any[]=[];
public seriesData:any[]=[];
  fnGetDailyPayment() {
    this.alertService.fnLoading(true);
    this.IsEditItem = false;
    //let LastUpdate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let LastUpdate = this.configService.getCurrentDate();
    this.reportService.fnGetIncomeReportDateRange(this.UserId, this.fromDate, this.toDate, 'All').subscribe(
      (data: DailyCarLogReport[]) => {
        console.log(data);
        this.monthlyReportData = data || [];
        this.monthlyReportData.forEach((rec:any)=>{
          this.series.push({
            "name": rec.Type+ '( '+rec.TotalDistance+' )',
            "y": rec.TotalIncome,
          });          
        });

        console.log("this.series",this.series)

        this.seriesData=[
          {
            "name": "Browsers",
            "data": this.series
          }
        ];
       // this.chart.addSerie=this.series;
        this.alertService.fnLoading(false);
      },
      (error: any) => {
        console.log("error", error);
        this.alertService.fnLoading(false);
        this.alertService.alert(this.LT == 'bn' ? 'সিস্টেমটি বাসের ধরন লোড করতে ব্যর্থ হয়েছে। অ্যাডমিন সাথে যোগাযোগ করুন দয়া করে।' : 'System has failed to load bus type. Please contact with admin.');
        return false;
      }
    );
  }


  fnSearchReport() {
    // this.alertService.fnLoading(true);
    // if (this.status == 'Bus Wise') {
    //   this.monthlyIncomeReport.tableName = this.LT == 'bn' ? this.fromDate + ' থেকে ' + this.toDate + ' তারিখের আয়ের প্রতিবেদন' : 'Income Report ' + this.fromDate + ' to ' + this.toDate,
    //     this.reportService.fnGetIncomeReportDateRange(this.UserId, this.fromDate, this.toDate, 'All').subscribe(
    //       (data: any[]) => {
    //         this.monthlyReportData = data || [];
    //         this.alertService.fnLoading(false);
    //       },
    //       (error: any) => {
    //         console.log("error", error);
    //         this.alertService.fnLoading(false);
    //         this.alertService.alert(this.LT == 'bn' ? 'সিস্টেমটি বাসের ধরন লোড করতে ব্যর্থ হয়েছে। অ্যাডমিন সাথে যোগাযোগ করুন দয়া করে।' : 'System has failed to load bus type. Please contact with admin.');
    //         return false;
    //       }
    //     );
    // } else {
    //   this.monthlyIncomeReportRouteWise.tableName = this.LT == 'bn' ? this.fromDate + ' থেকে ' + this.toDate + ' তারিখের আয়ের প্রতিবেদন' : 'Income Report ' + this.fromDate + ' to ' + this.toDate,
    //     this.reportService.fnGetIncomeReportRouteWiseDateRange(this.UserId, this.fromDate, this.toDate, 'All').subscribe(
    //       (data: any[]) => {
    //         console.log(data);
    //         this.monthlyReportDataRouteWise = data || [];
    //         this.alertService.fnLoading(false);
    //       },
    //       (error: any) => {
    //         console.log("error", error);
    //         this.alertService.fnLoading(false);
    //         this.alertService.alert(this.LT == 'bn' ? 'সিস্টেমটি বাসের ধরন লোড করতে ব্যর্থ হয়েছে। অ্যাডমিন সাথে যোগাযোগ করুন দয়া করে।' : 'System has failed to load bus type. Please contact with admin.');
    //         return false;
    //       }
    //     );
    // }

  }

  onSelectReportDate(date: any) {
    if (date != null) {
      this.reportDate = this.ngbDateParserFormatter.format(date);
    }
  }

  onSelectFromDate(date: any) {
    if (date != null) {
      this.fromDate = this.ngbDateParserFormatter.format(date);
    } else {
      this.fromDate = null;
    }
  }
  onSelectToDate(date: any) {
    if (date != null) {
      this.toDate = this.ngbDateParserFormatter.format(date);
    } else {
      this.toDate = null;
    }
  }


  chart = new Chart({
    credits: {
      enabled: false
    },

    chart: {
      type: 'column'
    },
    title: {
      text: 'Browser market shares. January, 2018'
    },
    subtitle: {
      text: 'Click the columns to view versions. Source: <a href="http://statcounter.com" target="_blank">statcounter.com</a>'
    },
    xAxis: {
      type: 'category'
    },
    yAxis: {
      title: {
        text: 'Total percent market share'
      }

    },
    legend: {
      enabled: false
    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          format: '{point.y:.1f}%'
        }
      }
    },

    tooltip: {
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
    },

    "series":this.seriesData ,


  });

 

}
