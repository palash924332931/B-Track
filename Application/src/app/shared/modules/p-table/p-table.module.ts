import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PTableComponent } from './p-table.component';

import { MakeDraggable, MakeDroppable, Draggable } from './drag-drop-service/drag.n.drop';

@NgModule({
    imports: [CommonModule, RouterModule,FormsModule,ReactiveFormsModule],
    declarations: [PTableComponent,MakeDraggable, MakeDroppable, Draggable],
    exports: [PTableComponent]
})
export class PTableModule {}
