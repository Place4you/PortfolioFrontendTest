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

	projectItems:	Project[] = [];
	isLogged:		boolean = !!this.cookieService.get('JWT');

	viewMore(id: number): void {
		const moreSection:	HTMLElement | null = document.getElementById(`viewMore_${id}`);
		const moreButton:	HTMLElement | null = document.getElementById(`viewMoreButton_${id}`);
		const lessButton:	HTMLElement | null = document.getElementById(`viewLessButton_${id}`);

		if (moreSection !== null && moreButton !== null && lessButton !== null) {
			const displayValue: string = getComputedStyle(moreSection)?.display ?? '';
			moreSection.style.display 	= displayValue === 'block' ? 'none' : 'block';
			lessButton.style.display 	= displayValue === 'block' ? 'none' : 'block';
			moreButton.style.display 	= displayValue === 'block' ? 'block' : 'none';
		}
	}

	ngOnInit(): void {
		this.workService.getItems()
		.subscribe(
			(response: HttpResponse<TableWorkItemRes[]>): void  => {
				if (response.body !== null) {
					for (let workItem of response.body) {
						this.projectItems.push(workItem);
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