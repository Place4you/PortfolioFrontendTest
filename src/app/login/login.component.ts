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

	error_message: string | undefined = undefined;

	Login(email: string, password: string): void {
		let error: string | undefined = undefined;

		if(!email || !password){
			error = 'Invalid username or password';
		}
		// https://stackoverflow.com/a/46181/18895342
		else if(!email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
			error = 'Invalid username';
		}

		this.error_message = error;

		if(!error){
			this.error_message = undefined;
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
						console.log(error.body.error);
						// redirect to error pages
					}
				}
			);
		}
	}
}
