import { Component } from '@angular/core';
import { AboutService } from '../services/about.service';
import { InformationService } from '../services/information.service';
import { Page } from './interfaces';
import { HttpClientModule, HttpClient, HttpResponse } from '@angular/common/http'
import { TableInfoRes } from '../interfaces/tableInfoRes.interface';
import { TableAboutItemRes } from '../interfaces/tableAboutItemRes.interface';
import { ErrorObject } from '../interfaces/errorObject.interface'

@Component({
	selector: 'app-about',
	templateUrl: './about.component.html',
	styleUrls: ['./about.component.scss']
})
export class AboutComponent {

	constructor(private http: HttpClient, private aboutService: AboutService, private informationService: InformationService){ }

	array_all:          { page: Page[] }[] = [];
	array_page:         Page[] = [];
	pageIndex:          number  = 0;
	total_pages:        number  = 1;
	show_arrows:        boolean = false;
	knowledge_items:    TableAboutItemRes[] = [];
	badges_items:       TableAboutItemRes[] = [];
	certificates_items: TableAboutItemRes[] = [];
	journey: { id: number, title: string, description: string } = {
		id: 0,
		title: "No title",
		description: "No description"
	};

	onNavClick(view: string): void {
		this.show_arrows = false;

		const selectedNavButton: HTMLElement | null = document.getElementById(view);
		const navKnowledge: HTMLElement | null      = document.getElementById('knowledge_items');
		const navBadges: HTMLElement | null         = document.getElementById('badges_items');
		const navCertificates: HTMLElement | null   = document.getElementById('certificates_items');
		if(selectedNavButton != null){
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
			if(i%2 === 0 && i%3 === 0 && i !== start_at){
				if(!this.show_arrows){
					this.show_arrows = true;
				}
				this.total_pages++;
				this.array_all.push({page: this.array_page});
				this.array_page = [];
				this.array_page.push({
					id: selected_items[i].id,
					name: selected_items[i].name,
					link: selected_items[i].link,
					image_uri: selected_items[i].image_uri,
					image_alt: selected_items[i].image_alt,
					date: selected_items[i].date,
					description: selected_items[i].description
				});
				if(i === selected_items.length - 1){
					this.array_all.push({page: this.array_page});
					this.array_page = [];
				}
				start_at = i;
			}
			else{
				this.array_page.push({
					id: selected_items[i].id,
					name: selected_items[i].name,
					link: selected_items[i].link,
					image_uri: selected_items[i].image_uri,
					image_alt: selected_items[i].image_alt,
					date: selected_items[i].date,
					description: selected_items[i].description
				});
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
				i = this.knowledge_items.length - 1;
				this.journey = {
					id: this.knowledge_items[i].id,
					title: this.knowledge_items[i].name,
					description: this.knowledge_items[i].description
				}
			}
		}
		if(!found_id){
			for(let i: number = 0; i < this.badges_items.length; i++){
				if(this.badges_items[i].id === itemId){
					found_id = true;
					i = this.badges_items.length - 1;
					this.journey = {
						id: this.badges_items[i].id,
						title: this.badges_items[i].name,
						description: this.badges_items[i].description
					}
				}
			}
		}
		if(!found_id){
			for(let i: number = 0; i < this.certificates_items.length; i++){
				if(this.certificates_items[i].id === itemId){
					found_id = true;
					i = this.certificates_items.length - 1;
					this.journey = {
						id: this.certificates_items[i].id,
						title: this.certificates_items[i].name,
						description: this.certificates_items[i].description
					}
				}
			}
		}
	}

	ngOnInit(): void {
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
					console.log(error.body.error);
					// redirect to error pages
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
						this.array_page.push({
							id: selected_items[i].id,
							name: selected_items[i].name,
							link: selected_items[i].link,
							image_uri: selected_items[i].image_uri,
							image_alt: selected_items[i].image_alt,
							date: selected_items[i].date,
							description: selected_items[i].description
						});
						if(i === selected_items.length - 1){
							this.array_all.push({page: this.array_page});
							this.array_page = [];
						}
						start_at = i;
					}
					else{
						this.array_page.push({
							id: selected_items[i].id,
							name: selected_items[i].name,
							link: selected_items[i].link,
							image_uri: selected_items[i].image_uri,
							image_alt: selected_items[i].image_alt,
							date: selected_items[i].date,
							description: selected_items[i].description
						});
						if(i === selected_items.length - 1){
							this.array_all.push({page: this.array_page});
							this.array_page = [];
						}
					}
				}
			},
			(error: HttpResponse<ErrorObject>): void => {
				if(error.body !== null){
					console.log(error.body.error);
					// redirect to error pages
				}
			}
		);
	}
}
