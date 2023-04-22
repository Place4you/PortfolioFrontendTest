import { Component } from '@angular/core';
import { WorkService } from '../rest/work.service';
import { Project } from "./interfaces";

@Component({
	selector: 'app-work',
	templateUrl: './work.component.html',
	styleUrls: ['./work.component.scss']
})
export class WorkComponent {
	
	constructor(private workService: WorkService){ }

	array_all:            { page: Project[] }[] = [];
	page_selector_items:  { number: number }[] = [{number: 1}];
	project_items:        Project[] = [];
	current_order:        string = "AZ";
	pageIndex:            number = 0;
	total_pages:          number = 1;
	show_arrows:          boolean = false;
	description_open:     boolean = false;

	curr_project: Project = {
		id: 0,
		name: "Not assigned",
		code_uri: "Not assigned",
		live_uri: "Not assigned",
		image_uri: "Not assigned",
		image_alt: "Not assigned",
		date: new Date(),
		technologies: "Not assigned",
		description: "Not assigned"
	};
	
	onRightArrow(): void {
		this.pageIndex++;
		if(this.pageIndex > this.total_pages - 1){
			this.pageIndex = 0;
		}
		const item: HTMLInputElement = document.getElementById(`${this.pageIndex + 1}`) as HTMLInputElement;
		if(item){
			item.checked = true;
			const horizontal_bar: HTMLElement | null = document.getElementById("page_selector");
			if(horizontal_bar !== null){
				if(this.pageIndex <= 2){
					horizontal_bar.scrollLeft = 0;
				}
				else {
					if(this.pageIndex >= this.total_pages - 2){
						horizontal_bar.scrollLeft = horizontal_bar.scrollWidth;
					}
					else {
						horizontal_bar.scrollLeft = item.offsetLeft - 50;
					}
				}
			}
		}
	}
	onLeftArrow(): void {
		this.pageIndex--;
		if(this.pageIndex < 0){
			this.pageIndex = this.total_pages - 1;
		}
		const item: HTMLInputElement = document.getElementById(`${this.pageIndex + 1}`) as HTMLInputElement;
		if(item){
			item.checked = true;
			const horizontal_bar: HTMLElement | null = document.getElementById("page_selector");
			if(horizontal_bar !== null){
				if(this.pageIndex >= this.total_pages - 2){
					horizontal_bar.scrollLeft = horizontal_bar.scrollWidth;
				}
				else {
					if(this.pageIndex <= 2){
						horizontal_bar.scrollLeft = 0;
					}
					else {
						horizontal_bar.scrollLeft = item.offsetLeft - 75;
					}
				}
			}
		}
	}

	changePage(page_number: number): void {
		this.pageIndex = page_number - 1;
	}

	view_description(open: boolean, projectId: number): void {
		this.description_open = open;
		if(open){
			for(let i: number = 0; i < this.project_items.length; i++){
				if(this.project_items[i].id === projectId){
					this.curr_project = {
						id: this.project_items[i].id,
						name: this.project_items[i].name,
						code_uri: this.project_items[i].code_uri,
						live_uri: this.project_items[i].live_uri,
						image_uri: this.project_items[i].image_uri,
						image_alt: this.project_items[i].image_alt,
						date: this.project_items[i].date,
						technologies: this.project_items[i].technologies,
						description: this.project_items[i].description
					};
				}
			}
		}
	}

	orderBy(order: string): void {
		if(this.current_order !== order){
			const possible_order: string[] = ["NL", "LN", "AZ", "ZA"];
			
			if(order === possible_order[0]){
				this.project_items.sort(function (a, b){
					return +new Date(b.date) - +new Date(a.date);
				});
			}
			else if(order === possible_order[1]){
				this.project_items.sort(function (a, b){
					return +new Date(a.date) - +new Date(b.date);
				});
			}
			else if(order === possible_order[2]){
				this.project_items.sort(function (a, b){
					return a.name.localeCompare(b.name);
				});
			}
			else if(order === possible_order[3]){
				this.project_items.sort(function (a, b){
					return b.name.localeCompare(a.name);
				})
			}
			this.current_order = order;
			this.createPages();
		}
	}

	createPages(): void {
		let array_page: Project[] = [];
		let start_at: number      = 0;
		this.array_all            = [];
		this.total_pages          = 1;
		this.pageIndex            = 0;
		this.page_selector_items  = [{ number: 1 }];

		for(let i: number = start_at; i < this.project_items.length; i++){
			if(i%2 === 0 && i%3 === 0 && i !== start_at){
				if(!this.show_arrows){
					this.show_arrows = true;
				}

				this.page_selector_items.push({
					number: this.total_pages + 1
				});          

				this.total_pages++;
				this.array_all.push({page: array_page});
				array_page = [];
				array_page.push({
					id: this.project_items[i].id,
					name: this.project_items[i].name,
					code_uri: this.project_items[i].code_uri,
					live_uri: this.project_items[i].live_uri,
					image_uri: this.project_items[i].image_uri,
					image_alt: this.project_items[i].image_alt,
					date: this.project_items[i].date,
					technologies: this.project_items[i].technologies,
					description: this.project_items[i].description
				});
				if(i === this.project_items.length - 1){
					this.array_all.push({page: array_page});
					array_page = [];
				}
				start_at = i;
			}
			else{
				array_page.push({
					id: this.project_items[i].id,
					name: this.project_items[i].name,
					code_uri: this.project_items[i].code_uri,
					live_uri: this.project_items[i].live_uri,
					image_uri: this.project_items[i].image_uri,
					image_alt: this.project_items[i].image_alt,
					date: this.project_items[i].date,
					technologies: this.project_items[i].technologies,
					description: this.project_items[i].description
				});
				if(i === this.project_items.length - 1){
					this.array_all.push({page: array_page});
					array_page = [];
				}
			}
		}
	}


	ngOnInit(): void {
		this.workService.getItems()
		.subscribe((response: any): void => {
			for(let i: number = 0; i < response.body.length; i++){
				this.project_items.push(response.body[i]);
			}
			this.orderBy("NL");
		});
	}
}
