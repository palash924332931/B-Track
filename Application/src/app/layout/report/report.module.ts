import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Routes,RouterModule,Route} from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpModule} from '@angular/http'
import { ReportComponent } from './report.component';
import { PageHeaderModule } from './../../shared';
import { PTableModule,AlertModule } from './../../shared';
import { ConfigService, AccountsService,CarService,ReportService } from './../../shared/services';
import { ChartModule } from 'angular-highcharts';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PayslipReportComponent } from './payslip-report/payslip-report.component';
import { DailycarlogReportComponent } from './dailycarlog-report/dailycarlog-report.component';
import { DailypaymentReportComponent } from './dailypayment-report/dailypayment-report.component';
import { MonthlypaymentReportComponent } from './monthlypayment-report/monthlypayment-report.component';
import { MonthlybuswiseRepotComponent } from './monthlybuswise-repot/monthlybuswise-repot.component';
import { MonthlyIncomChartComponent } from './monthly-incom-chart/monthly-incom-chart.component';

const routes:Routes=[   
    {        
        path: '',
        children: [
            {path:'',component:ReportComponent},
            { path: 'payslip', component: PayslipReportComponent},
             { path: 'dailycarlog', component: DailycarlogReportComponent},
            { path: 'payment', component: DailypaymentReportComponent},
            { path: 'monthlyincomereport', component: MonthlypaymentReportComponent},
            { path: 'monthlybusreport', component: MonthlybuswiseRepotComponent},
            { path: 'monthlyreportchart', component: MonthlyIncomChartComponent},
           // { path: 'installment', component: InstallmentComponent},
        ]
    } 
]

@NgModule({
    imports: [CommonModule,ChartModule,FormsModule,ReactiveFormsModule,PTableModule,AlertModule,HttpModule,NgbModule.forRoot(), PageHeaderModule,RouterModule.forChild(routes)],
    declarations: [ReportComponent, PayslipReportComponent, DailycarlogReportComponent, DailypaymentReportComponent, MonthlypaymentReportComponent, MonthlybuswiseRepotComponent, MonthlyIncomChartComponent],
    providers:[ConfigService,AccountsService,CarService,ReportService],
    exports: [RouterModule]
})
export class  ReportModule {}
