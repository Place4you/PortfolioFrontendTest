import { Component, OnInit } from '@angular/core';
import {
	HttpClientModule,
	HttpClient,
	HttpResponse
} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { WorkService } from '@@shared/services/work.service';
import { ErrorObject } from '@@shared/interfaces/errorObject.interface';
import { TableWorkItemRes } from '@@shared/interfaces/tableWorkItemRes.interface';
import { AlertService } from '@@shared/services/alert.service';

interface Project { 
	id: number,
	name: string,
	date: string,
	technologies: string,
	description: string
	code_uri?: string,
	live_uri?: string,
	image_uri?: string,
	image_alt?: string
}

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
	) { }

	project_items:	Project[] = [];
	isLogged:		boolean = !!this.cookieService.get('JWT');

	view_more(id: number): void {
		const more_section:	HTMLElement | null = document.getElementById(`view_more_${id}`);
		const more_button:	HTMLElement | null = document.getElementById(`view_more_button_${id}`);
		const less_button:	HTMLElement | null = document.getElementById(`view_less_button_${id}`);

		if (more_section !== null && more_button !== null && less_button !== null) {
			const displayValue: string = getComputedStyle(more_section)?.display ?? '';
			more_section.style.display 	= displayValue === 'block' ? 'none' : 'block';
			less_button.style.display 	= displayValue === 'block' ? 'block' : 'none';
			more_button.style.display 	= displayValue === 'block' ? 'none' : 'block';
		}
	}

	ngOnInit(): void {
		this.workService.getItems()
		.subscribe(
			(response: HttpResponse<TableWorkItemRes[]>): void  => {
				if (response.body !== null) {
					for (let workItem of response.body) {
						this.project_items.push(workItem);
					}
				}
			},
			(error: HttpResponse<ErrorObject>): void => {
				this.alertService.myAlert(error.body?.error.message ?? 'Unknown error while retrieving the work items', 'danger');
				console.error(error.body?.error);
			}
		);
	}
}