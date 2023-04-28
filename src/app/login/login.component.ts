import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router'
import { LoginService } from '../services/login.service';
import { HttpClientModule, HttpClient, HttpResponse } from '@angular/common/http';
import { ErrorObject } from '../interfaces/errorObject.interface'

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	providers: [CookieService]
})

export class LoginComponent {

	constructor(private loginService: LoginService, private cookieService: CookieService, private router: Router) {}


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

	Login(email: string, password: string): void {
		let error: boolean = false;

		if(!email || !password){
			this.myAlert('Invalid username or password', 'danger');
			error = true;
		}
		// https://stackoverflow.com/a/46181/18895342
		else if(!email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
			this.myAlert('Invalid username', 'danger');
			error = true;
		}

		if(!error){
			this.loginService.login(email, password)
			.subscribe(
				(response: HttpResponse<string>): void  => {
					if(response.body !== null){
						this.cookieService.set('JWT', response.body, 1);
						this.router.navigate(['admin']);
					}
				},
				(error: HttpResponse<ErrorObject>): void => {
					if(error.body !== null){
						this.myAlert(error.body.error.message ?? 'Unknown error while retrieving the login information', 'danger');
						console.error(error.body.error);
					}
				}
			);
		}
	}
}
