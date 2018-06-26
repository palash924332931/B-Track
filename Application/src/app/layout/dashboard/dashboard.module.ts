import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfigService, ReportService } from './../../shared/services';
import {HttpModule} from '@angular/http'
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { ChatComponent} from './components';
import { StatModule } from '../../shared';

@NgModule({
    imports: [
        CommonModule,
        NgbCarouselModule.forRoot(),
        NgbAlertModule.forRoot(),
        DashboardRoutingModule,
        StatModule,HttpModule
    ],
    declarations: [
        DashboardComponent,
        ChatComponent
    ],
    providers:[ReportService,ConfigService]
})
export class DashboardModule {}
