import {
	Component,
	OnInit,
	ViewChild,
	ElementRef
} from '@angular/core';
import { Router } from '@angular/router';
import {
	HttpClientModule,
	HttpClient,
	HttpResponse
} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from '@@shared/services/user.service';
import { AlertService } from '@@shared/services/alert.service';
import { ErrorObject } from '@@shared/interfaces/errorObject.interface';
import { TableUserRes } from '@@shared/interfaces/tableUserRes.interface';

@Component({
	selector: 'app-admin-user',
	templateUrl: './admin-user.component.html',
	styleUrls: ['./admin-user.component.scss']
})
export class AdminUserComponent implements OnInit {

	@ViewChild('createUserForm', { static: false })
	createUserFormRef!: ElementRef<HTMLFormElement>

	constructor(
		private alertService: AlertService, 
		private router: Router, 
		private cookieService: CookieService, 
		private userService: UserService
	) { }

	currentValue:	string = "all";
	userToEdit:	{ id: number, name: string, email: string } = { } as { id: number, name: string, email: string };
	allUsers:		TableUserRes[] = [];
	allEmpty:		boolean = true;
	cookieValue:	string = this.cookieService.get('JWT');

	methodChange(value: string): void {
		if (value !== this.currentValue) {
			this.currentValue = value;
		}
	}

	createUser(
		name: string,
		email: string,
		password: string
	): void {
		if (!name) this.alertService.myAlert("Field 'name' can't be null", 'danger');
		else if (!email) this.alertService.myAlert("Field 'email' can't be null", 'danger');
		else if (!password) this.alertService.myAlert("Field 'password' can't be null", 'danger');
		
		else {
			if (!this.cookieValue) this.router.navigate(['error403']);
			else {
				this.userService.createUser(
					this.cookieValue,
					name,
					email,
					password
				).subscribe(
					(response: HttpResponse<TableUserRes>): void  => {
						this.alertService.myAlert("User created successfully", 'success');
						this.createUserFormRef.nativeElement.reset();
						response.body && (this.allUsers.push(response.body));
					},
					(error: HttpResponse<ErrorObject>): void => {
						this.alertService.myAlert(error.body?.error.message ?? 'Unknown error while creating user', 'danger');
						console.error(error.body?.error);
					}
				);
			}
		}
	}

	searchEditUser(inputId: number): void {
		const userId: number = Number(inputId) || 0;
		if (userId === 0) this.alertService.myAlert("Invalid user id", 'danger');
		else if (userId < 1) this.alertService.myAlert("The user id must be greater than 0", 'danger');
		else if (userId > 65535) this.alertService.myAlert("The user id must be lesser than 65536", 'danger');
		
		else {
			if (!this.cookieValue) this.router.navigate(['error403']);
			else {
				this.userService.getUser(
					this.cookieValue,
					userId
				).subscribe(
					(response: HttpResponse<TableUserRes>): void  => {
						if (response.body !== null) {
							this.userToEdit = {
								id: response.body.id,
								name: response.body.name,
								email: response.body.email
							};
							this.methodChange("edit");
							this.allEmpty = false;
						}
					},
					(error: HttpResponse<ErrorObject>): void => {
						this.alertService.myAlert(error.body?.error.message ?? 'Unknown error while retrieving user', 'danger');
						console.error(error.body?.error);
					}
				);
			}
		}
	}

	editUser(
		name: string,
		email: string,
		password: string
	): void {
		if (!name) this.alertService.myAlert("Field 'name' can't be null", 'danger');
		else if (!email) this.alertService.myAlert("Field 'email' can't be null", 'danger');
		else if (!password) this.alertService.myAlert("Field 'password' can't be null", 'danger');
		
		else {
			if (this.userToEdit.name) {
				let somethingChanged: boolean = false;
				if (name !== this.userToEdit.name ||
					email !== this.userToEdit.email) somethingChanged = true;

				if (somethingChanged) {
					if (!this.cookieValue) this.router.navigate(['error403']);
					else {
						this.userService.updateUser(
							this.cookieValue,
							this.userToEdit.id,
							name,
							email,
							password
						).subscribe(
							(response: HttpResponse<TableUserRes>): void  => {
								this.alertService.myAlert("User updated successfully", 'success');
								this.userToEdit.name = name;
								this.userToEdit.email = email;
							},
							(error: HttpResponse<ErrorObject>): void => {
								this.alertService.myAlert(error.body?.error.message ?? 'Unknown error while updating user', 'danger');
								console.error(error.body?.error);
							}
						);
					}
				}
				else {
					this.alertService.myAlert("User not edited", 'danger');
				}
			}
			else {
				this.alertService.myAlert("User to update not found", 'danger');
			}
		}
	}

	deleteUser(inputId: number): void {
		const userId: number = Number(inputId) || 0;
		if (userId === 0) this.alertService.myAlert("Invalid user id", 'danger');
		else if (userId < 1) this.alertService.myAlert("The user id must be greater than 0", 'danger');
		else if (userId > 65535) this.alertService.myAlert("The user id must be lesser than 65536", 'danger');
		
		else {
			if (!this.cookieValue) this.router.navigate(['error403']);
			else {
				this.userService.deleteUser(
					this.cookieValue,
					userId
				).subscribe(
					(response: HttpResponse<{ }>): void  => {
						this.alertService.myAlert("User deleted successfully", 'success');
						for (let i = 0; i < this.allUsers.length; i++) {
							if (this.allUsers[i].id === inputId) {
								this.allUsers.splice(i, 1);
								break;
							}
						}
					},
					(error: HttpResponse<ErrorObject>): void => {
						this.alertService.myAlert(error.body?.error.message ?? 'Unknown error while deleting user', 'danger');
						console.error(error.body?.error);
					}
				);
			}
		}
	}

	ngOnInit(): void {
		if (!this.cookieValue) this.router.navigate(['error403']);
		else {
			this.userService.getUsers(this.cookieValue)
			.subscribe(
				(response: HttpResponse<TableUserRes[]>): void  => {
					if (response.body !== null) {
						this.allEmpty = false;
						for (let user of response.body) {
							this.allUsers.push(user);
						}
					}
				},
				(error: HttpResponse<ErrorObject>): void => {
					this.alertService.myAlert(error.body?.error.message ?? 'Unknown error while retrieving users', 'danger');
					console.error(error.body?.error);
				}
			);
		}
	}
}