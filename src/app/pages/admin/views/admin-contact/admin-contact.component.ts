import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
	HttpClientModule,
	HttpClient,
	HttpResponse
} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { ContactService } from '@@shared/services/contact.service';
import { AlertService } from '@@shared/services/alert.service';
import { ErrorObject } from '@@shared/interfaces/errorObject.interface';
import {
	TableContactItemRes,
	TableContactMessageRes
} from '@@shared/interfaces/tableContactRes.interface';

@Component({
	selector: 'app-admin-contact',
	templateUrl: './admin-contact.component.html',
	styleUrls: ['./admin-contact.component.scss']
})
export class AdminContactComponent implements OnInit {

	constructor(
		private alertService: AlertService, 
		private router: Router, 
		private cookieService: CookieService, 
		private contactService: ContactService
	) { }

	current_value: 		string = "add";
	found_item_id: 		boolean = false;
	item_to_edit: 		TableContactItemRes = { } as TableContactItemRes;
	all_messages: 		TableContactMessageRes[] = [];
	current_message: 	TableContactMessageRes = { } as TableContactMessageRes;
	one_message: 		boolean = false;
	messages_empty: 	boolean = true;
	cookieValue: 		string = this.cookieService.get('JWT');

	method_change(value: string): void {
		if (value !== this.current_value) {
			this.found_item_id = false;
			this.current_value = value;
		}
	}

