import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router'
import { CookieService } from 'ngx-cookie-service';
import { InformationService } from '../../../services/information.service';
import { TableInfoRes } from '../../../interfaces/tableInfoRes.interface';
import { HttpClientModule, HttpClient, HttpResponse } from '@angular/common/http'
import { ErrorObject } from '../../../interfaces/errorObject.interface'

@Component({
	selector: 'app-admin-home',
	templateUrl: './admin-home.component.html',
	styleUrls: ['./admin-home.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminHomeComponent implements OnInit{

	constructor(private router: Router, private cookieService: CookieService, private informationService: InformationService) { }

	home_titles: string | undefined = undefined;
	index_titles_id: number = 0;


	current_alert: boolean = false;
	myAlert(message: string, type: string): void {
		const alertPlaceholder: HTMLElement | null = document.getElementById('liveAlertPlaceholder');
		if(!this.current_alert){
			this.current_alert = true;
			const wrapper: HTMLElement = document.createElement('div');
			wrapper.innerHTML = [
				`<div class="alert alert-${type}" role="alert">`,
				`   <div style="text-align: center;">${message}</div>`,
				'</div>'
				].join('');
			if(alertPlaceholder !== null){
				alertPlaceholder.append(wrapper);
				setTimeout(() => {
					alertPlaceholder.innerHTML = '';
					this.current_alert = false;
				}, 5000);
			}
		}
	}

	update(titles: string): void {
		if(this.home_titles !== titles){
			if(!this.cookieService.get('JWT')){
				this.router.navigate(['error403']);
			}
			else{
				const cookieValue: string = this.cookieService.get('JWT');
				this.informationService.editInformationTable(cookieValue, this.index_titles_id, "index_titles", titles)
				.subscribe(
					(response: HttpResponse<TableInfoRes>): void  => {
						this.myAlert("Titles updated successfully", 'success');
						this.home_titles = titles;
					},
					(error: HttpResponse<ErrorObject>): void => {
						if(error.body !== null){
							this.myAlert(error.body.error.message ?? 'Unknown error while updating information', 'danger');
							console.error(error.body.error);
						}
					}
				);
			}
		}
		else{
			this.myAlert('Information not edited', 'danger');
		}
	}

	ngOnInit(): void {
		this.informationService.getInformationTable()
		.subscribe(
			(response: HttpResponse<TableInfoRes[]>): void  => {
				if(response.body !== null){
					for(let i: number = 0; i < response.body.length; i++){
						if(response.body[i].name === "index_titles" && response.body[i].information){
							this.home_titles = response.body[i].information;
							this.index_titles_id = i + 1;
							break;
						}
					}
				}
			},
			(error: HttpResponse<ErrorObject>): void => {
				if(error.body !== null){
					this.myAlert(error.body.error.message ?? 'Unknown error while retrieving the information table', 'danger');
					console.error(error.body.error);
				}
			}
		);
	}
}
