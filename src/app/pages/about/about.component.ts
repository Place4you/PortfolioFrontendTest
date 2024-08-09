import { ErrorObject } from '@@shared/interfaces/errorObject.interface';
import { TableAboutItemRes } from '@@shared/interfaces/tableAboutItemRes.interface';
import { TableInfoRes } from '@@shared/interfaces/tableInfoRes.interface';
import { AboutService } from '@@shared/services/about.service';
import { AlertService } from '@@shared/services/alert.service';
import { InformationService } from '@@shared/services/information.service';
import {
	HttpClient,
	HttpClientModule,
	HttpResponse
} from '@angular/common/http';
import {
	AfterViewInit,
	Component,
	ElementRef,
	OnInit,
	ViewChild
} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

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
export class AboutComponent implements OnInit,AfterViewInit {

	@ViewChild('navKnowButton', { static: false })
	navKnowButtonRef!: ElementRef<HTMLButtonElement>;
	@ViewChild('navBadButton', { static: false })
	navBadButtonRef!: ElementRef<HTMLButtonElement>;
	@ViewChild('navCertButton', { static: false })
	navCertButtonRef!: ElementRef<HTMLButtonElement>;

	constructor(
		private cookieService: CookieService,
		private alertService: AlertService,
		private http: HttpClient,
		private aboutService: AboutService,
		private informationService: InformationService
	) { }

	arrayAll:          { page: Page[] }[] = [];
	arrayPage:         Page[] = [];
	pageIndex:          number = 0;
	totalPages:        number = 1;
	itemsPerPage:		number = 5;
	allSelectedItems: number = 0;
	currentView: 		string = "knowledge";
	showArrows:        boolean = false;
	knowledgeItems:    TableAboutItemRes[] = [];
	badgesItems:       TableAboutItemRes[] = [];
	certificatesItems: TableAboutItemRes[] = [];
	savedItem:			HTMLElement | null = null;
	isLogged: 			boolean = !!this.cookieService.get('JWT');
	journey: { id: number, title: string, description: string } = {
		id: 0,
		title: "No title",
		description: "No description"
	};

	makePages(view: string): void {
		const selectedNavButton: HTMLElement | null = document.getElementById(`${view}Button`);

		this.navKnowButtonRef.nativeElement.classList.remove('selectedNavButton');
		this.navBadButtonRef.nativeElement.classList.remove('selectedNavButton');
		this.navCertButtonRef.nativeElement.classList.remove('selectedNavButton');
		selectedNavButton && (selectedNavButton.classList.add('selectedNavButton'));

		this.showArrows = false;
		this.currentView = view;
		this.arrayAll = [];
		this.arrayPage = [];
		this.pageIndex = 0;
		this.totalPages = 1;

		let startAt: number = 0,
		selectedItems: TableAboutItemRes[] =
			view === 'badge' ? this.badgesItems :
			view === 'certificate' ? this.certificatesItems :
			this.knowledgeItems;
		this.allSelectedItems = selectedItems.length;

		for (let i: number = startAt; i < selectedItems.length; i++) {
			if (i % this.itemsPerPage === 0 && i !== startAt) {
				if (!this.showArrows) this.showArrows = true;
				this.totalPages++;
				this.arrayAll.push({page: this.arrayPage});
				this.arrayPage = [];

				const myPage: Page = {
					id: selectedItems[i].id,
					name: selectedItems[i].name,
					date: selectedItems[i].date,
					description: selectedItems[i].description
				};
				if (selectedItems[i].link) myPage.link = selectedItems[i].link;
				if (selectedItems[i].image_uri) myPage.image_uri = selectedItems[i].image_uri;
				if (selectedItems[i].image_alt) myPage.image_alt = selectedItems[i].image_alt;

				this.arrayPage.push(myPage);
				if (i === selectedItems.length - 1) {
					this.arrayAll.push({page: this.arrayPage});
					this.arrayPage = [];
				}
				startAt = i;
			}
			else {
				const myPage: Page = {
					id: selectedItems[i].id,
					name: selectedItems[i].name,
					date: selectedItems[i].date,
					description: selectedItems[i].description
				};
				if (selectedItems[i].link) myPage.link = selectedItems[i].link;
				if (selectedItems[i].image_uri) myPage.image_uri = selectedItems[i].image_uri;
				if (selectedItems[i].image_alt) myPage.image_alt = selectedItems[i].image_alt;

				this.arrayPage.push(myPage);
				if (i === selectedItems.length - 1) {
					this.arrayAll.push({page: this.arrayPage});
					this.arrayPage = [];
				}
			}
		}
	}

