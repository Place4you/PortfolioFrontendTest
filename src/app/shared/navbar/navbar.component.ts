import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss'],
	providers: [CookieService],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent implements OnInit {

	currentRoute:	string | undefined = undefined;
	navOpen:		boolean = false;
	isLogged:		boolean = !!this.cookieService.get('JWT');

	constructor(
		private router: Router,
		private cookieService: CookieService
	) {	this.currentRoute = router.url; }

	toggleNav(): void {
		const allButtons: HTMLElement | null = document.getElementById('navigationBar');
		const navToggle: HTMLElement | null = document.getElementById('toggleNav');
		if (allButtons !== null && navToggle !== null) {
			if (this.navOpen) {
				this.navOpen = false;
				allButtons.style.display = 'none';
				navToggle.style.left = '0';
			}
			else {
				this.navOpen = true;
				allButtons.style.display = 'block';
				navToggle.style.left = '130px';
			}
		}
	}

	checkResize(): void {
		const navToggle: HTMLElement | null = document.getElementById('toggleNav');
		const allButtons: HTMLElement | null = document.getElementById('navigationBar');
		if (navToggle !== null && allButtons !== null) {
			if (window.innerWidth > 700 && window.innerHeight > 760) {
				if (getComputedStyle(navToggle, null).display === 'block' || getComputedStyle(allButtons, null).display === 'none') {
					navToggle.style.display = 'none';
					allButtons.style.display = 'block';
				}
			}
			else {
				if (getComputedStyle(navToggle, null).display === 'none') navToggle.style.display = 'block';
				if (getComputedStyle(navToggle, null).left === '0px') allButtons.style.display = 'none';
			}
		}
	}

	ngOnInit(): void {
		window.addEventListener('resize', this.checkResize);
	}
}
