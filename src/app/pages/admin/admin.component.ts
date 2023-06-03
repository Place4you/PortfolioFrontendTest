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
	
	viewClick(view: string): void {
		const elemView: HTMLElement | null			= document.getElementById(`app${view}`),
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

	bGoto(gtPosition: string): void {
		const admElem: HTMLElement | null	= document.getElementById("admin"),
		homeElem: HTMLElement | null		= document.getElementById("appHome"),
		workElem: HTMLElement | null		= document.getElementById("appWork"),
		aboutElem: HTMLElement | null		= document.getElementById("appAbout"),
		contactElem: HTMLElement | null	= document.getElementById("appContact"),
		userElem: HTMLElement | null		= document.getElementById("appUser");
		
		if (admElem !== null && homeElem !== null && workElem !== null && aboutElem !== null && contactElem !== null && userElem !== null) {
			if (gtPosition === "top" || gtPosition === "appHome") {
				admElem.scrollTop = 0;

				if (gtPosition === "top") {
					homeElem.style.display		= "none";
					workElem.style.display		= "none";
					aboutElem.style.display	= "none";
					contactElem.style.display	= "none";
					userElem.style.display		= "none";

					const arrowsUp: HTMLElement[]	= Array.from(document.getElementsByClassName("arrowUp") as HTMLCollectionOf<HTMLElement>),
					arrowsDown: HTMLElement[]		= Array.from(document.getElementsByClassName("arrowDown") as HTMLCollectionOf<HTMLElement>);
					
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
					if (gtPosition === "appWork")
						admElem.scrollTop = homeElem.clientHeight;
					
					else if (gtPosition === "appAbout")
						admElem.scrollTop =
						homeElem.clientHeight +
						workElem.clientHeight;
					
					else if (gtPosition === "appContact")
						admElem.scrollTop =
						homeElem.clientHeight +
						workElem.clientHeight +
						aboutElem.clientHeight;
					
					else if (gtPosition === "appUser") {
						if (homeElem.clientHeight		=== 0 ||
							workElem.clientHeight		=== 0 ||
							aboutElem.clientHeight		=== 0 ||
							contactElem.clientHeight	=== 0
							) admElem.scrollTop =
							110 +
							homeElem.clientHeight +
							workElem.clientHeight +
							aboutElem.clientHeight +
							contactElem.clientHeight;
					}
				}
			}
		}
	}
	
	bLogout(): void {
		this.cookieService.delete("JWT", "/");
		this.router.navigate(['login']);
	}

	ngOnInit(): void {
		const cookieValue = this.cookieService.get('JWT');
		if (!cookieValue) this.router.navigate(['error403']);
		else {			
			this.loginService.checkToken(cookieValue)
			.subscribe(
				(response: HttpResponse<{ }>): void  => { },
				
				(error: HttpResponse<ErrorObject>): void => {
					this.alertService.myAlert(error.body?.error.message ?? 'Unknown error while validating JWT', 'danger');
					console.error(error.body?.error);
					this.bLogout();
				}
			);
		}
	}
}