	create_item(
		name: string,
		account: string,
		link?: string,
		image_uri?: string,
		image_alt?: string
	): void {
		if (!name) this.alertService.myAlert("Field 'name' can't be null", 'danger');
		else if (!account) this.alertService.myAlert("Field 'account' can't be null", 'danger');
		
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

				this.contactService.createItem(
					this.cookieValue,
					name,
					account,
					truthyItemData
				).subscribe(
					(response: HttpResponse<TableContactItemRes>): void  => {
						this.alertService.myAlert("Item created successfully", 'success');
						(document.getElementById("create_item_form") as HTMLFormElement).reset;
					},
					(error: HttpResponse<ErrorObject>): void => {
						this.alertService.myAlert(error.body?.error.message ?? 'Unknown error while creating item', 'danger');
						console.error(error.body?.error);
					}
				);
			}
		}
	}

	search_edit_item(inputId: string): void {
		const itemId: number = Number(inputId) || 0;
		if (itemId === 0) this.alertService.myAlert("Invalid item id", 'danger');
		else if (itemId < 1) this.alertService.myAlert("The item id must be greater than 0", 'danger');
		else if (itemId > 65535) this.alertService.myAlert("The item id must be lesser than 65536", 'danger');
		
		else {
			this.contactService.getItem(itemId)
			.subscribe(
				(response: HttpResponse<TableContactItemRes>): void  => {
					if (response.body !== null) {
						this.found_item_id = true;
						this.item_to_edit = {
							id: response.body.id,
							name: response.body.name,
							account: response.body.account
						};
						if (response.body.link) this.item_to_edit.link = response.body.link;
						if (response.body.image_uri) this.item_to_edit.image_uri = response.body.image_uri;
						if (response.body.image_alt) this.item_to_edit.image_alt = response.body.image_alt;
					}
				},
				(error: HttpResponse<ErrorObject>): void => {
					this.alertService.myAlert(error.body?.error.message ?? 'Unknown error while retrieving item', 'danger');
					console.error(error.body?.error);
				}
			);
		}
	}

	edit_item(
		name: string,
		account: string,
		link?: string,
		image_uri?: string,
		image_alt?: string
	): void {
		if (!name) this.alertService.myAlert("Field 'name' can't be null", 'danger');
		else if (!account) this.alertService.myAlert("Field 'account' can't be null", 'danger');
		
		else {
			if (this.item_to_edit.name) {
				let something_changed: boolean = false;
				if (name !== this.item_to_edit.name ||
					account !== this.item_to_edit.account ||
					link !== this.item_to_edit.link ||
					image_uri !== this.item_to_edit.image_uri ||
					image_alt !== this.item_to_edit.image_alt
				) something_changed = true;
				
				if (something_changed) {
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
						
						this.contactService.updateItem(
							this.cookieValue,
							this.item_to_edit.id,
							name,
							account,
							truthyItemData
						).subscribe(
							(response: HttpResponse<TableContactItemRes>): void  => {
								this.alertService.myAlert("Item updated successfully", 'success');
								this.item_to_edit.name = name;
								this.item_to_edit.account = account;
								this.item_to_edit.link = link;
								this.item_to_edit.image_uri = image_uri;
								this.item_to_edit.image_alt = image_alt;
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
				this.found_item_id = false;
				this.alertService.myAlert("Item to update not found", 'danger');
			}
		}
	}

	delete_item(inputId: string): void {
		const itemId: number = Number(inputId) || 0;
		if (itemId === 0) this.alertService.myAlert("Invalid item id", 'danger');
		else if (itemId < 1) this.alertService.myAlert("The item id must be greater than 0", 'danger');
		else if (itemId > 65535) this.alertService.myAlert("The item id must be lesser than 65536", 'danger');
		
		else {
			if (!this.cookieValue) this.router.navigate(['error403']);
			else {
				this.contactService.deleteItem(
					this.cookieValue,
					itemId
				).subscribe(
					(response: HttpResponse<{ }>): void  => {
						this.alertService.myAlert("Item deleted successfully", 'success');
						(document.getElementById("delete_item_form") as HTMLFormElement).reset;
					},
					(error: HttpResponse<ErrorObject>): void => {
						this.alertService.myAlert(error.body?.error.message ?? 'Unknown error while deleting item', 'danger');
						console.error(error.body?.error);
					}
				);
			}
		}
	}

	show_message(id: number): void {
		if (this.current_message.id !== id) {
			if (!this.cookieValue) this.router.navigate(['error403']);
			else {
				this.contactService.getMessage(
					this.cookieValue,
					id
				).subscribe(
					(response: HttpResponse<TableContactMessageRes>): void  => {
						if (response.body !== null) {
							this.current_message = {
								id: response.body.id,
								subject: response.body.subject,
								message: response.body.message,
								reply: response.body.reply,
								date: response.body.date,
								readed: response.body.readed
							};
							this.one_message = true;
							if (!response.body.readed) {
								this.contactService.changeMessageRead(
									this.cookieValue,
									this.current_message
								).subscribe(
									(response: HttpResponse<TableContactMessageRes>): void  => {
										for (let specificMessage of this.all_messages) {
											if (specificMessage.id === this.current_message.id) {
												specificMessage.readed = true;
												break;
											}
										}
									},
									(error: HttpResponse<ErrorObject>): void => {
										this.alertService.myAlert(error.body?.error.message ?? 'Unknown error while updating message read status', 'danger');
										console.error(error.body?.error);
									}
								);
							}
						}
					},
					(error: HttpResponse<ErrorObject>): void => {
						this.alertService.myAlert(error.body?.error.message ?? 'Unknown error while retrieving message', 'danger');
						console.error(error.body?.error);
					}
				);
			}
		}
		else {
			this.one_message = true;
		}
	}

	delete_message(inputId: number): void {
		if (inputId === 0) this.alertService.myAlert("Invalid message id", 'danger');
		else if (inputId < 1) this.alertService.myAlert("The message id must be greater than 0", 'danger');
		else if (inputId > 65535) this.alertService.myAlert("The message id must be lesser than 65536", 'danger');
		
		else {
			if (!this.cookieValue) this.router.navigate(['error403']);
			else{
				this.contactService.deleteMessage(
					this.cookieValue,
					inputId
				).subscribe(
					(response: HttpResponse<{ }>): void  => {
						for (let i = 0; i < this.all_messages.length; i++) {
							if (this.all_messages[i].id === inputId) {
								this.all_messages.splice(i, 1);
								break;
							}
						}
						this.alertService.myAlert("Message deleted successfully", 'success');
						this.one_message = false;
					},
					(error: HttpResponse<ErrorObject>): void => {
						this.alertService.myAlert(error.body?.error.message ?? 'Unknown error while deleting message', 'danger');
						console.error(error.body?.error);
					}
				);
			}
		}
	}

	ngOnInit(): void {
		if (!this.cookieValue) this.router.navigate(['login']);
		else {
			this.contactService.getMessages(this.cookieValue)
			.subscribe(
				(response: HttpResponse<TableContactMessageRes[]>): void  => {
					if (response.body !== null) {
						for (let messageMessage of response.body) {
							this.all_messages.push({
								id: messageMessage.id,
								subject: messageMessage.subject,
								message: messageMessage.message,
								reply: messageMessage.reply,
								date: messageMessage.date,
								readed: messageMessage.readed
							});
						}
					}
					if (this.all_messages.length) {
						this.messages_empty = false;
						this.all_messages.sort((a: any, b: any) => +new Date(b.date) - +new Date(a.date));
					}
				},
				(error: HttpResponse<ErrorObject>): void => {
					this.alertService.myAlert(error.body?.error.message ?? 'Unknown error while retrieving messages', 'danger');
					console.error(error.body?.error);
				}
			);
		}
	}
}
