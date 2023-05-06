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
	nav_open: boolean = false;

	constructor (private router: Router, private cookieService: CookieService) {
		this.currentRoute = router.url;
	}

	toggle_nav(): void {
		const all_buttons: HTMLElement | null = document.getElementById('navigationbar');
		const nav_toggle: HTMLElement | null = document.getElementById('toggle_nav');
		if(all_buttons !== null && nav_toggle !== null){
			if(this.nav_open){
				this.nav_open = false;
				all_buttons.style.display = 'none';
				nav_toggle.style.left = '0';
			}
			else {
				this.nav_open = true;
				all_buttons.style.display = 'block';
				nav_toggle.style.left = '180px';
			}
		}
	}

	isLogged(): boolean {
		return this.cookieService.get('JWT') ? true : false;
	}

	checkWidth(): void {
		const nav_toggle: HTMLElement | null = document.getElementById('toggle_nav');
		const all_buttons: HTMLElement | null = document.getElementById('navigationbar');
		if(nav_toggle !== null && all_buttons !== null){
			if(window.innerWidth > 700 && window.innerHeight > 700){
				if(nav_toggle.style.display === 'block' || all_buttons.style.display === 'none'){
					nav_toggle.style.display = 'none';
					all_buttons.style.display = 'block';
				}
			}
			else {
				if(nav_toggle.style.display === 'none'){
					nav_toggle.style.display = 'block';
				}
				if(nav_toggle.style.left === '0px'){
					all_buttons.style.display = 'none';
				}
			}
		}
	}

	ngOnInit(): void {
		window.addEventListener('resize', this.checkWidth);
	}
}
