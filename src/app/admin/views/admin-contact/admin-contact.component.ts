import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { CookieService } from 'ngx-cookie-service';
import { ContactService } from '../../../services/contact.service';
import { TableContactItemRes, TableContactMessageRes } from '../../../interfaces/tableContactRes.interface';
import { HttpClientModule, HttpClient, HttpResponse } from '@angular/common/http'

@Component({
	selector: 'app-admin-contact',
	templateUrl: './admin-contact.component.html',
	styleUrls: ['./admin-contact.component.scss']
})
export class AdminContactComponent implements OnInit{

	constructor(private router: Router, private cookieService: CookieService, private contactService: ContactService) { }

	error_message_add: 		string | undefined = undefined;
	error_message_edit: 	string | undefined = undefined;
	error_message_delete: 	string | undefined = undefined;
	current_value: 			string = "add";
	found_item_id: 			boolean = false;
	item_to_edit: 			TableContactItemRes = {} as TableContactItemRes;
	all_messages: 			TableContactMessageRes[] = [];
	current_message: 		TableContactMessageRes = {} as TableContactMessageRes;
	one_message: 			boolean = false;
	messages_empty: 		boolean = true;


	reset_default_item_values(): void {
		this.error_message_add		= undefined;
		this.error_message_edit		= undefined;
		this.error_message_delete 	= undefined;
		this.current_value			= "add";
		this.found_item_id			= false;
	}

	method_change(event: Event): void {
		const value: string = (event.target as HTMLFormElement)['value'];
		if(value !== this.current_value){
			this.reset_default_item_values();
			this.current_value = value;
		}
	}


	create_item(
		name: string,
		account: string,
		link: string,
		image_uri: string,
		image_alt: string
	): void {
		if(!name){
			this.error_message_add = "Field <name> can't be null";
		}
		else if(!account){
			this.error_message_add = "Field <account> can't be null";
		}
		else {
			if(!this.cookieService.get('JWT')){
				this.router.navigate(['error401']);
			}
			else{
				const cookieValue: string = this.cookieService.get('JWT');
				this.contactService.createItem(cookieValue, name, account, link, image_uri, image_alt)
				.subscribe(
					(response: HttpResponse<TableContactItemRes>): void  => {
						this.router.navigate(['home']);
						this.error_message_add = undefined;
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
			this.contactService.getItem(itemId)
			.subscribe(
				(response: HttpResponse<TableContactItemRes>): void  => {
					if(response.body !== null){
						this.error_message_edit = undefined;
						this.found_item_id = true;
						this.item_to_edit = {
							id: response.body.id,
							name: response.body.name,
							account: response.body.account,
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
		account: string,
		link: string,
		image_uri: string,
		image_alt: string
	): void {
		if(!name){
			this.error_message_edit = "Field <name> can't be null";
		}
		else if(!account){
			this.error_message_edit = "Field <account> can't be null";
		}
		else {
			if(this.item_to_edit.name){
				let something_changed: boolean = false;
				if(name !== this.item_to_edit.name){
					something_changed = true;
				}
				if(account !== this.item_to_edit.account){
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
						this.router.navigate(['login']);
					}
					else{
						const cookieValue: string = this.cookieService.get('JWT');
						this.contactService.updateItem(cookieValue, this.item_to_edit.id, name, account, link, image_uri, image_alt)
						.subscribe(
							(response: HttpResponse<TableContactItemRes>): void  => {
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
				this.router.navigate(['login']);
			}
			else{
				const cookieValue: string = this.cookieService.get('JWT');
				this.contactService.deleteItem(cookieValue, itemId)
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

	show_message(id: number): void {
		if(!this.cookieService.get('JWT')){
			this.router.navigate(['login']);
		}
		else{
			const cookieValue: string = this.cookieService.get('JWT');
			this.contactService.getMessage(cookieValue, id)
			.subscribe(
				(response: HttpResponse<TableContactMessageRes>): void  => {
					if(response.body !== null){
						this.current_message = {
							id: response.body.id,
							subject: response.body.subject,
							message: response.body.message,
							reply: response.body.reply,
							date: response.body.date,
							read: response.body.read
						}
						this.one_message = true;
						if(!response.body.read){
							this.contactService.changeMessageRead(cookieValue, this.current_message)
							.subscribe(
								(response: any): void  => {
									for(let i: number = 0; i < this.all_messages.length; i++){
										if(this.all_messages[i].id === this.current_message.id){
											this.all_messages[i].read = true;
											break;
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
				},
				(error: any): void => {
					console.log(error.body.error);
					// redirect to error pages
				}
			);
		}
	}

	ngOnInit(): void {
		if(!this.cookieService.get('JWT')){
			this.router.navigate(['login']);
		}
		else{
			const cookieValue: string = this.cookieService.get('JWT');
			this.contactService.getMessages(cookieValue)
			.subscribe(
				(response: HttpResponse<TableContactMessageRes[]>): void  => {
					if(response.body !== null){
						for(let i: number = 0; i < response.body.length; i++){
							this.all_messages.push({
								id: response.body[i].id,
								subject: response.body[i].subject,
								message: response.body[i].message,
								reply: response.body[i].reply,
								date: response.body[i].date,
								read: response.body[i].read
							});
						}
					}
					if(this.all_messages.length){
						this.messages_empty = false;
						this.all_messages.sort(function (a: any, b: any){
							return +new Date(b.date) - +new Date(a.date);
						});
					}
				},
				(error: any): void => {
					console.log(error.body.error);
					// redirect to error pages
				}
			);
		}
	}
}
