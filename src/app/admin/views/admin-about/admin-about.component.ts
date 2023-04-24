import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router'
import { CookieService } from 'ngx-cookie-service';
import { AboutService } from '../../../services/about.service';
import { InformationService } from '../../../services/information.service';
import { ErrorObject } from '../../../interceptors/errorObject.interface'
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

	error_message_add:      string | undefined = undefined;
	error_message_edit:     string | undefined = undefined;
	error_message_delete:   string | undefined = undefined;
	error_message_journey:  string | undefined = undefined;
	journey_info:           string | undefined = undefined;
	current_value:          string = "add";
	found_item_id:          boolean = false;
	journey_info_id:        number = 0;
	item_to_edit:           TableAboutItemRes = {} as TableAboutItemRes;

	reset_default_values(): void {
		this.error_message_add    = undefined;
		this.error_message_edit   = undefined;
		this.error_message_delete = undefined;
		this.current_value        = "add";
		this.found_item_id        = false;
	}

	edit_journey(text: string): void {
		if(!text){
			this.error_message_journey = "Field <journey> can't be null";
		}
		else {
			if(text !== this.journey_info){
				if(!this.cookieService.get('JWT')){
					this.router.navigate(['error401']);
				}
				else{
					const cookieValue: string = this.cookieService.get('JWT');
					this.informationService.editInformationTable(cookieValue, this.journey_info_id, "journey", text)
					.subscribe(
						(response: HttpResponse<TableInfoRes>): void  => {
							this.error_message_journey = undefined;
							this.router.navigate(['home']);
						},
						(error: any): void => {
							console.log(error.body.error);
							// redirect to error pages
						}
					);
				}
			}
			else{
				this.error_message_journey = "Information not edited";
			}
		}
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
			else if(value === "journey"){
				this.reset_default_values();
				this.current_value = "journey";
			}
		}
	}

	create_item(
		input_type: string,
		name: string,
		date: string,
		description: string,
		link: string,
		image_uri: string,
		image_alt: string
	): void {
		const type: number = Number(input_type) || 0;
		if(type === 0){
			this.error_message_add = "Invalid item type";
		}
		else if(type < 1){
			this.error_message_add = "Item type must be greater than 0";
		}
		else if(type > 3){
			this.error_message_add = "Item type must be lesser than 4";
		}
		else if(!name){
			this.error_message_add = "Field <name> can't be null";
		}
		else if(!date){
			this.error_message_add = "Field <date> can't be null";
		}
		else if(!description){
			this.error_message_add = "Field <description> can't be null";
		}

		else {
			if(!this.cookieService.get('JWT')){
				this.router.navigate(['error401']);
			}
			else{
				const cookieValue: string = this.cookieService.get('JWT');
				this.aboutService.createItem(cookieValue, type, name, date, description, link, image_uri, image_alt)
				.subscribe(
					(response: HttpResponse<TableAboutItemRes>): void  => {
						this.error_message_add = undefined;
						this.router.navigate(['home']);
					},
					(error: any): void => {
						console.log(error.body.error);
						// redirect to error pages
					}
				);
			}
		}
	}

	search_edit_item(inputId: string): void {
		const itemId: number = Number(inputId) || 0;
		if(itemId === 0){
			this.error_message_edit = "Invalid item id";
		}
		else if(itemId < 1){
			this.error_message_edit = "The item id must be greater than 0";
		}
		else if(itemId > 65535){
			this.error_message_edit = "The item id must be lesser than 65536";
		}
		else {
			this.aboutService.getItem(itemId)
			.subscribe(
				(response: HttpResponse<TableAboutItemRes>): void  => {
					if(response.body !== null){
						this.error_message_edit = undefined;
						this.found_item_id = true;
						this.item_to_edit = {
							id: response.body.id,
							item_type: response.body.item_type,
							name: response.body.name,
							date: response.body.date,
							description: response.body.description,
							link: response.body.link,
							image_uri: response.body.image_uri,
							image_alt: response.body.image_alt
						}
					}
				},
				(error: any): void => {
					console.log(error.body.error);
					// redirect to error pages
				}
			);
		}
	}

	edit_item(
		name: string,
		date: string,
		description: string,
		link: string,
		image_uri: string,
		image_alt: string
	): void {
		if(!name){
			this.error_message_edit = "Field <name> can't be null";
		}
		else if(!date){
			this.error_message_edit = "Field <date> can't be null";
		}
		else if(!description){
			this.error_message_edit = "Field <description> can't be null";
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
						this.router.navigate(['error401']);
					}
					else{
						const cookieValue: string = this.cookieService.get('JWT');
						this.aboutService.updateItem(cookieValue, this.item_to_edit.id, this.item_to_edit.item_type, name, date, description, link, image_uri, image_alt)
						.subscribe(
							(response: HttpResponse<TableAboutItemRes>): void  => {
								this.router.navigate(['home']);
								this.error_message_edit = undefined;
							},
							(error: any): void => {
								console.log(error.body.error);
								// redirect to error pages
							}
						);
					}
				}
				else {
					this.error_message_edit = "Item not edited";
				}
			}
			else {
				this.error_message_edit = "Item to update not found";
				this.found_item_id = false;
			}
		}
	}

	delete_item(inputId: string): void {
		const itemId: number = Number(inputId) || 0;
		if(itemId === 0){
			this.error_message_delete = "Invalid item id";
		}
		else if(itemId < 1){
			this.error_message_delete = "The item id must be greater than 0";
		}
		else if(itemId > 65535){
			this.error_message_delete = "The item id must be lesser than 65536";
		}
		else {
			if(!this.cookieService.get('JWT')){
				this.router.navigate(['error401']);
			}
			else{
				const cookieValue: string = this.cookieService.get('JWT');
				this.aboutService.deleteItem(cookieValue, itemId)
				.subscribe(
					(response: HttpResponse<{}>): void  => {
						this.router.navigate(['home']);
						this.error_message_delete = undefined;
					},
					(error: any): void => {
						console.log(error.body.error);
						// redirect to error pages
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
			(error: any): void => {
				console.log(error.body.error);
				// redirect to error pages
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