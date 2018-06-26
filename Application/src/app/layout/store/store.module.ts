import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Routes,RouterModule,Route} from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpModule} from '@angular/http'
import { PageHeaderModule } from './../../shared';
import { PTableModule,AlertModule } from './../../shared';
import { ConfigService, AccountsService,CarService } from './../../shared/services';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { StoreComponent } from './store.component';
import { JobListComponent } from './job-list/job-list.component';
//import { JobListComponent } from './job-list/job-list.component';
import { ItemListComponent } from './item-list/item-list.component';
import { ItemDetailsComponent } from './item-list/item-details/item-details.component';
import { JobDetailsComponent } from './job-list/job-details/job-details.component';

const routes:Routes=[   
    {        
        path: '',
        children: [
            {path:'',component:JobListComponent},
            { path: 'items', component: ItemListComponent},
            { path: 'items/:itemId', component: ItemDetailsComponent},
            { path: 'jobs', component: JobListComponent},
            { path: 'jobs/:jobId', component: JobDetailsComponent},
            //{ path: 'payslip-list/:payslipId', component: PayslipDetailsComponent},            
        ]
    } 
]

@NgModule({
    imports: [CommonModule,FormsModule,ReactiveFormsModule,PTableModule,AlertModule,HttpModule,NgbModule.forRoot(), PageHeaderModule,RouterModule.forChild(routes)],
    declarations: [JobListComponent, JobDetailsComponent,ItemDetailsComponent,ItemListComponent],
    providers:[ConfigService,AccountsService,CarService],
    exports: [RouterModule]
})
export class  StoreModule {}
