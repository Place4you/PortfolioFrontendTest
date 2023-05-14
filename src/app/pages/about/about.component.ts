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
import { ErrorObject } from '@@shared/interfaces/errorObject.interface'
import { Page } from './interfaces';
import { TableAboutItemRes } from '@@shared/interfaces/tableAboutItemRes.interface';
import { TableInfoRes } from '@@shared/interfaces/tableInfoRes.interface';

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
	){}

	array_all:          { page: Page[] }[] = [];
	array_page:         Page[] = [];
	pageIndex:          number = 0;
	total_pages:        number = 1;
	itemsPerPage:		number = 6;
	current_view: 		string = "knowledge_items";
	show_arrows:        boolean = false;
	knowledge_items:    TableAboutItemRes[] = [];
	badges_items:       TableAboutItemRes[] = [];
	certificates_items: TableAboutItemRes[] = [];
	journey: { id: number, title: string, description: string } = {
		id: 0,
		title: "No title",
		description: "No description"
	};


	isLogged(): boolean {
		if(!this.cookieService.get('JWT')){
			return false;
		}
		return true;
	}
	
	makePages(view: string): void {
		this.show_arrows = false;
		const selectedNavButton: HTMLElement | null = document.getElementById(view);
		const navKnowledge: HTMLElement | null      = document.getElementById('knowledge_items');
		const navBadges: HTMLElement | null         = document.getElementById('badges_items');
		const navCertificates: HTMLElement | null   = document.getElementById('certificates_items');
		if(selectedNavButton != null){
			this.current_view = view;
			if(navKnowledge != null && navBadges != null && navCertificates != null){
				navKnowledge.style.backgroundColor = '#5c636a';
				navBadges.style.backgroundColor = '#5c636a';
				navCertificates.style.backgroundColor = '#5c636a';
				selectedNavButton.style.backgroundColor = '#000';
			}
		}
		this.array_all = [];
		this.array_page = [];
		this.pageIndex = 0;
		this.total_pages = 1;

		let start_at: number = 0;
		let selected_items: TableAboutItemRes[] = this.knowledge_items;

		if(view === 'badges_items'){
			selected_items = this.badges_items;
		}
		else if(view === 'certificates_items'){
			selected_items = this.certificates_items;
		}

		for(let i: number = start_at; i < selected_items.length; i++){
			if(i % this.itemsPerPage === 0 && i !== start_at){
				if(!this.show_arrows){
					this.show_arrows = true;
				}
				this.total_pages++;
				this.array_all.push({page: this.array_page});
				this.array_page = [];
				const myPage: Page = {
					id: selected_items[i].id,
					name: selected_items[i].name,
					date: selected_items[i].date,
					description: selected_items[i].description
				}
				if(selected_items[i].link) myPage.link = selected_items[i].link;
				if(selected_items[i].image_uri) myPage.image_uri = selected_items[i].image_uri;
				if(selected_items[i].image_alt) myPage.image_alt = selected_items[i].image_alt;
				this.array_page.push(myPage);
				if(i === selected_items.length - 1){
					this.array_all.push({page: this.array_page});
					this.array_page = [];
				}
				start_at = i;
			}
			else{
				const myPage: Page = {
					id: selected_items[i].id,
					name: selected_items[i].name,
					date: selected_items[i].date,
					description: selected_items[i].description
				}
				if(selected_items[i].link) myPage.link = selected_items[i].link;
				if(selected_items[i].image_uri) myPage.image_uri = selected_items[i].image_uri;
				if(selected_items[i].image_alt) myPage.image_alt = selected_items[i].image_alt;
				this.array_page.push(myPage);
				if(i === selected_items.length - 1){
					this.array_all.push({page: this.array_page});
					this.array_page = [];
				}
			}
		}
	}

	onRightArrow(): void {
		this.pageIndex++;
		if(this.pageIndex > this.total_pages - 1){
			this.pageIndex = 0;
		}
	}
	onLeftArrow(): void {
		this.pageIndex--;
		if(this.pageIndex < 0){
			this.pageIndex = this.total_pages - 1;
		}
	}

	showItemInfo(itemId: number): void {
		let found_id: boolean = false;

		for(let i: number = 0; i < this.knowledge_items.length; i++){
			if(this.knowledge_items[i].id === itemId){
				found_id = true;
				this.journey = {
					id: this.knowledge_items[i].id,
					title: this.knowledge_items[i].name,
					description: this.knowledge_items[i].description
				}
				i = this.knowledge_items.length - 1;
			}
		}
		if(!found_id){
			for(let i: number = 0; i < this.badges_items.length; i++){
				if(this.badges_items[i].id === itemId){
					found_id = true;
					this.journey = {
						id: this.badges_items[i].id,
						title: this.badges_items[i].name,
						description: this.badges_items[i].description
					}
					i = this.badges_items.length - 1;
				}
			}
		}
		if(!found_id){
			for(let i: number = 0; i < this.certificates_items.length; i++){
				if(this.certificates_items[i].id === itemId){
					found_id = true;
					this.journey = {
						id: this.certificates_items[i].id,
						title: this.certificates_items[i].name,
						description: this.certificates_items[i].description
					}
					i = this.certificates_items.length - 1;
				}
			}
		}
	}

	checkResize(): void {
		const { innerWidth } = window;
		const breakpoints: { width: number, itemsPP: number }[] = [
			{ width: 1400, itemsPP: 6 },
			{ width: 1200, itemsPP: 5 },
			{ width: 992, itemsPP: 4 },
			{ width: 768, itemsPP: 3 },
			{ width: 544, itemsPP: 2 },
			{ width: 0, itemsPP: 1 }
		];
		const { itemsPP } = breakpoints.find(bp => bp.width <= innerWidth) || breakpoints[0];
		if(this.itemsPerPage !== itemsPP){
			this.itemsPerPage = itemsPP;
			this.makePages(this.current_view);
		}
	}

	ngOnInit(): void {
		window.addEventListener('resize', () => this.checkResize());
		this.checkResize();

		this.informationService.getInformationTable().subscribe(
			(response: HttpResponse<TableInfoRes[]>): void  => {
				if(response.body !== null){
					let journey_message: string = "No description";
					for(let i: number = 0; i < response.body.length; i++){
						if(response.body[i].name === "journey" && response.body[i].information){
							journey_message = response.body[i].information;
							i = response.body.length;
						}
					}
					this.journey = {
						id: 0,
						title: "My journey",
						description: journey_message
					}
				}
			},
			(error: HttpResponse<ErrorObject>): void => {
				if(error.body !== null){
					this.alertService.myAlert(error.body.error.message ?? 'Unknown error while retrieving the information table', 'danger');
					console.error(error.body.error);
				}
			}
		);

		this.aboutService.getItems()
		.subscribe(
			(response: HttpResponse<TableAboutItemRes[]>): void  => {
				if(response.body !== null){
					for(let i: number = 0; i < response.body.length; i++){
						if(response.body[i].item_type === 1){
							this.knowledge_items.push(response.body[i]);
						}
						else if(response.body[i].item_type === 2){
							this.badges_items.push(response.body[i]);
						}
						else if(response.body[i].item_type === 3){
							this.certificates_items.push(response.body[i]);
						}
					}
				}

				let start_at: number = 0;
				let selected_items: TableAboutItemRes[] = this.knowledge_items;

				for(let i: number = start_at; i < selected_items.length; i++){
					if(i%2 === 0 && i%3 === 0 && i !== start_at){
						if(!this.show_arrows){
							this.show_arrows = true;
						}
						this.total_pages++;
						this.array_all.push({page: this.array_page});
						this.array_page = [];
						const myPage: Page = {
							id: selected_items[i].id,
							name: selected_items[i].name,
							date: selected_items[i].date,
							description: selected_items[i].description
						}
						if(selected_items[i].link) myPage.link = selected_items[i].link;
						if(selected_items[i].image_uri) myPage.image_uri = selected_items[i].image_uri;
						if(selected_items[i].image_alt) myPage.image_alt = selected_items[i].image_alt;
						this.array_page.push(myPage);
						if(i === selected_items.length - 1){
							this.array_all.push({page: this.array_page});
							this.array_page = [];
						}
						start_at = i;
					}
					else{
						const myPage: Page = {
							id: selected_items[i].id,
							name: selected_items[i].name,
							date: selected_items[i].date,
							description: selected_items[i].description
						}
						if(selected_items[i].link) myPage.link = selected_items[i].link;
						if(selected_items[i].image_uri) myPage.image_uri = selected_items[i].image_uri;
						if(selected_items[i].image_alt) myPage.image_alt = selected_items[i].image_alt;
						this.array_page.push(myPage);
						if(i === selected_items.length - 1){
							this.array_all.push({page: this.array_page});
							this.array_page = [];
						}
					}
				}
			},
			(error: HttpResponse<ErrorObject>): void => {
				if(error.body !== null){
					this.alertService.myAlert(error.body.error.message ?? 'Unknown error while retrieving the about items', 'danger');
					console.error(error.body.error);
				}
			}
		);
	}
}