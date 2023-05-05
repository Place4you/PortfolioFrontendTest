import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router'
import { CookieService } from 'ngx-cookie-service';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss'],
	providers: [CookieService],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {

	currentRoute: string | undefined = undefined;

	constructor (private router: Router, private cookieService: CookieService) {
		this.currentRoute = router.url;
	}

	isLogged(){
		return this.cookieService.get('JWT') ? true : false;
	}
}
