import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Routes,RouterModule,Route} from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpModule} from '@angular/http'
import { AccountsComponent } from './accounts.component';
import { PageHeaderModule } from './../../shared';
import { PTableModule,AlertModule } from './../../shared';
import { ConfigService, AccountsService,CarService } from './../../shared/services';
import { PayslipBookComponent } from './payslip-book/payslip-book.component';
import { DailyPaymentLogComponent } from './daily-payment-log/daily-payment-log.component';
import { PayslipDetailsComponent } from './payslip-list/payslip-details/payslip-details.component';
import { PayslipListComponent } from './payslip-list/payslip-list.component';
import { DailyPaymentDetailsComponent } from './daily-payment-log/daily-payment-details/daily-payment-details.component';
import { PayslipBookDetailsComponent } from './payslip-book/payslip-book-details/payslip-book-details.component'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TripSheetComponent } from './trip-sheet/trip-sheet.component';
import { VoucherComponent } from './voucher/voucher.component';
import { VoucherDetailsComponent } from './voucher/voucher-details/voucher-details.component';

const routes:Routes=[   
    {        
        path: '',
        children: [
            {path:'',component:AccountsComponent},
            { path: 'payslip-list', component: PayslipListComponent},
            { path: 'payslip-list/:payslipId', component: PayslipDetailsComponent},
            { path: 'daily-payment-log', component: DailyPaymentLogComponent},
            { path: 'daily-payment-log/:paymentId', component: DailyPaymentDetailsComponent},
            { path: 'payslip-book', component: PayslipBookComponent},
            { path: 'payslip-book/:bookId', component: PayslipBookDetailsComponent},
            { path: 'tripsheet', component: TripSheetComponent},
            { path: 'voucher', component: VoucherComponent},
            { path: 'voucher/:voucherId', component: VoucherDetailsComponent},
        ]
    } 
]

@NgModule({
    imports: [CommonModule,FormsModule,ReactiveFormsModule,PTableModule,AlertModule,HttpModule,NgbModule.forRoot(), PageHeaderModule,RouterModule.forChild(routes)],
    declarations: [AccountsComponent, PayslipListComponent, PayslipBookComponent, DailyPaymentLogComponent, PayslipDetailsComponent, DailyPaymentDetailsComponent, PayslipBookDetailsComponent, TripSheetComponent, VoucherComponent, VoucherDetailsComponent],
    providers:[ConfigService,AccountsService,CarService],
    exports: [RouterModule]
})
export class  AccountsModule {}
