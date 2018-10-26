import { Component, OnInit } from '@angular/core';
import { AlertService } from '../shared/modules/alert/alert.service'
@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
    constructor(private alertService:AlertService) {}

    ngOnInit() {}
}
