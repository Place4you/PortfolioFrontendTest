import { Component, ChangeDetectionStrategy } from '@angular/core';
import {
	HttpClientModule,
	HttpClient,
	HttpResponse
} from '@angular/common/http';
import { ContactService } from '@@shared/services/contact.service';
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

	constructor(private contactService: ContactService) { }

	social_items: {
		id: number,
		name: string,
		account: string,
		link?: string,
		image_uri?: string,
		image_alt?: string
	}[] = [];


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

	create_message(subject: string, message: string, replyto: string): void {
		if(!subject){
			this.myAlert("Field 'subject' can't be null", 'danger');
		}
		else if(subject.length < 3){
			this.myAlert("Field 'subject' must have a minimum of 3 characters", 'danger');
		}
		else if(subject.length > 255){
			this.myAlert("Field 'subject' must have a maximum of 255 characters", 'danger');
		}
		else if(!message){
			this.myAlert("Field 'message' can't be null", 'danger');
		}
		else if(message.length < 3){
			this.myAlert("Field 'message' must have a minimum of 3 characters", 'danger');
		}
		else if(message.length > 3000){
			this.myAlert("Field 'message' must have a maximum of 3000 characters", 'danger');
		}
		else if(!replyto){
			this.myAlert("Field 'replyto' can't be null", 'danger');
		}
		else if(replyto.length < 3){
			this.myAlert("Field 'replyto' must have a minimum of 3 characters", 'danger');
		}
		else if(replyto.length > 255){
			this.myAlert("Field 'replyto' must have a maximum of 255 characters", 'danger');
		}

		else {
			const date: string = new Date().toLocaleDateString('fr-ca');
			this.contactService.createMessage(subject, message, replyto, date)
			.subscribe(
				(response: HttpResponse<TableContactMessageRes>): void  => {
					this.myAlert("Message sent successfully", 'success');
					const form: HTMLFormElement = <HTMLFormElement>document.getElementById("contact_form");
					if(form !== null){
						form.reset();
					}
				},
				(error: HttpResponse<ErrorObject>): void => {
					if(error.body !== null){
						this.myAlert(error.body.error.message ?? 'Unknown error while creating the message', 'danger');
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
					this.myAlert(error.body.error.message ?? 'Unknown error while retrieving items', 'danger');
					console.error(error.body.error);
				}
			}
		);
	}
}