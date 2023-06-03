import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
	HttpClientModule,
	HttpClient,
	HttpResponse
} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { AboutService } from '@@shared/services/about.service';
import { InformationService } from '@@shared/services/information.service';
import { AlertService } from '@@shared/services/alert.service';
import { ErrorObject } from '@@shared/interfaces/errorObject.interface';
import { TableInfoRes } from '@@shared/interfaces/tableInfoRes.interface';
import { TableAboutItemRes } from '@@shared/interfaces/tableAboutItemRes.interface';

@Component({
	selector: 'app-admin-about',
	templateUrl: './admin-about.component.html',
	styleUrls: ['./admin-about.component.scss']
})
export class AdminAboutComponent implements OnInit,AfterViewInit {

	constructor(
		private alertService: AlertService, 
		private router: Router, 
		private cookieService: CookieService, 
		private aboutService: AboutService, 
		private informationService: InformationService
	) { }

	journeyInfo:           string | undefined = undefined;
	currentValue:          string = "add";
	foundItemId:          boolean = false;
	journeyInfoId:        number = 0;
	itemToEdit:           TableAboutItemRes = { } as TableAboutItemRes;
	cookieValue: 			string = this.cookieService.get('JWT');

	editJourney(text: string): void {
		if(!text) this.alertService.myAlert("Field 'journey' can't be null", 'danger');
		else {
			if (text !== this.journeyInfo) {
				if (!this.cookieValue) this.router.navigate(['error403']);
				else {
					this.informationService.editInformationTable(
						this.cookieValue,
						this.journeyInfoId,
						"journey",
						text
					).subscribe(
						(response: HttpResponse<TableInfoRes>): void  => {
							this.alertService.myAlert("Journey text updated successfully", 'success');
							this.journeyInfo = text;
						},
						(error: HttpResponse<ErrorObject>): void => {
							this.alertService.myAlert(error.body?.error.message ?? 'Unknown error while updating information', 'danger');
							console.error(error.body?.error);
						}
					);
				}
			}
			else {
				this.alertService.myAlert("Information not edited", 'danger');
			}
		}
	}

	methodChange(value: string): void {
		if (value !== this.currentValue) {
			this.foundItemId = false;
			this.currentValue = value;
		}
	}

