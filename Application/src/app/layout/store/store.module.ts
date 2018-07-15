import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Routes,RouterModule,Route} from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpModule} from '@angular/http'
import { PageHeaderModule } from './../../shared';
import { PTableModule,AlertModule } from './../../shared';
import { ConfigService, AccountsService,CarService,AdminService,StoreService } from './../../shared/services';
import { NgbModule,NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { CustomNgbDateParserFormatter } from './../../shared/services/custom-date-formater'

import { StoreComponent } from './store.component';
import { JobListComponent } from './job-list/job-list.component';
//import { JobListComponent } from './job-list/job-list.component';
import { ItemListComponent } from './item-list/item-list.component';
import { ItemDetailsComponent } from './item-list/item-details/item-details.component';
import { JobDetailsComponent } from './job-list/job-details/job-details.component';
import { DemandListComponent } from './demand-list/demand-list.component';
import { DemandDetailsComponent } from './demand-list/demand-details/demand-details.component';
import { PolComponent } from './pol/pol.component';
import { PolDetailsComponent } from './pol/pol-details/pol-details.component';

const routes:Routes=[   
    {        
        path: '',
        children: [
            {path:'',component:JobListComponent},
            { path: 'items', component: ItemListComponent},
            { path: 'items/:itemId', component: ItemDetailsComponent},
            { path: 'jobs', component: JobListComponent},
            { path: 'jobs/:jobId', component: JobDetailsComponent},
            { path: 'demand', component: DemandListComponent},
            { path: 'demand/:demandId', component: DemandDetailsComponent},
            { path: 'pol', component: PolComponent},   
            { path: 'pol/:polId', component: PolDetailsComponent},          
        ]
    } 
]

@NgModule({
    imports: [CommonModule,FormsModule,ReactiveFormsModule,PTableModule,AlertModule,HttpModule,NgbModule.forRoot(), PageHeaderModule,RouterModule.forChild(routes)],
    declarations: [JobListComponent, JobDetailsComponent,ItemDetailsComponent,ItemListComponent, DemandListComponent, DemandDetailsComponent, PolComponent, PolDetailsComponent],
    providers:[ConfigService,AccountsService,CarService,AdminService,StoreService,{provide: NgbDateParserFormatter, useFactory: () => new CustomNgbDateParserFormatter()}],
    exports: [RouterModule]
})
export class  StoreModule {}
