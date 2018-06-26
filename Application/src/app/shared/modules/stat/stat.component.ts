import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Routes, RouterModule,Router } from '@angular/router';

@Component({
    selector: 'app-stat',
    templateUrl: './stat.component.html',
    styleUrls: ['./stat.component.scss']
})
export class StatComponent implements OnInit {
    @Input() bgClass: string;
    @Input() icon: string;
    @Input() count: number;
    @Input() label: string;
    @Input() viewLink: string = "";
    @Input() data: number;
    @Input() title: string='View Details';
    @Output() event: EventEmitter<any> = new EventEmitter();

    constructor() { }

    ngOnInit() {
    }

    fnClickDetails() {
           // this.router.navigateByUrl('./report/dailycarlog');
    }
}
