import { NgModule } from '@angular/core';
import { NgbModule,NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { CustomNgbDateParserFormatter } from './../../shared/services/custom-date-formater'

import { CommonModule } from '@angular/common';
import { Routes, RouterModule, Route } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpModule} from '@angular/http'
import { ConfigService,CarService,CommonService,AdminService } from './../../shared/services';
import { PageHeaderModule } from './../../shared';
import { PTableModule,AlertModule } from './../../shared';
import { MyDatePickerModule } from 'mydatepicker';
import { CarListComponent } from './car-list/car-list.component';
import { CarTypeComponent } from './car-type/car-type.component';
import { DailyCarLogComponent } from './daily-car-log/daily-car-log.component';
import { CarDetailsComponent } from './car-list/car-details/car-details.component';
import { DailyCarLogDetailsComponent } from './daily-car-log/daily-car-log-details/daily-car-log-details.component';
import { DriverComponent } from './driver/driver.component';
import { DriverDetailsComponent } from './driver/driver-details/driver-details.component';


const routes: Routes = [
    {        
        path: '',
        children: [
            {path:'',component:CarListComponent},
            {path:'car-list',component:CarListComponent},
            {path: 'car-list/:carId', component: CarDetailsComponent},
            {path:'car-list',component:CarListComponent},
            {path: 'car-type', component: CarTypeComponent},
            {path:'car-log',component:DailyCarLogComponent},
            {path: 'car-log/:logId', component: DailyCarLogDetailsComponent},
            {path: 'driver', component: DriverComponent},
            {path: 'driver/:driverId', component: DriverDetailsComponent},
        ]
    }   
]

@NgModule({
    imports: [CommonModule, FormsModule,MyDatePickerModule, ReactiveFormsModule,HttpModule, PTableModule,AlertModule, PageHeaderModule, NgbModule.forRoot(), RouterModule.forChild(routes)],
    declarations: [CarListComponent, CarTypeComponent, DailyCarLogComponent, CarDetailsComponent, DailyCarLogDetailsComponent, DriverComponent, DriverDetailsComponent],
    exports: [RouterModule],
    providers:[ ConfigService,AdminService, CarService,CommonService,{provide: NgbDateParserFormatter, useFactory: () => new CustomNgbDateParserFormatter()}]
})
export class CarModule { }
