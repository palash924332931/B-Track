import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HttpModule} from "@angular/http";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { ConfigService,LoginService } from '../shared/services'
import { AlertModule } from '../shared/modules'

@NgModule({
    imports: [CommonModule, LoginRoutingModule,HttpModule,FormsModule,ReactiveFormsModule,AlertModule],
    declarations: [LoginComponent],
    providers:[LoginService,ConfigService]
})
export class LoginModule {}
