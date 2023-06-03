import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import {
	HttpClientModule,
	HttpClient,
	HttpResponse
} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { WorkService } from '@@shared/services/work.service';
import { AlertService } from '@@shared/services/alert.service';
import { ErrorObject } from '@@shared/interfaces/errorObject.interface';
import { TableWorkItemRes } from '@@shared/interfaces/tableWorkItemRes.interface';

@Component({
	selector: 'app-admin-work',
	templateUrl: './admin-work.component.html',
	styleUrls: ['./admin-work.component.scss']
})
export class AdminWorkComponent implements AfterViewInit {

	constructor(
		private alertService: AlertService, 
		private router: Router, 
		private cookieService: CookieService, 
		private workService: WorkService
	) { }

	currentValue:		string = "add";
	foundItemId:		boolean = false;
	projectToEdit:	TableWorkItemRes = { } as TableWorkItemRes;
	cookieValue:		string = this.cookieService.get('JWT');

	methodChange(value: string): void {
		if (value !== this.currentValue) {
			this.foundItemId = false;
			this.currentValue = value;
		}
	}

	createItem(
		name: string,
		date: string,
		technologies: string,
		description: string,
		code_uri?: string,
		live_uri?: string,
		image_uri?: string,
		image_alt?: string
	): void {
		if (!name) this.alertService.myAlert("Field 'name' can't be null", 'danger');
		else if (!date) this.alertService.myAlert("Field 'date' can't be null", 'danger');
		else if (!technologies) this.alertService.myAlert("Field 'technologies' can't be null", 'danger');
		else if (!description) this.alertService.myAlert("Field 'description' can't be null", 'danger');

		else {
			if (!this.cookieValue) this.router.navigate(['error403']);
			else{
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
				},
				truthyItemData = Object.fromEntries(
					Object.entries(itemData).filter(([key, value]) => Boolean(value))
				);

				this.workService.createItem(
					this.cookieValue,
					name,
					date,
					technologies,
					description,
					truthyItemData
				).subscribe(
					(response: HttpResponse<TableWorkItemRes>): void  => {
						this.alertService.myAlert("Item created successfully", 'success');
						(document.getElementById("createItemForm") as HTMLFormElement).reset();
					},
					(error: HttpResponse<ErrorObject>): void => {
						this.alertService.myAlert(error.body?.error.message ?? 'Unknown error while creating item', 'danger');
						console.error(error.body?.error);
					}
				);
			}
		}
	}

	searchEditItem(inputId: string): void {
		const projectId: number = Number(inputId) || 0;
		if (projectId === 0) this.alertService.myAlert("Invalid project id", 'danger');
		else if (projectId < 1)this.alertService.myAlert("The project id must be greater than 0", 'danger');
		else if (projectId > 65535)this.alertService.myAlert("The project id must be lesser than 65536", 'danger');
		
		else {
			this.workService.getItem(projectId)
			.subscribe(
				(response: HttpResponse<TableWorkItemRes>): void  => {
					if (response.body !== null) {
						this.foundItemId = true;
						this.projectToEdit = {
							id: response.body.id,
							name: response.body.name,
							date: response.body.date,
							technologies: response.body.technologies,
							description: response.body.description,
						};
						if (response.body.code_uri) this.projectToEdit.code_uri = response.body.code_uri;
						if (response.body.live_uri) this.projectToEdit.live_uri = response.body.live_uri;
						if (response.body.image_uri) this.projectToEdit.image_uri = response.body.image_uri;
						if (response.body.image_alt) this.projectToEdit.image_alt = response.body.image_alt;
					}
				},
				(error: HttpResponse<ErrorObject>): void => {
					this.alertService.myAlert(error.body?.error.message ?? 'Unknown error while retrieving item', 'danger');
					console.error(error.body?.error);
				}
			);
		}
	}

	editItem(
		name: string,
		date: string,
		technologies: string,
		description: string,
		code_uri?: string,
		live_uri?: string,
		image_uri?: string,
		image_alt?: string
	): void {
		if (!name) this.alertService.myAlert("Field 'name' can't be null", 'danger');
		else if (!date) this.alertService.myAlert("Field 'date' can't be null", 'danger');
		else if (!technologies) this.alertService.myAlert("Field 'technologies' can't be null", 'danger');
		else if (!description) this.alertService.myAlert("Field 'description' can't be null", 'danger');
		
		else {
			if (this.projectToEdit.name) {
				let somethingChanged: boolean = false;
				if (name !== this.projectToEdit.name ||
					date !== this.projectToEdit.date ||
					technologies !== this.projectToEdit.technologies ||
					description !== this.projectToEdit.description ||
					code_uri !== this.projectToEdit.code_uri ||
					live_uri !== this.projectToEdit.live_uri ||
					image_uri !== this.projectToEdit.image_uri ||
					image_alt !== this.projectToEdit.image_alt
				) somethingChanged = true;
				
				if (somethingChanged) {
					if (!this.cookieValue) this.router.navigate(['error403']);
					else {
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
						},
						truthyItemData = Object.fromEntries(
							Object.entries(itemData).filter(([key, value]) => Boolean(value))
						);

						this.workService.updateItem(
							this.cookieValue, 
							this.projectToEdit.id,
							name,
							date,
							technologies,
							description,
							truthyItemData
						).subscribe(
							(response: HttpResponse<TableWorkItemRes>): void  => {
								this.alertService.myAlert("Item updated successfully", 'success');
								this.projectToEdit.name = name;
								this.projectToEdit.date = date;
								this.projectToEdit.technologies = technologies;
								this.projectToEdit.description = description;
								this.projectToEdit.code_uri = code_uri;
								this.projectToEdit.live_uri = live_uri;
								this.projectToEdit.image_uri = image_uri;
								this.projectToEdit.image_alt = image_alt;
							},
							(error: HttpResponse<ErrorObject>): void => {
								this.alertService.myAlert(error.body?.error.message ?? 'Unknown error while updating item', 'danger');
								console.error(error.body?.error);
							}
						);
					}
				}
				else {
					this.alertService.myAlert("Project not edited", 'danger');
				}
			}
			else {
				this.alertService.myAlert("Project to update not found", 'danger');
				this.foundItemId = false;
			}
		}
	}

	deleteItem(inputId: string): void {
		const projectId: number = Number(inputId) || 0;
		if (projectId === 0) this.alertService.myAlert("Invalid project id", 'danger');
		else if (projectId < 1) this.alertService.myAlert("The project id must be greater than 0", 'danger');
		else if (projectId > 65535) this.alertService.myAlert("The project id must be lesser than 65536", 'danger');
		
		else {
			if (!this.cookieValue) this.router.navigate(['error403']);
			else {
				this.workService.deleteItem(
					this.cookieValue,
					projectId
				).subscribe(
					(response: HttpResponse<{ }>): void  => {
						this.alertService.myAlert("Item deleted successfully", 'success');
						(document.getElementById("deleteItemForm") as HTMLFormElement).reset;
					},
					(error: HttpResponse<ErrorObject>): void => {
						this.alertService.myAlert(error.body?.error.message ?? 'Unknown error while deleting item', 'danger');
						console.error(error.body?.error);
					}
				);
			}
		}
	}

	ngAfterViewInit(): void {
		const dateInput: HTMLInputElement = document.getElementById("addDate") as HTMLInputElement;
		dateInput && (dateInput.max = new Date().toLocaleDateString('fr-ca'));
		dateInput && (dateInput.value = new Date().toLocaleDateString('fr-ca'));
	}
}
