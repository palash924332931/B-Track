import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import {Routes,RouterModule,Route} from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpModule} from '@angular/http'
import { AdminComponent } from './admin.component';
import { PageHeaderModule } from './../../shared';
import { PTableModule,AlertModule } from './../../shared';
import { ConfigService,AdminService,CommonService,CarService } from './../../shared/services';
import { EmployeeComponent } from './employee/employee.component';
import { RoleComponent } from './role/role.component';
import { EmployeeDetailsComponent } from './employee/employee-details/employee-details.component';
import { RootComponent } from './root/root.component';
import { RootCostComponent } from './root-cost/root-cost.component';
import { RootDetailsComponent } from './root/root-details/root-details.component';
import { RootCostDetailsComponent } from './root-cost/root-cost-details/root-cost-details.component';
import { RolePermissionComponent } from './role-permission/role-permission.component';
import { SpecialActivityComponent } from './special-activity/special-activity.component';
import { VendorComponent } from './vendor/vendor.component';
import { VendorDetailsComponent } from './vendor/vendor-details/vendor-details.component'

const routes:Routes=[

    {        
        path: '',
        children: [
            {path:'',component:AdminComponent},
            { path: 'employee', component: EmployeeComponent},
            { path: 'employee/:employeeId', component: EmployeeDetailsComponent},
            { path: 'root', component: RootComponent},
            { path: 'root/:rootId', component: RootDetailsComponent},
            { path: 'root-cost', component: RootCostComponent},
            { path: 'root-cost/:rootCostId', component: RootCostDetailsComponent},
            { path: 'role', component: RoleComponent},
            { path: 'role-permission', component: RolePermissionComponent},
            { path: 'special-activity', component: SpecialActivityComponent},
            { path: 'vendor', component: VendorComponent},
            { path: 'vendor/:vendorId', component: VendorDetailsComponent},
            
        ]
    } 
]

@NgModule({
    imports: [CommonModule, NgbModule.forRoot(),FormsModule,ReactiveFormsModule,PTableModule,AlertModule,HttpModule, PageHeaderModule,RouterModule.forChild(routes)],
    declarations: [AdminComponent, EmployeeComponent,  RoleComponent, EmployeeDetailsComponent, RootComponent, RootCostComponent, RootDetailsComponent, RootCostDetailsComponent, RolePermissionComponent, SpecialActivityComponent, VendorComponent, VendorDetailsComponent],
    providers:[ConfigService,AdminService,CommonService,CarService],
    exports: [RouterModule]
})
export class  AdminModule {}
