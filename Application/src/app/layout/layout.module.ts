import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpModule} from '@angular/http'
import { AlertModule } from './../shared';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { CommonService, ConfigService } from '../shared/services'


//import { PTableComponent } from './components/p-table/p-table.component';
import { PTableModule } from './../shared';
import { AboutComponent } from './about/about.component';

@NgModule({
    imports: [
        CommonModule,
        LayoutRoutingModule,
        PTableModule,
        FormsModule,
        ReactiveFormsModule,HttpModule,AlertModule,
        NgbDropdownModule.forRoot()
    ],
    providers:[CommonService, ConfigService],
    declarations: [LayoutComponent, SidebarComponent, HeaderComponent, AboutComponent]
})
export class LayoutModule {}
