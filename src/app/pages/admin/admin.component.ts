import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { 
	HttpClientModule,
	HttpClient,
	HttpResponse
} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from '@@shared/services/login.service';
import { AlertService } from '@@shared/services/alert.service';
import { ErrorObject } from '@@shared/interfaces/errorObject.interface';

@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.scss'],
	providers: [CookieService]
})
export class AdminComponent implements OnInit {

	constructor(
		private alertService: AlertService, 
		private loginService: LoginService, 
		private cookieService: CookieService, 
		private router: Router
	) { }
	
	view_click(view: string): void {
		const elemView: HTMLElement | null			= document.getElementById(`app_${view}`),
		elemViewP: HTMLElement | null				= elemView?.parentElement ?? null,
		elemViewPC: ChildNode | null				= elemViewP?.firstChild ?? null,
		elemViewPCC: ChildNode | null				= elemViewPC?.firstChild ?? null,
		arrow: NodeListOf<ChildNode> | undefined	= elemViewPCC?.childNodes ?? undefined;

		if (elemView !== null && arrow !== undefined) {
			const isViewDisplayed = !!(window.getComputedStyle(elemView, null).display === "none");
			
			elemView.style.display = isViewDisplayed ? "block" : "none";
			(arrow[1] as HTMLElement).style.display = isViewDisplayed ? "none" : "block";
			(arrow[2] as HTMLElement).style.display = isViewDisplayed ? "block" : "none";
		}
	}

	b_goto(gtPosition: string): void {
		const admElem: HTMLElement | null	= document.getElementById("admin"),
		home_elem: HTMLElement | null		= document.getElementById("app_home"),
		work_elem: HTMLElement | null		= document.getElementById("app_work"),
		about_elem: HTMLElement | null		= document.getElementById("app_about"),
		contact_elem: HTMLElement | null	= document.getElementById("app_contact"),
		user_elem: HTMLElement | null		= document.getElementById("app_user");
		
		if (admElem !== null && home_elem !== null && work_elem !== null && about_elem !== null && contact_elem !== null && user_elem !== null) {
			if (gtPosition === "top" || gtPosition === "app_home") {
				admElem.scrollTop = 0;

				if (gtPosition === "top") {
					home_elem.style.display		= "none";
					work_elem.style.display		= "none";
					about_elem.style.display	= "none";
					contact_elem.style.display	= "none";
					user_elem.style.display		= "none";

					const arrowsUp: HTMLElement[]	= Array.from(document.getElementsByClassName("arrow_up") as HTMLCollectionOf<HTMLElement>),
					arrowsDown: HTMLElement[]		= Array.from(document.getElementsByClassName("arrow_down") as HTMLCollectionOf<HTMLElement>);
					
					for (let arrow of arrowsUp) {
						arrow.style.display = "none";
					}
					for (let arrow of arrowsDown) {
						arrow.style.display = "block";
					}
				}
			}
			else {
				const elemNav: HTMLElement | null = document.getElementById(gtPosition);
				
				if (elemNav && elemNav.offsetTop > 120) admElem.scrollTop = elemNav.offsetTop - 120;
				else {
					if (gtPosition === "app_work")
						admElem.scrollTop = home_elem.clientHeight;
					
					else if (gtPosition === "app_about")
						admElem.scrollTop =
						home_elem.clientHeight +
						work_elem.clientHeight;
					
					else if (gtPosition === "app_contact")
						admElem.scrollTop =
						home_elem.clientHeight +
						work_elem.clientHeight +
						about_elem.clientHeight;
					
					else if (gtPosition === "app_user") {
						if (home_elem.clientHeight		=== 0 ||
							work_elem.clientHeight		=== 0 ||
							about_elem.clientHeight		=== 0 ||
							contact_elem.clientHeight	=== 0
							) admElem.scrollTop =
							110 +
							home_elem.clientHeight +
							work_elem.clientHeight +
							about_elem.clientHeight +
							contact_elem.clientHeight;
					}
				}
			}
		}
	}
	
	b_logout(): void {
		this.cookieService.delete("JWT", "/");
		this.router.navigate(['login']);
	}

	ngOnInit(): void {
		const cookieValue = this.cookieService.get('JWT');
		if (!cookieValue) this.router.navigate(['error403']);
		else {			
			this.loginService.check_token(cookieValue)
			.subscribe(
				(response: HttpResponse<{ }>): void  => { },
				
				(error: HttpResponse<ErrorObject>): void => {
					this.alertService.myAlert(error.body?.error.message ?? 'Unknown error while validating JWT', 'danger');
					console.error(error.body?.error);
					this.b_logout();
				}
			);
		}
	}
}