	onRightArrow(): void {
		this.pageIndex++;
		if (this.pageIndex > this.totalPages - 1) this.pageIndex = 0;
	}
	onLeftArrow(): void {
		this.pageIndex--;
		if (this.pageIndex < 0) this.pageIndex = this.totalPages - 1;
	}

	currentItem: number = 0;
	showItemInfo(itemId: number): void {
		if(this.currentItem === itemId) return;
		this.currentItem = itemId;
		const allItems: TableAboutItemRes[] = [
			...this.knowledgeItems,
			...this.badgesItems,
			...this.certificatesItems
		],
		foundItem: TableAboutItemRes | undefined = allItems.find(item => item.id === itemId);
		if (foundItem) {
			this.journey = {
				id: foundItem.id,
				title: foundItem.name,
				description: foundItem.description
			};

			const myItem: HTMLElement | null = document.getElementById(`itemImage_${itemId}`);
			myItem?.classList.add('selectedItem');
			this.savedItem?.classList.remove('selectedItem');
			this.savedItem = myItem;

			window.scrollTo(0, 0);
		}
	}

	checkResize(): void {
		const { innerWidth } = window,
		breakpoints: { width: number, itemsPP: number }[] = [
			{ width: 1400, itemsPP: 5 },
			{ width: 1200, itemsPP: 4 },
			{ width: 992, itemsPP: 3 },
			{ width: 768, itemsPP: 2 },
			{ width: 0, itemsPP: this.allSelectedItems }
		],
		{ itemsPP } = breakpoints.find(bp => bp.width <= innerWidth) || breakpoints[0];
		if (this.itemsPerPage !== itemsPP) {
			this.itemsPerPage = itemsPP;
			this.makePages(this.currentView);
		}
	}

	ngOnInit(): void {
		window.addEventListener('resize', () => this.checkResize());

		this.informationService.getInformationTable().subscribe(
			(response: HttpResponse<TableInfoRes[]>): void  => {
				if (response.body !== null) {
					let journeyMessage: string = "No description";
					for (let infoItem of response.body) {
						if (infoItem.name === "journey" && infoItem.information) {
							journeyMessage = infoItem.information;
							break;
						}
					}
					this.journey = {
						id: 0,
						title: "My journey",
						description: journeyMessage
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
						if (aboutItem.item_type === 1) this.knowledgeItems.push(aboutItem);
						else if (aboutItem.item_type === 2) this.badgesItems.push(aboutItem);
						else if (aboutItem.item_type === 3) this.certificatesItems.push(aboutItem);
					}
				}

				// Sort knowledgeItems by id in ascending order
				this.knowledgeItems.sort((a, b) => a.id - b.id);

				// Sort badgesItems by date in descending order
				this.badgesItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

				// Sort certificatesItems by date in descending order
				this.certificatesItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

				let startAt: number = 0,
				selectedItems: TableAboutItemRes[] = this.knowledgeItems;

				for (let i: number = startAt; i < selectedItems.length; i++) {
					if (i % this.itemsPerPage === 0 && i !== startAt) {
						if (!this.showArrows) this.showArrows = true;
						this.totalPages++;
						this.arrayAll.push({page: this.arrayPage});
						this.arrayPage = [];

						const myPage: Page = {
							id: selectedItems[i].id,
							name: selectedItems[i].name,
							date: selectedItems[i].date,
							description: selectedItems[i].description
						};
						if (selectedItems[i].link) myPage.link = selectedItems[i].link;
						if (selectedItems[i].image_uri) myPage.image_uri = selectedItems[i].image_uri;
						if (selectedItems[i].image_alt) myPage.image_alt = selectedItems[i].image_alt;

						this.arrayPage.push(myPage);
						if (i === selectedItems.length - 1) {
							this.arrayAll.push({page: this.arrayPage});
							this.arrayPage = [];
						}
						startAt = i;
					}
					else {
						const myPage: Page = {
							id: selectedItems[i].id,
							name: selectedItems[i].name,
							date: selectedItems[i].date,
							description: selectedItems[i].description
						};
						if (selectedItems[i].link) myPage.link = selectedItems[i].link;
						if (selectedItems[i].image_uri) myPage.image_uri = selectedItems[i].image_uri;
						if (selectedItems[i].image_alt) myPage.image_alt = selectedItems[i].image_alt;

						this.arrayPage.push(myPage);
						if (i === selectedItems.length - 1) {
							this.arrayAll.push({page: this.arrayPage});
							this.arrayPage = [];
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

	ngAfterViewInit(): void {
		this.checkResize();
	}
}
