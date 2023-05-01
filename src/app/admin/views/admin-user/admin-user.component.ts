import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { CookieService } from 'ngx-cookie-service';
import { UserService } from '../../../services/user.service';
import { ErrorObject } from '../../../interfaces/errorObject.interface'
import { HttpClientModule, HttpClient, HttpResponse } from '@angular/common/http'
import { TableUserRes } from '../../../interfaces/tableUserRes.interface';

@Component({
	selector: 'app-admin-user',
	templateUrl: './admin-user.component.html',
	styleUrls: ['./admin-user.component.scss']
})
export class AdminUserComponent implements OnInit {

	constructor(private router: Router, private cookieService: CookieService, private userService: UserService) { }

	current_value:	string = "all";
	found_user_id:	boolean = false;
	user_to_edit:	TableUserRes = {} as TableUserRes;
	all_users: 		any[] = [];
	all_empty: 		boolean = true;

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
	
	method_change(event: Event): void {
		const value: string = (event.target as HTMLFormElement)['value'];
		this.show_other(value);
	}

	show_other(value: string): void {
		if(value !== this.current_value){
			this.found_user_id = false;
			this.current_value = value;
		}
	}

	create_user(
		name: string,
		email: string,
		password: string,
	): void {
		if(!name){
			this.myAlert("Field 'name' can't be null", 'danger');
		}
		else if(!email){
			this.myAlert("Field 'email' can't be null", 'danger');
		}
		else if(!password){
			this.myAlert("Field 'password' can't be null", 'danger');
		}

		else {
			if(!this.cookieService.get('JWT')){
				this.router.navigate(['error403']);
			}
			else{
				const cookieValue: string = this.cookieService.get('JWT');
				this.userService.createUser(cookieValue, name, email, password)
				.subscribe(
					(response: HttpResponse<TableUserRes>): void  => {
						this.router.navigate(['home']);
					},
					(error: HttpResponse<ErrorObject>): void => {
						if(error.body !== null){
							this.myAlert(error.body.error.message ?? 'Unknown error while creating user', 'danger');
							console.error(error.body.error);
						}
					}
				);
			}
		}
	}

	search_edit_user(inputId: string): void {
		const userId: number = Number(inputId) || 0;
		if(userId === 0){
			this.myAlert("Invalid user id", 'danger');
		}
		else if(userId < 1){
			this.myAlert("The user id must be greater than 0", 'danger');
		}
		else if(userId > 65535){
			this.myAlert("The user id must be lesser than 65536", 'danger');
		}
		else {
			if(!this.cookieService.get('JWT')){
				this.router.navigate(['error403']);
			}
			else{
				const cookieValue: string = this.cookieService.get('JWT');
				this.userService.getUser(cookieValue, userId)
				.subscribe(
					(response: HttpResponse<TableUserRes>): void  => {
						if(response.body !== null){
							this.found_user_id = true;
							this.user_to_edit = {
								id: response.body.id,
								name: response.body.name,
								email: response.body.email,
								password: response.body.password
							}
							this.show_other("edit");
						}
					},
					(error: HttpResponse<ErrorObject>): void => {
						if(error.body !== null){
							this.myAlert(error.body.error.message ?? 'Unknown error while retrieving user', 'danger');
							console.error(error.body.error);
						}
					}
				);
			}
		}
	}

	edit_user(
		name: string,
		email: string,
		password: string
	): void {
		if(!name){
			this.myAlert("Field 'name' can't be null", 'danger');
		}
		else if(!email){
			this.myAlert("Field 'email' can't be null", 'danger');
		}
		else if(!password){
			this.myAlert("Field 'password' can't be null", 'danger');
		}
		else {
			if(this.user_to_edit.name){
				let something_changed: boolean = false;
				if(name !== this.user_to_edit.name){
					something_changed = true;
				}
				if(email !== this.user_to_edit.email){
					something_changed = true;
				}
				if(password !== this.user_to_edit.password){
					something_changed = true;
				}

				if(something_changed){
					if(!this.cookieService.get('JWT')){
						this.router.navigate(['error403']);
					}
					else{
						const cookieValue: string = this.cookieService.get('JWT');
						this.userService.updateUser(cookieValue, this.user_to_edit.id, name, email, password)
						.subscribe(
							(response: HttpResponse<TableUserRes>): void  => {
								this.router.navigate(['home']);
							},
							(error: HttpResponse<ErrorObject>): void => {
								if(error.body !== null){
									this.myAlert(error.body.error.message ?? 'Unknown error while updating user', 'danger');
									console.error(error.body.error);
								}
							}
						);
					}
				}
				else {
					this.myAlert("User not edited", 'danger');
				}
			}
			else {
				this.myAlert("User to update not found", 'danger');
				this.found_user_id = false;
			}
		}
	}

	delete_user(inputId: string): void {
		const userId: number = Number(inputId) || 0;
		if(userId === 0){
			this.myAlert("Invalid user id", 'danger');
		}
		else if(userId < 1){
			this.myAlert("The user id must be greater than 0", 'danger');
		}
		else if(userId > 65535){
			this.myAlert("The user id must be lesser than 65536", 'danger');
		}
		else {
			if(!this.cookieService.get('JWT')){
				this.router.navigate(['error403']);
			}
			else{
				const cookieValue: string = this.cookieService.get('JWT');
				this.userService.deleteUser(cookieValue, userId)
				.subscribe(
					(response: HttpResponse<{}>): void  => {
						this.router.navigate(['home']);
					},
					(error: HttpResponse<ErrorObject>): void => {
						if(error.body !== null){
							this.myAlert(error.body.error.message ?? 'Unknown error while deleting user', 'danger');
							console.error(error.body.error);
						}
					}
				);
			}
		}
	}

	ngOnInit(): void {
		if(!this.cookieService.get('JWT')){
			this.router.navigate(['error403']);
		}
		else{
			const cookieValue: string = this.cookieService.get('JWT');
			this.userService.getUsers(cookieValue)
			.subscribe(
				(response: HttpResponse<TableUserRes[]>): void  => {
					if(response.body !== null){
						this.all_empty = false;
						for(let i: number = 0; i < response.body.length; i++){
							this.all_users.push(response.body[i]);
						}
					}
				},
				(error: HttpResponse<ErrorObject>): void => {
					if(error.body !== null){
						this.myAlert(error.body.error.message ?? 'Unknown error while retrieving users', 'danger');
						console.error(error.body.error);
					}
				}
			);
		}
	}

}