import { Component, AfterViewInit } from '@angular/core';
import { WorkService } from '../../../services/work.service';
import { Router } from '@angular/router'
import { CookieService } from 'ngx-cookie-service';
import { HttpClientModule, HttpClient, HttpResponse } from '@angular/common/http';
import { TableWorkItemRes } from '../../../interfaces/tableWorkItemRes.interface';
import { ErrorObject } from '../../../interfaces/errorObject.interface'

@Component({
	selector: 'app-admin-work',
	templateUrl: './admin-work.component.html',
	styleUrls: ['./admin-work.component.scss']
})
export class AdminWorkComponent implements AfterViewInit {

	constructor(private router: Router, private cookieService: CookieService, private workService: WorkService) { }

	error_message_add: string | undefined = undefined;
	error_message_edit: string | undefined = undefined;
	error_message_delete: string | undefined = undefined;
	current_value: string = "add";
	found_item_id: boolean = false;

	project_to_edit: TableWorkItemRes = {} as TableWorkItemRes;

	reset_default_values(): void {
		this.error_message_add    = undefined;
		this.error_message_edit   = undefined;
		this.error_message_delete = undefined;
		this.current_value        = "add";
		this.found_item_id        = false;
	}

	method_change(event: Event): void {
		const value: string = (event.target as HTMLFormElement)['value'];
		if(value !== this.current_value){
			if(value === "add"){
				this.reset_default_values();
				this.current_value = "add";
			}
			else if(value === "edit"){
				this.reset_default_values();
				this.current_value = "edit";
			}
			else if(value === "delete"){
				this.reset_default_values();
				this.current_value = "delete";
			}
		}
	}

	create_item(
		name: string,
		date: string,
		technologies: string,
		description: string,
		code_uri: string,
		live_uri: string,
		image_uri: string,
		image_alt: string
		): void {

		if(!name){
			this.error_message_add = "Field <name> can't be null";
		}
		else if(!date){
			this.error_message_add = "Field <date> can't be null";
		}
		else if(!technologies){
			this.error_message_add = "Field <technologies> can't be null";
		}
		else if(!description){
			this.error_message_add = "Field <description> can't be null";
		}

		else {
			if(!this.cookieService.get('JWT')){
				this.router.navigate(['login']);
			}
			else{
				const cookieValue: string = this.cookieService.get('JWT');
				this.workService.createItem(cookieValue, name, date, technologies, description, code_uri, live_uri, image_uri, image_alt)
				.subscribe(
					(response: HttpResponse<TableWorkItemRes>): void  => {
						this.router.navigate(['home']);
						this.error_message_add = "";
					},
					(error: HttpResponse<ErrorObject>): void => {
						if(error.body !== null){
							console.log(error.body.error);
							// redirect to error pages
						}
					}
				);
			}
		}
	}

	search_edit_item(inputId: string): void {
		const projectId: number = Number(inputId) || 0;
		if(projectId === 0){
			this.error_message_edit = "Invalid project id";
		}
		else if(projectId < 1){
			this.error_message_edit = "The project id must be greater than 0";
		}
		else if(projectId > 65535){
			this.error_message_edit = "The project id must be lesser than 65536";
		}
		else {
			this.workService.getItem(projectId)
			.subscribe(
				(response: HttpResponse<TableWorkItemRes>): void  => {
					if(response.body !== null){
						this.error_message_edit = "";
						this.found_item_id = true;
						this.project_to_edit = {
							id: response.body.id,
							name: response.body.name,
							date: response.body.date,
							technologies: response.body.technologies,
							description: response.body.description,
							code_uri: response.body.code_uri,
							live_uri: response.body.live_uri,
							image_uri: response.body.image_uri,
							image_alt: response.body.image_alt
						}
					}
				},
				(error: HttpResponse<ErrorObject>): void => {
					if(error.body !== null){
						console.log(error.body.error);
						// redirect to error pages
					}
				}
			);
		}
	}

	edit_item(
		name: string,
		date: string,
		technologies: string,
		description: string,
		code_uri: string,
		live_uri: string,
		image_uri: string,
		image_alt: string
		): void {
		if(!name){
			this.error_message_edit = "Field <name> can't be null";
		}
		else if(!date){
			this.error_message_edit = "Field <date> can't be null";
		}
		else if(!technologies){
			this.error_message_edit = "Field <technologies> can't be null";
		}
		else if(!description){
			this.error_message_edit = "Field <description> can't be null";
		}
		else {
			if(this.project_to_edit.name){
				let something_changed: boolean = false;
				if(name !== this.project_to_edit.name){
					something_changed = true;
				}
				if(date !== this.project_to_edit.date){
					something_changed = true;
				}
				if(technologies !== this.project_to_edit.technologies){
					something_changed = true;
				}
				if(description !== this.project_to_edit.description){
					something_changed = true;
				}
				if(code_uri !== this.project_to_edit.code_uri){
					something_changed = true;
				}
				if(live_uri !== this.project_to_edit.live_uri){
					something_changed = true;
				}
				if(image_uri !== this.project_to_edit.image_uri){
					something_changed = true;
				}
				if(image_alt !== this.project_to_edit.image_alt){
					something_changed = true;
				}

				if(something_changed){
					if(!this.cookieService.get('JWT')){
						this.router.navigate(['login']);
					}
					else{
						const cookieValue: string = this.cookieService.get('JWT');
						this.workService.updateItem(cookieValue, this.project_to_edit.id, name, date, technologies, description, code_uri, live_uri, image_uri, image_alt)
						.subscribe(
							(response: HttpResponse<TableWorkItemRes>): void  => {
								this.router.navigate(['home']);
								this.error_message_edit = undefined;
							},
							(error: HttpResponse<ErrorObject>): void => {
								if(error.body !== null){
									console.log(error.body.error);
									// redirect to error pages
								}
							}
						);
					}
				}
				else {
					this.error_message_edit = "Project not edited";
				}
			}
			else {
				this.error_message_edit = "Project to update not found";
				this.found_item_id = false;
			}
		}
	}

	delete_item(inputId: string): void {
		const projectId: number = Number(inputId) || 0;
		if(projectId === 0){
			this.error_message_delete = "Invalid project id";
		}
		else if(projectId < 1){
			this.error_message_delete = "The project id must be greater than 0";
		}
		else if(projectId > 65535){
			this.error_message_delete = "The project id must be lesser than 65536";
		}
		else {
			if(!this.cookieService.get('JWT')){
				this.router.navigate(['login']);
			}
			else{
				const cookieValue: string = this.cookieService.get('JWT');
				this.workService.deleteItem(cookieValue, projectId)
				.subscribe(
					(response: HttpResponse<{}>): void  => {
						this.router.navigate(['home']);
						this.error_message_delete = undefined;
					},
					(error: HttpResponse<ErrorObject>): void => {
						if(error.body !== null){
							console.log(error.body.error);
							// redirect to error pages
						}
					}
				);
			}
		}
	}

	ngAfterViewInit(): void {
		const date_input: HTMLInputElement = document.getElementById("add_date") as HTMLInputElement;
		if(date_input !== null){
			date_input.max = new Date().toLocaleDateString('fr-ca');
			date_input.value = new Date().toLocaleDateString('fr-ca');
		}
	}
}
