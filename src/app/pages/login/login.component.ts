import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import {
	HttpClientModule,
	HttpClient,
	HttpResponse
} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from '@@shared/services/login.service';
import { AlertService } from '@@shared/services/alert.service';
import { ErrorObject } from '@@shared/interfaces/errorObject.interface'

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	providers: [CookieService],
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class LoginComponent {

	constructor(
		private alertService: AlertService, 
		private loginService: LoginService, 
		private cookieService: CookieService, 
		private router: Router
	){}

	Login(email: string, password: string): void {
		let error: boolean = false;

		if(!email || !password){
			this.alertService.myAlert('Invalid username or password', 'danger');
			error = true;
		}
		// https://stackoverflow.com/a/46181/18895342
		else if(!email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
			this.alertService.myAlert('Invalid username', 'danger');
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
						if(error.body.error.code === 401){
							this.alertService.myAlert('Invalid username or password', 'danger');
						}
						else {
							this.alertService.myAlert('Unknown error while retrieving the login information', 'danger');
						}
						console.error(error.body.error);
					}
				}
			);
		}
	}
}
