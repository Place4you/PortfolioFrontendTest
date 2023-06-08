import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WorkComponent } from './work.component';

@NgModule({
	declarations: [ ],
	imports: [
		CommonModule,
		RouterModule.forChild([{ path: '', component: WorkComponent }])
	]
})
export class WorkModule { }