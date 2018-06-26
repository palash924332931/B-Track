import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Routes,RouterModule,Route} from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpModule} from '@angular/http'
import { ManagerComponent } from './manager.component';
import { PageHeaderModule } from './../../shared';
import { PTableModule,AlertModule } from './../../shared';
import { ConfigService, AccountsService,CarService } from './../../shared/services';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PayslipManagerComponent } from './payslip-manager/payslip-manager.component';
import { DailycarlogManagerComponent } from './dailycarlog-manager/dailycarlog-manager.component';

const routes:Routes=[   
    {        
        path: '',
        children: [
            {path:'',component:ManagerComponent},
            { path: 'payslip', component: PayslipManagerComponent},
             { path: 'dailycarlog', component: DailycarlogManagerComponent},
            // { path: 'daily-payment-log', component: DailyPaymentLogComponent},
            // { path: 'daily-payment-log/:paymentId', component: DailyPaymentDetailsComponent},
            // { path: 'payslip-book', component: PayslipBookComponent},
            // { path: 'payslip-book/:bookId', component: PayslipBookDetailsComponent},
           // { path: 'installment', component: InstallmentComponent},
        ]
    } 
]

@NgModule({
    imports: [CommonModule,FormsModule,ReactiveFormsModule,PTableModule,AlertModule,HttpModule,NgbModule.forRoot(), PageHeaderModule,RouterModule.forChild(routes)],
    declarations: [ManagerComponent, PayslipManagerComponent, DailycarlogManagerComponent],
    providers:[ConfigService,AccountsService,CarService],
    exports: [RouterModule]
})
export class  ManagerModule {}