	createItem(
		input_type: string,
		name: string,
		date: string,
		description: string,
		link?: string,
		image_uri?: string,
		image_alt?: string
	): void {
		const type: number = Number(input_type) || 0;
		if (type === 0) this.alertService.myAlert("Invalid item type", 'danger');
		else if (type < 1) this.alertService.myAlert("Item type must be greater than 0", 'danger');
		else if (type > 3) this.alertService.myAlert("Item type must be lesser than 4", 'danger');
		else if (!name) this.alertService.myAlert("Field 'name' can't be null", 'danger');
		else if (!date) this.alertService.myAlert("Field 'date' can't be null", 'danger');
		else if (!description) this.alertService.myAlert("Field 'description' can't be null", 'danger');
		
		else {
			if (!this.cookieValue) this.router.navigate(['error403']);
			else {
				const itemData: {
					link: string | undefined, 
					image_uri: string | undefined, 
					image_alt: string | undefined
				} = {
					link,
					image_uri,
					image_alt
				},
				truthyItemData = Object.fromEntries(
					Object.entries(itemData).filter(([key, value]) => Boolean(value))
				);
				
				this.aboutService.createItem(
					this.cookieValue,
					type,
					name,
					date,
					description,
					truthyItemData
				).subscribe(
					(response: HttpResponse<TableAboutItemRes>): void  => {
						this.alertService.myAlert("Item created successfully", 'success');
						(document.getElementById("createItemForm") as HTMLFormElement).reset;
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
		const itemId: number = Number(inputId) || 0;
		if (itemId === 0) this.alertService.myAlert("Invalid item id", 'danger');
		else if (itemId < 1) this.alertService.myAlert("The item id must be greater than 0", 'danger');
		else if (itemId > 65535) this.alertService.myAlert("The item id must be lesser than 65536", 'danger');
		
		else {
			this.aboutService.getItem(itemId)
			.subscribe(
				(response: HttpResponse<TableAboutItemRes>): void  => {
					if (response.body !== null) {
						this.foundItemId = true;
						this.itemToEdit = {
							id: response.body.id,
							item_type: response.body.item_type,
							name: response.body.name,
							date: response.body.date,
							description: response.body.description,
						};
						if (response.body.link) this.itemToEdit.link = response.body.link;
						if (response.body.image_uri) this.itemToEdit.image_uri = response.body.image_uri;
						if (response.body.image_alt) this.itemToEdit.image_alt = response.body.image_alt;
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
		description: string,
		link?: string,
		image_uri?: string,
		image_alt?: string
	): void {
		if (!name) this.alertService.myAlert("Field 'name' can't be null", 'danger');
		else if (!date) this.alertService.myAlert("Field 'date' can't be null", 'danger');
		else if (!description) this.alertService.myAlert("Field 'description' can't be null", 'danger');
		
		else {
			if (this.itemToEdit.name) {
				let somethingChanged: boolean = false;
				if (name !== this.itemToEdit.name ||
					date !== this.itemToEdit.date ||
					description !== this.itemToEdit.description ||
					link !== this.itemToEdit.link ||
					image_uri !== this.itemToEdit.image_uri ||
					image_alt !== this.itemToEdit.image_alt
				) somethingChanged = true;
				
				if (somethingChanged) {
					if (!this.cookieValue) this.router.navigate(['error403']);
					else {
						const itemData: {
							link: string | undefined, 
							image_uri: string | undefined, 
							image_alt: string | undefined
						} = {
							link,
							image_uri,
							image_alt
						},
						truthyItemData = Object.fromEntries(
							Object.entries(itemData).filter(([key, value]) => Boolean(value))
						);
						this.aboutService.updateItem(
							this.cookieValue,
							this.itemToEdit.id,
							this.itemToEdit.item_type,
							name,
							date,
							description,
							truthyItemData
						).subscribe(
							(response: HttpResponse<TableAboutItemRes>): void  => {
								this.alertService.myAlert("Item updated successfully", 'success');
								this.itemToEdit.name = name;
								this.itemToEdit.date = date;
								this.itemToEdit.description = description;
								this.itemToEdit.link = link;
								this.itemToEdit.image_uri = image_uri;
								this.itemToEdit.image_alt = image_alt;
							},
							(error: HttpResponse<ErrorObject>): void => {
								this.alertService.myAlert(error.body?.error.message ?? 'Unknown error while updating item', 'danger');
								console.error(error.body?.error);
							}
						);
					}
				}
				else {
					this.alertService.myAlert("Item not edited", 'danger');
				}
			}
			else {
				this.alertService.myAlert("Item to update not found", 'danger');
				this.foundItemId = false;
			}
		}
	}

	deleteItem(inputId: string): void {
		const itemId: number = Number(inputId) || 0;
		if (itemId === 0) this.alertService.myAlert("Invalid item id", 'danger');
		else if (itemId < 1) this.alertService.myAlert("The item id must be greater than 0", 'danger');
		else if (itemId > 65535) this.alertService.myAlert("The item id must be lesser than 65536", 'danger');
		
		else {
			if (!this.cookieValue) this.router.navigate(['error403']);
			else {
				this.aboutService.deleteItem(
					this.cookieValue,
					itemId
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

	ngOnInit(): void {
		this.informationService.getInformationTable()
		.subscribe(
			(response: HttpResponse<TableInfoRes[]>): void  => {
				if (response.body !== null) {
					for (let i: number = 0; i < response.body.length; i++) {
						if (response.body[i].name === "journey" && response.body[i].information) {
							this.journeyInfo = response.body[i].information;
							this.journeyInfoId = i + 1;
							break;
						}
					}
				}
			},
			(error: HttpResponse<ErrorObject>): void => {
				this.alertService.myAlert(error.body?.error.message ?? 'Unknown error while retrieving the information table', 'danger');
				console.error(error.body?.error);
			}
		);
	}

	ngAfterViewInit(): void {
		const dateInput: HTMLInputElement = document.getElementById("addDate") as HTMLInputElement;
		dateInput && (dateInput.max = new Date().toLocaleDateString('fr-ca'));
		dateInput && (dateInput.value = new Date().toLocaleDateString('fr-ca'));
	}

}