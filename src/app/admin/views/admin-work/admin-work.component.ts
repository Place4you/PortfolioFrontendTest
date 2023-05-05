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

	current_value: string = "add";
	found_item_id: boolean = false;

	project_to_edit: TableWorkItemRes = {} as TableWorkItemRes;


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

	method_change(value: string): void {
		if(value !== this.current_value){
			this.found_item_id = false;
			this.current_value = value;
		}
	}

	create_item(
		name: string,
		date: string,
		technologies: string,
		description: string,
		code_uri?: string,
		live_uri?: string,
		image_uri?: string,
		image_alt?: string
	): void {
		if(!name){
			this.myAlert("Field 'name' can't be null", 'danger');
		}
		else if(!date){
			this.myAlert("Field 'date' can't be null", 'danger');
		}
		else if(!technologies){
			this.myAlert("Field 'technologies' can't be null", 'danger');
		}
		else if(!description){
			this.myAlert("Field 'description' can't be null", 'danger');
		}

		else {
			if(!this.cookieService.get('JWT')){
				this.router.navigate(['error403']);
			}
			else{
				const cookieValue: string = this.cookieService.get('JWT');
				const itemData: {
					code_uri: string | undefined,
					live_uri: string | undefined,
					image_uri: string | undefined,
					image_alt: string | undefined
				} = {
					code_uri,
					live_uri,
					image_uri,
					image_alt
				};
				const truthyItemData = Object.fromEntries(
					Object.entries(itemData).filter(([key, value]) => Boolean(value))
				);
				this.workService.createItem(cookieValue, name, date, technologies, description, truthyItemData)
				.subscribe(
					(response: HttpResponse<TableWorkItemRes>): void  => {
						this.myAlert("Item created successfully", 'success');
						const form: HTMLFormElement = <HTMLFormElement>document.getElementById("create_item_form");
						if(form !== null){
							form.reset();
						}
					},
					(error: HttpResponse<ErrorObject>): void => {
						if(error.body !== null){
							this.myAlert(error.body.error.message ?? 'Unknown error while creating item', 'danger');
							console.error(error.body.error);
						}
					}
				);
			}
		}
	}

	search_edit_item(inputId: string): void {
		const projectId: number = Number(inputId) || 0;
		if(projectId === 0){
			this.myAlert("Invalid project id", 'danger');
		}
		else if(projectId < 1){
			this.myAlert("The project id must be greater than 0", 'danger');
		}
		else if(projectId > 65535){
			this.myAlert("The project id must be lesser than 65536", 'danger');
		}
		else {
			this.workService.getItem(projectId)
			.subscribe(
				(response: HttpResponse<TableWorkItemRes>): void  => {
					if(response.body !== null){
						this.found_item_id = true;
						this.project_to_edit = {
							id: response.body.id,
							name: response.body.name,
							date: response.body.date,
							technologies: response.body.technologies,
							description: response.body.description,
						}
						if(response.body.code_uri) this.project_to_edit.code_uri = response.body.code_uri;
						if(response.body.live_uri) this.project_to_edit.live_uri = response.body.live_uri;
						if(response.body.image_uri) this.project_to_edit.image_uri = response.body.image_uri;
						if(response.body.image_alt) this.project_to_edit.image_alt = response.body.image_alt;
						this.myAlert("Project found", 'success');
					}
				},
				(error: HttpResponse<ErrorObject>): void => {
					if(error.body !== null){
						this.myAlert(error.body.error.message ?? 'Unknown error while retrieving item', 'danger');
						console.error(error.body.error);
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
		code_uri?: string,
		live_uri?: string,
		image_uri?: string,
		image_alt?: string
	): void {
		if(!name){
			this.myAlert("Field 'name' can't be null", 'danger');
		}
		else if(!date){
			this.myAlert("Field 'date' can't be null", 'danger');
		}
		else if(!technologies){
			this.myAlert("Field 'technologies' can't be null", 'danger');
		}
		else if(!description){
			this.myAlert("Field 'description' can't be null", 'danger');
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
						this.router.navigate(['error403']);
					}
					else{
						const cookieValue: string = this.cookieService.get('JWT');
						const itemData: {
							code_uri: string | undefined,
							live_uri: string | undefined,
							image_uri: string | undefined,
							image_alt: string | undefined
						} = {
							code_uri,
							live_uri,
							image_uri,
							image_alt
						};
						const truthyItemData = Object.fromEntries(
							Object.entries(itemData).filter(([key, value]) => Boolean(value))
						);
						this.workService.updateItem(cookieValue, this.project_to_edit.id, name, date, technologies, description, truthyItemData)
						.subscribe(
							(response: HttpResponse<TableWorkItemRes>): void  => {
								this.myAlert("Item updated successfully", 'success');
								this.project_to_edit.name = name;
								this.project_to_edit.date = date;
								this.project_to_edit.technologies = technologies;
								this.project_to_edit.description = description;
								this.project_to_edit.code_uri = code_uri;
								this.project_to_edit.live_uri = live_uri;
								this.project_to_edit.image_uri = image_uri;
								this.project_to_edit.image_alt = image_alt;
							},
							(error: HttpResponse<ErrorObject>): void => {
								if(error.body !== null){
									this.myAlert(error.body.error.message ?? 'Unknown error while updating item', 'danger');
									console.error(error.body.error);
								}
							}
						);
					}
				}
				else {
					this.myAlert("Project not edited", 'danger');
				}
			}
			else {
				this.myAlert("Project to update not found", 'danger');
				this.found_item_id = false;
			}
		}
	}

	delete_item(inputId: string): void {
		const projectId: number = Number(inputId) || 0;
		if(projectId === 0){
			this.myAlert("Invalid project id", 'danger');
		}
		else if(projectId < 1){
			this.myAlert("The project id must be greater than 0", 'danger');
		}
		else if(projectId > 65535){
			this.myAlert("The project id must be lesser than 65536", 'danger');
		}
		else {
			if(!this.cookieService.get('JWT')){
				this.router.navigate(['error403']);
			}
			else{
				const cookieValue: string = this.cookieService.get('JWT');
				this.workService.deleteItem(cookieValue, projectId)
				.subscribe(
					(response: HttpResponse<{}>): void  => {
						this.myAlert("Item deleted successfully", 'success');
						const form: HTMLFormElement = <HTMLFormElement>document.getElementById("delete_item_form");
						if(form !== null){
							form.reset();
						}
					},
					(error: HttpResponse<ErrorObject>): void => {
						if(error.body !== null){
							this.myAlert(error.body.error.message ?? 'Unknown error while deleting item', 'danger');
							console.error(error.body.error);
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
