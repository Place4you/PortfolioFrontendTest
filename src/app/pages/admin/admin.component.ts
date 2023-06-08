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

	@ViewChild('admin', { static: false })
	admElemRef!: ElementRef<HTMLElement>;
	@ViewChild('appHome', { static: false })
	appHomeRef!: ElementRef<HTMLDivElement>;
	@ViewChild('appWork', { static: false })
	appWorkRef!: ElementRef<HTMLDivElement>;
	@ViewChild('appAbout', { static: false })
	appAboutRef!: ElementRef<HTMLDivElement>;
	@ViewChild('appContact', { static: false })
	appContactRef!: ElementRef<HTMLDivElement>;
	@ViewChild('appUser', { static: false })
	appUserRef!: ElementRef<HTMLDivElement>;

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
		if (gtPosition === "top" || gtPosition === "appHome") {
			this.admElemRef.nativeElement.scrollTop = 0;

			if (gtPosition === "top") {
				this.appHomeRef.nativeElement.style.display		= "none";
				this.appWorkRef.nativeElement.style.display		= "none";
				this.appAboutRef.nativeElement.style.display	= "none";
				this.appContactRef.nativeElement.style.display	= "none";
				this.appUserRef.nativeElement.style.display		= "none";

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

			if (elemNav && elemNav.offsetTop > 120) this.admElemRef.nativeElement.scrollTop = elemNav.offsetTop - 120;
			else {
				if (gtPosition === "appWork")
					this.admElemRef.nativeElement.scrollTop =
					this.appHomeRef.nativeElement.clientHeight;

				else if (gtPosition === "appAbout")
					this.admElemRef.nativeElement.scrollTop =
					this.appHomeRef.nativeElement.clientHeight +
					this.appWorkRef.nativeElement.clientHeight;

				else if (gtPosition === "appContact")
					this.admElemRef.nativeElement.scrollTop =
					this.appHomeRef.nativeElement.clientHeight +
					this.appWorkRef.nativeElement.clientHeight +
					this.appAboutRef.nativeElement.clientHeight;

				else if (gtPosition === "appUser") {
					if (this.appHomeRef.nativeElement.clientHeight		=== 0 ||
						this.appWorkRef.nativeElement.clientHeight		=== 0 ||
						this.appAboutRef.nativeElement.clientHeight		=== 0 ||
						this.appContactRef.nativeElement.clientHeight	=== 0
					) this.admElemRef.nativeElement.scrollTop =
						110 +
						this.appHomeRef.nativeElement.clientHeight +
						this.appWorkRef.nativeElement.clientHeight +
						this.appAboutRef.nativeElement.clientHeight +
						this.appContactRef.nativeElement.clientHeight;
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