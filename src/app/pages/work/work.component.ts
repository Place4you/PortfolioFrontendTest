import { Component, OnInit} from '@angular/core';
import {
	HttpClientModule,
	HttpClient,
	HttpResponse
} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Project } from "./interfaces";
import { WorkService } from '@@shared/services/work.service';
import { ErrorObject } from '@@shared/interfaces/errorObject.interface'
import { TableWorkItemRes } from '@@shared/interfaces/tableWorkItemRes.interface';
import { AlertService } from '@@shared/services/alert.service';

@Component({
	selector: 'app-work',
	templateUrl: './work.component.html',
	styleUrls: ['./work.component.scss']
})
export class WorkComponent implements OnInit {
	
	constructor(
		private cookieService: CookieService, 
		private alertService: AlertService, 
		private workService: WorkService
	){}

	project_items: Project[] = [];

	view_more(id: number): void {
		const more_section: HTMLElement | null = document.getElementById(`view_more_${id}`);
		const more_button: HTMLElement | null = document.getElementById(`view_more_button_${id}`);
		const less_button: HTMLElement | null = document.getElementById(`view_less_button_${id}`);
		if(more_section !== null && more_button !== null && less_button !== null){
			if(more_section.style.display === 'none'){
				more_section.style.display = 'block';
				more_button.style.display = 'none';
				less_button.style.display = 'block';
			}
			else {
				more_section.style.display = 'none';
				more_button.style.display = 'block';
				less_button.style.display = 'none';
			}
		}
	}

	isLogged(): boolean {
		if(!this.cookieService.get('JWT')){
			return false;
		}
		return true;
	}

	ngOnInit(): void {
		this.workService.getItems()
		.subscribe(
			(response: HttpResponse<TableWorkItemRes[]>): void  => {
				if(response.body !== null){
					for(let i: number = 0; i < response.body.length; i++){
						this.project_items.push(response.body[i]);
					}
				}
			},
			(error: HttpResponse<ErrorObject>): void => {
				if(error.body !== null){
					this.alertService.myAlert(error.body.error.message ?? 'Unknown error while retrieving the work items', 'danger');
					console.error(error.body.error);
				}
			}
		);
	}
}
