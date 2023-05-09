import { Component, ChangeDetectionStrategy } from '@angular/core';
import {
	HttpClientModule,
	HttpClient,
	HttpResponse
} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { ContactService } from '@@shared/services/contact.service';
import { AlertService } from '@@shared/services/alert.service';
import { ErrorObject } from '@@shared/interfaces/errorObject.interface'
import {
	TableContactItemRes,
	TableContactMessageRes
} from '@@shared/interfaces/tableContactRes.interface';

@Component({
	selector: 'app-contact',
	templateUrl: './contact.component.html',
	styleUrls: ['./contact.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent {

	constructor(
		private cookieService: CookieService, 
		private alertService: AlertService, 
		private contactService: ContactService
	){}

	social_items: {
		id: number,
		name: string,
		account: string,
		link?: string,
		image_uri?: string,
		image_alt?: string
	}[] = [];


	isLogged(): boolean {
		if(!this.cookieService.get('JWT')){
			return false;
		}
		return true;
	}
	
	create_message(subject: string, message: string, replyto: string): void {
		if(!subject){
			this.alertService.myAlert("Field 'subject' can't be null", 'danger');
		}
		else if(subject.length < 3){
			this.alertService.myAlert("Field 'subject' must have a minimum of 3 characters", 'danger');
		}
		else if(subject.length > 255){
			this.alertService.myAlert("Field 'subject' must have a maximum of 255 characters", 'danger');
		}
		else if(!message){
			this.alertService.myAlert("Field 'message' can't be null", 'danger');
		}
		else if(message.length < 3){
			this.alertService.myAlert("Field 'message' must have a minimum of 3 characters", 'danger');
		}
		else if(message.length > 3000){
			this.alertService.myAlert("Field 'message' must have a maximum of 3000 characters", 'danger');
		}
		else if(!replyto){
			this.alertService.myAlert("Field 'replyto' can't be null", 'danger');
		}
		else if(replyto.length < 3){
			this.alertService.myAlert("Field 'replyto' must have a minimum of 3 characters", 'danger');
		}
		else if(replyto.length > 255){
			this.alertService.myAlert("Field 'replyto' must have a maximum of 255 characters", 'danger');
		}

		else {
			const date: string = new Date().toLocaleDateString('fr-ca');
			this.contactService.createMessage(subject, message, replyto, date)
			.subscribe(
				(response: HttpResponse<TableContactMessageRes>): void  => {
					this.alertService.myAlert("Message sent successfully", 'success');
					const form: HTMLFormElement = <HTMLFormElement>document.getElementById("contact_form");
					if(form !== null){
						form.reset();
					}
				},
				(error: HttpResponse<ErrorObject>): void => {
					if(error.body !== null){
						this.alertService.myAlert(error.body.error.message ?? 'Unknown error while creating the message', 'danger');
						console.error(error.body.error);
					}
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
			(error: HttpResponse<ErrorObject>): void => {
				if(error.body !== null){
					this.alertService.myAlert(error.body.error.message ?? 'Unknown error while retrieving items', 'danger');
					console.error(error.body.error);
				}
			}
		);
	}
}