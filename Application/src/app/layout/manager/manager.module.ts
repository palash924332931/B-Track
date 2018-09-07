import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Routes,RouterModule,Route} from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpModule} from '@angular/http'
import { ManagerComponent } from './manager.component';
import { PageHeaderModule } from './../../shared';
import { PTableModule,AlertModule } from './../../shared';
import { ConfigService, AccountsService,CarService,StoreService,ManagerService } from './../../shared/services';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PayslipManagerComponent } from './payslip-manager/payslip-manager.component';
import { DailycarlogManagerComponent } from './dailycarlog-manager/dailycarlog-manager.component';
import { PolManagerComponent } from './pol-manager/pol-manager.component';
import { JobManagerComponent } from './job-manager/job-manager.component';
import { VoucherManagerComponent } from './voucher-manager/voucher-manager.component';
import { JobHistoryComponent } from './job-history/job-history.component';

const routes:Routes=[   
    {        
        path: '',
        children: [
            {path:'',component:ManagerComponent},
            { path: 'payslip', component: PayslipManagerComponent},
             { path: 'dailycarlog', component: DailycarlogManagerComponent},
             { path: 'pol-manager', component: PolManagerComponent},
             { path: 'job-manager', component: JobManagerComponent},
             { path: 'voucher-manager', component: VoucherManagerComponent},
            // { path: 'jobhistory', component: JobHistoryComponent},
        ]
    } 
]

@NgModule({
    imports: [CommonModule,FormsModule,ReactiveFormsModule,PTableModule,AlertModule,HttpModule,NgbModule.forRoot(), PageHeaderModule,RouterModule.forChild(routes)],
    declarations: [ManagerComponent, PayslipManagerComponent, DailycarlogManagerComponent, PolManagerComponent, JobManagerComponent, VoucherManagerComponent, JobHistoryComponent],
    providers:[ConfigService,AccountsService,CarService,StoreService,ManagerService],
    exports: [RouterModule]
})
export class  ManagerModule {}
