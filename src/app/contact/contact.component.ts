import { Component } from '@angular/core';
import { ContactService } from '../services/contact.service';
import { TableContactItemRes, TableContactMessageRes } from '../interfaces/tableContactRes.interface';
import { HttpClientModule, HttpClient, HttpResponse } from '@angular/common/http'


@Component({
	selector: 'app-contact',
	templateUrl: './contact.component.html',
	styleUrls: ['./contact.component.scss']
})
export class ContactComponent {

	constructor(private contactService: ContactService) { }

	social_items: {
		id: number,
		name: string,
		link?: string,
		account: string,
		image_uri?: string,
		image_alt?: string
	}[] = []

	error_message: string | undefined = undefined;
	success: boolean = false;

	response_message(type: number, message?: string): void {
		if(type === 0){ // no error, no success
			this.error_message = undefined;
			this.success = false;
		}
		else if(type === 1 && message){ // error
			this.error_message = message;
			this.success = false;
		}
		else if(type === 2){ // success
			this.error_message = undefined;
			this.success = true;
		}
	}

	create_message(subject: string, message: string, replyto: string): void {
		if(!subject){
			this.response_message(1, "Field <subject> can't be null");
		}
		else if(subject.length < 3){
			this.response_message(1, "Field <subject> must have a minimum of 3 characters");
		}
		else if(subject.length > 128){
			this.response_message(1, "Field <subject> must have a maximum of 128 characters");
		}
		else if(!message){
			this.response_message(1, "Field <message> can't be null");
		}
		else if(message.length < 3){
			this.response_message(1, "Field <message> must have a minimum of 3 characters");
		}
		else if(message.length > 512){
			this.response_message(1, "Field <message> must have a maximum of 512 characters");
		}
		else if(!replyto){
			this.response_message(1, "Field <replyto> can't be null");
		}
		else if(replyto.length < 3){
			this.response_message(1, "Field <replyto> must have a minimum of 3 characters");
		}
		else if(replyto.length > 512){
			this.response_message(1, "Field <replyto> must have a maximum of 128 characters");
		}

		else {
			const date: string = new Date().toLocaleDateString('fr-ca');
			this.contactService.createMessage(subject, message, replyto, date)
			.subscribe(
				(response: HttpResponse<TableContactMessageRes>): void  => {
					this.response_message(2);
					const form: HTMLFormElement = <HTMLFormElement>document.getElementById("contact_form");
					if(form !== null){
						form.reset();
					}
				},
				(error: any): void => {
					this.response_message(1, "Error while creating the message");
					console.log(error.body.error);
					// redirect to error pages
				}
			);
		}
	}

	ngOnInit(): void {
		this.contactService.getItems()
		.subscribe(
			(response: HttpResponse<TableContactItemRes[]>): void  => {
				if(response.body !== null){
					for(let i: number = 0; i < response.body.length; i++){
						if(response.body[i]){
							this.social_items.push(response.body[i]);
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
}