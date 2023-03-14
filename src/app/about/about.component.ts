import { Component } from '@angular/core';
import { AboutService } from '../rest/about.service';
import { Item } from './interfaces/item.interface';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {

  constructor(private aboutService: AboutService){ }
  

  array_all:    Array<{ page: any }> = [];
  array_page:   Array<{ id: number, name: string, link: string, image_uri: string, image_alt: string, date: Date, description: string }> = [];
  pageIndex:    number  = 0;
  total_pages:  number  = 1;
  show_arrows:  boolean = false;
  journey: { id: number, title: string, description: string } = {
    id: 0,
    title: "No title",
    description: "No description"
  };

  knowledge_items:    Array<Item> = [];
  badges_items:       Array<Item> = [];
  certificates_items: Array<Item> = [];

  
  onNavClick(view: string){
    this.show_arrows = false;

    const selectedNavButton = document.getElementById(view);
    const navKnowledge = document.getElementById('knowledge_items');
    const navBadges = document.getElementById('badges_items');
    const navCertificates = document.getElementById('certificates_items');
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
    let selected_items: Array<Item> = this.knowledge_items;

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

  onRightArrow(){
    this.pageIndex++;
    if(this.pageIndex > this.total_pages - 1){
      this.pageIndex = 0;
    }
  }
  onLeftArrow(){
    this.pageIndex--;
    if(this.pageIndex < 0){
      this.pageIndex = this.total_pages - 1;
    }
  }

  showItemInfo(itemId: number){
    let found_id: boolean = false;

    for(let i = 0; i < this.knowledge_items.length; i++){
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
      for(let i = 0; i < this.badges_items.length; i++){
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
      for(let i = 0; i < this.certificates_items.length; i++){
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



  // https://stackoverflow.com/a/35763811/18895342
  ngOnInit(){
    this.aboutService.getJourney()
    .subscribe((response: any) => {
      this.journey = {
        id: 0,
        title: "My journey",
        description: response.body[0].about_me
      }
    });

    this.aboutService.getItems()
    .subscribe((response: any) => {
      for(let i: number = 0; i < response.body.length; i++){
        if(response.body[i]){
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
      let selected_items: Array<Item> = this.knowledge_items;

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

    });
  }

}



