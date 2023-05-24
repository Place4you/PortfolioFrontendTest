import { Component, OnInit } from '@angular/core';
import {
	HttpClientModule,
	HttpClient,
	HttpResponse
} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { InformationService } from '@@shared/services/information.service';
import { AboutService } from '@@shared/services/about.service';
import { AlertService } from '@@shared/services/alert.service';
import { ErrorObject } from '@@shared/interfaces/errorObject.interface';
import { TableAboutItemRes } from '@@shared/interfaces/tableAboutItemRes.interface';
import { TableInfoRes } from '@@shared/interfaces/tableInfoRes.interface';

interface Page {
	id: number,
	name: string,
	date: string,
	description: string,
	link?: string,
	image_uri?: string,
	image_alt?: string
}

@Component({
	selector: 'app-about',
	templateUrl: './about.component.html',
	styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

	constructor(
		private cookieService: CookieService, 
		private alertService: AlertService, 
		private http: HttpClient, 
		private aboutService: AboutService, 
		private informationService: InformationService
	) { }

	array_all:          { page: Page[] }[] = [];
	array_page:         Page[] = [];
	pageIndex:          number = 0;
	total_pages:        number = 1;
	itemsPerPage:		number = 6;
	all_selected_items: number = 0;
	current_view: 		string = "knowledge";
	show_arrows:        boolean = false;
	knowledge_items:    TableAboutItemRes[] = [];
	badges_items:       TableAboutItemRes[] = [];
	certificates_items: TableAboutItemRes[] = [];
	savedItem:			HTMLElement | null = null;
	isLogged: 			boolean = !!this.cookieService.get('JWT');
	journey: { id: number, title: string, description: string } = {
		id: 0,
		title: "No title",
		description: "No description"
	};

	makePages(view: string): void {
		const selectedNavButton:	HTMLElement | null = document.getElementById(`${view}_button`),
		navKnowledge:				HTMLElement | null = document.getElementById('knowledge_button'),
		navBadges:					HTMLElement | null = document.getElementById('badge_button'),
		navCertificates:			HTMLElement | null = document.getElementById('certificate_button');
		navKnowledge		&& (navKnowledge.style.backgroundColor = '#5c636a');
		navBadges			&& (navBadges.style.backgroundColor = '#5c636a');
		navCertificates		&& (navCertificates.style.backgroundColor = '#5c636a');
		selectedNavButton	&& (selectedNavButton.style.backgroundColor = '#000');

		this.show_arrows = false;
		this.current_view = view;
		this.array_all = [];
		this.array_page = [];
		this.pageIndex = 0;
		this.total_pages = 1;

		let start_at: number = 0,
		selected_items: TableAboutItemRes[] = 
			view === 'badge' ? this.badges_items :
			view === 'certificate' ? this.certificates_items :
			this.knowledge_items;
		this.all_selected_items = selected_items.length;

		for (let i: number = start_at; i < selected_items.length; i++) {
			if (i % this.itemsPerPage === 0 && i !== start_at) {
				if (!this.show_arrows) this.show_arrows = true;
				this.total_pages++;
				this.array_all.push({page: this.array_page});
				this.array_page = [];

				const myPage: Page = {
					id: selected_items[i].id,
					name: selected_items[i].name,
					date: selected_items[i].date,
					description: selected_items[i].description
				};
				if (selected_items[i].link) myPage.link = selected_items[i].link;
				if (selected_items[i].image_uri) myPage.image_uri = selected_items[i].image_uri;
				if (selected_items[i].image_alt) myPage.image_alt = selected_items[i].image_alt;

				this.array_page.push(myPage);
				if (i === selected_items.length - 1) {
					this.array_all.push({page: this.array_page});
					this.array_page = [];
				}
				start_at = i;
			}
			else {
				const myPage: Page = {
					id: selected_items[i].id,
					name: selected_items[i].name,
					date: selected_items[i].date,
					description: selected_items[i].description
				};
				if (selected_items[i].link) myPage.link = selected_items[i].link;
				if (selected_items[i].image_uri) myPage.image_uri = selected_items[i].image_uri;
				if (selected_items[i].image_alt) myPage.image_alt = selected_items[i].image_alt;

				this.array_page.push(myPage);
				if (i === selected_items.length - 1) {
					this.array_all.push({page: this.array_page});
					this.array_page = [];
				}
			}
		}
	}

	onRightArrow(): void {
		this.pageIndex++;
		if (this.pageIndex > this.total_pages - 1) this.pageIndex = 0;
	}
	onLeftArrow(): void {
		this.pageIndex--;
		if (this.pageIndex < 0) this.pageIndex = this.total_pages - 1;
	}

	showItemInfo(itemId: number): void {
		const allItems: TableAboutItemRes[] = [
			...this.knowledge_items,
			...this.badges_items,
			...this.certificates_items
		],
		foundItem: TableAboutItemRes | undefined = allItems.find(item => item.id === itemId);
		if (foundItem) {
			this.journey = {
				id: foundItem.id,
				title: foundItem.name,
				description: foundItem.description
			};

			const myItem: HTMLElement | null = document.getElementById(`itemImage_${itemId}`);
			myItem?.classList.add('selected_item');
			this.savedItem?.classList.remove('selected_item');
			this.savedItem = myItem;
		}
	}

	checkResize(): void {
		const { innerWidth } = window,
		breakpoints: { width: number, itemsPP: number }[] = [
			{ width: 1400, itemsPP: 6 },
			{ width: 1200, itemsPP: 5 },
			{ width: 992, itemsPP: 4 },
			{ width: 768, itemsPP: 3 },
			{ width: 575, itemsPP: 2 },
			{ width: 0, itemsPP: this.all_selected_items }
		],
		{ itemsPP } = breakpoints.find(bp => bp.width <= innerWidth) || breakpoints[0];
		if (this.itemsPerPage !== itemsPP) {
			this.itemsPerPage = itemsPP;
			this.makePages(this.current_view);
		}
	}

	ngOnInit(): void {
		window.addEventListener('resize', () => this.checkResize());
		this.checkResize();

		this.informationService.getInformationTable().subscribe(
			(response: HttpResponse<TableInfoRes[]>): void  => {
				if (response.body !== null) {
					let journey_message: string = "No description";
					for (let infoItem of response.body) {
						if (infoItem.name === "journey" && infoItem.information) {
							journey_message = infoItem.information;
							break;
						}
					}
					this.journey = {
						id: 0,
						title: "My journey",
						description: journey_message
					};
				}
			},
			(error: HttpResponse<ErrorObject>): void => {
				this.alertService.myAlert(error.body?.error.message ?? 'Unknown error while retrieving the information table', 'danger');
				console.error(error.body?.error);
			}
		);

		this.aboutService.getItems()
		.subscribe(
			(response: HttpResponse<TableAboutItemRes[]>): void  => {
				if (response.body !== null) {
					for (let aboutItem of response.body) {
						if (aboutItem.item_type === 1) this.knowledge_items.push(aboutItem);
						else if (aboutItem.item_type === 2) this.badges_items.push(aboutItem);
						else if (aboutItem.item_type === 3) this.certificates_items.push(aboutItem);
					}
				}

				let start_at: number = 0,
				selected_items: TableAboutItemRes[] = this.knowledge_items;

				for (let i: number = start_at; i < selected_items.length; i++) {
					if (i % this.itemsPerPage === 0 && i !== start_at) {
						if (!this.show_arrows) this.show_arrows = true;
						this.total_pages++;
						this.array_all.push({page: this.array_page});
						this.array_page = [];

						const myPage: Page = {
							id: selected_items[i].id,
							name: selected_items[i].name,
							date: selected_items[i].date,
							description: selected_items[i].description
						};
						if (selected_items[i].link) myPage.link = selected_items[i].link;
						if (selected_items[i].image_uri) myPage.image_uri = selected_items[i].image_uri;
						if (selected_items[i].image_alt) myPage.image_alt = selected_items[i].image_alt;

						this.array_page.push(myPage);
						if (i === selected_items.length - 1) {
							this.array_all.push({page: this.array_page});
							this.array_page = [];
						}
						start_at = i;
					}
					else {
						const myPage: Page = {
							id: selected_items[i].id,
							name: selected_items[i].name,
							date: selected_items[i].date,
							description: selected_items[i].description
						};
						if (selected_items[i].link) myPage.link = selected_items[i].link;
						if (selected_items[i].image_uri) myPage.image_uri = selected_items[i].image_uri;
						if (selected_items[i].image_alt) myPage.image_alt = selected_items[i].image_alt;
						
						this.array_page.push(myPage);
						if (i === selected_items.length - 1) {
							this.array_all.push({page: this.array_page});
							this.array_page = [];
						}
					}
				}
			},
			(error: HttpResponse<ErrorObject>): void => {
				this.alertService.myAlert(error.body?.error.message ?? 'Unknown error while retrieving the about items', 'danger');
				console.error(error.body?.error);
			}
		);
	}
}
