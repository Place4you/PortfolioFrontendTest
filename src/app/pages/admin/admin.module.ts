import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { RouterModule } from '@angular/router';


@NgModule({
	declarations: [ ],
	imports: [
		CommonModule,
		RouterModule.forChild([{ path: '', component: AdminComponent }])
	]
})
export class AdminModule { }
