import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router'
import { CookieService } from 'ngx-cookie-service';
import { AboutService } from '../../../services/about.service';
import { InformationService } from '../../../services/information.service';
import { ErrorObject } from '../../../interfaces/errorObject.interface'
import { TableInfoRes } from '../../../interfaces/tableInfoRes.interface';
import { HttpClientModule, HttpClient, HttpResponse } from '@angular/common/http'
import { TableAboutItemRes } from '../../../interfaces/tableAboutItemRes.interface';

@Component({
	selector: 'app-admin-about',
	templateUrl: './admin-about.component.html',
	styleUrls: ['./admin-about.component.scss']
})
export class AdminAboutComponent implements AfterViewInit {

	constructor(private router: Router, private cookieService: CookieService, private aboutService: AboutService, private informationService: InformationService) { }

	journey_info:           string | undefined = undefined;
	current_value:          string = "add";
	found_item_id:          boolean = false;
	journey_info_id:        number = 0;
	item_to_edit:           TableAboutItemRes = {} as TableAboutItemRes;


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

	reset_default_values(): void {
		this.current_value = "add";
		this.found_item_id = false;
	}

	edit_journey(text: string): void {
		if(!text){
			this.myAlert("Field 'journey' can't be null", 'danger');
		}
		else {
			if(text !== this.journey_info){
				if(!this.cookieService.get('JWT')){
					this.router.navigate(['error403']);
				}
				else{
					const cookieValue: string = this.cookieService.get('JWT');
					this.informationService.editInformationTable(cookieValue, this.journey_info_id, "journey", text)
					.subscribe(
						(response: HttpResponse<TableInfoRes>): void  => {
							this.router.navigate(['home']);
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
				this.myAlert("Information not edited", 'danger');
			}
		}
	}

	method_change(event: Event): void {
		const value: string = (event.target as HTMLFormElement)['value'];
		if(value !== this.current_value){
			this.reset_default_values();
			this.current_value = value;
		}
	}

	create_item(
		input_type: string,
		name: string,
		date: string,
		description: string,
		link?: string,
		image_uri?: string,
		image_alt?: string
	): void {
		const type: number = Number(input_type) || 0;
		if(type === 0){
			this.myAlert("Invalid item type", 'danger');
		}
		else if(type < 1){
			this.myAlert("Item type must be greater than 0", 'danger');
		}
		else if(type > 3){
			this.myAlert("Item type must be lesser than 4", 'danger');
		}
		else if(!name){
			this.myAlert("Field 'name' can't be null", 'danger');
		}
		else if(!date){
			this.myAlert("Field 'date' can't be null", 'danger');
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
					link: string | undefined, 
					image_uri: string | undefined, 
					image_alt: string | undefined
				} = {
					link,
					image_uri,
					image_alt
				};
				const truthyItemData = Object.fromEntries(
					Object.entries(itemData).filter(([key, value]) => Boolean(value))
				);
				this.aboutService.createItem(cookieValue, type, name, date, description, truthyItemData)
				.subscribe(
					(response: HttpResponse<TableAboutItemRes>): void  => {
						this.router.navigate(['home']);
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
		const itemId: number = Number(inputId) || 0;
		if(itemId === 0){
			this.myAlert("Invalid item id", 'danger');
		}
		else if(itemId < 1){
			this.myAlert("The item id must be greater than 0", 'danger');
		}
		else if(itemId > 65535){
			this.myAlert("The item id must be lesser than 65536", 'danger');
		}
		else {
			this.aboutService.getItem(itemId)
			.subscribe(
				(response: HttpResponse<TableAboutItemRes>): void  => {
					if(response.body !== null){
						this.found_item_id = true;
						this.item_to_edit = {
							id: response.body.id,
							item_type: response.body.item_type,
							name: response.body.name,
							date: response.body.date,
							description: response.body.description,
						}
						if(response.body.link) this.item_to_edit.link = response.body.link;
						if(response.body.image_uri) this.item_to_edit.image_uri = response.body.image_uri;
						if(response.body.image_alt) this.item_to_edit.image_alt = response.body.image_alt;
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
		description: string,
		link?: string,
		image_uri?: string,
		image_alt?: string
	): void {
		if(!name){
			this.myAlert("Field 'name' can't be null", 'danger');
		}
		else if(!date){
			this.myAlert("Field 'date' can't be null", 'danger');
		}
		else if(!description){
			this.myAlert("Field 'description' can't be null", 'danger');
		}
		else {
			if(this.item_to_edit.name){
				let something_changed: boolean = false;
				if(name !== this.item_to_edit.name){
					something_changed = true;
				}
				if(date !== this.item_to_edit.date){
					something_changed = true;
				}
				if(description !== this.item_to_edit.description){
					something_changed = true;
				}
				if(link !== this.item_to_edit.link){
					something_changed = true;
				}
				if(image_uri !== this.item_to_edit.image_uri){
					something_changed = true;
				}
				if(image_alt !== this.item_to_edit.image_alt){
					something_changed = true;
				}

				if(something_changed){
					if(!this.cookieService.get('JWT')){
						this.router.navigate(['error403']);
					}
					else{
						const cookieValue: string = this.cookieService.get('JWT');
						const itemData: {
							link: string | undefined, 
							image_uri: string | undefined, 
							image_alt: string | undefined
						} = {
							link,
							image_uri,
							image_alt
						};
						const truthyItemData = Object.fromEntries(
							Object.entries(itemData).filter(([key, value]) => Boolean(value))
						);
						this.aboutService.updateItem(cookieValue, this.item_to_edit.id, this.item_to_edit.item_type, name, date, description, truthyItemData)
						.subscribe(
							(response: HttpResponse<TableAboutItemRes>): void  => {
								this.router.navigate(['home']);
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
					this.myAlert("Item not edited", 'danger');
				}
			}
			else {
				this.myAlert("Item to update not found", 'danger');
				this.found_item_id = false;
			}
		}
	}

	delete_item(inputId: string): void {
		const itemId: number = Number(inputId) || 0;
		if(itemId === 0){
			this.myAlert("Invalid item id", 'danger');
		}
		else if(itemId < 1){
			this.myAlert("The item id must be greater than 0", 'danger');
		}
		else if(itemId > 65535){
			this.myAlert("The item id must be lesser than 65536", 'danger');
		}
		else {
			if(!this.cookieService.get('JWT')){
				this.router.navigate(['error403']);
			}
			else{
				const cookieValue: string = this.cookieService.get('JWT');
				this.aboutService.deleteItem(cookieValue, itemId)
				.subscribe(
					(response: HttpResponse<{}>): void  => {
						this.router.navigate(['home']);
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

	ngOnInit(): void {
		this.informationService.getInformationTable()
		.subscribe(
			(response: HttpResponse<TableInfoRes[]>): void  => {
				if(response.body !== null){
					for(let i: number = 0; i < response.body.length; i++){
						if(response.body[i].name === "journey" && response.body[i].information){
							this.journey_info = response.body[i].information;
							this.journey_info_id = i + 1;
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

	ngAfterViewInit(): void {
		const date_input: HTMLInputElement = document.getElementById("add_date") as HTMLInputElement;
		if(date_input !== null){
			date_input.max = new Date().toLocaleDateString('fr-ca');
			date_input.value = new Date().toLocaleDateString('fr-ca');
		}
	}

}