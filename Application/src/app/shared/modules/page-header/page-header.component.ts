import { Component, OnInit, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-page-header',
    templateUrl: './page-header.component.html',
    styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent implements OnInit {
    @Input() heading: string;
    @Input() icon: string;
    constructor() {}

    public UserInfo: any = JSON.parse(localStorage.getItem("car-system-user-info-option-b"));
    
    ngOnInit() {
        
    }
}
