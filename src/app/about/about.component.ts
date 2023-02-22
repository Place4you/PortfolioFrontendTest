import { Component } from '@angular/core';
import { AboutService } from '../rest/about.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {

  array_all: Array<{ page: any }> = [];
  array_page: Array<{ id: number, name: string, link: string, image_uri: string, image_alt: string }> = [];
  pageIndex: number = 0;
  total_pages: number = 1;

  viewItems: string = 'knowledge_items';
  
  onNavClick(view: string){
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
    this.viewItems = view;
    this.array_all = [];
    this.array_page = [];
    this.pageIndex = 0;
    this.total_pages = 1;

    let start_at: number = 0;
    let selected_items = this.knowledge_items;
    if(view === 'badges_items'){
      selected_items = this.badges_items;
    }
    else if(view === 'certificates_items'){
      selected_items = this.certificates_items;
    }

    for(let i: number = start_at; i < selected_items.length; i++){
      if(i%2 === 0 && i%3 === 0 && i !== start_at){
        this.total_pages++;
        this.array_all.push({page: this.array_page});
        this.array_page = [];
        this.array_page.push({
          id: selected_items[i].id,
          name: selected_items[i].name,
          link: selected_items[i].link,
          image_uri: selected_items[i].image_uri,
          image_alt: selected_items[i].image_alt
        });
        start_at = i;
      }
      else{
        this.array_page.push({
          id: selected_items[i].id,
          name: selected_items[i].name,
          link: selected_items[i].link,
          image_uri: selected_items[i].image_uri,
          image_alt: selected_items[i].image_alt
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

  constructor(private aboutService: AboutService){

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
      let selected_items = this.knowledge_items;

      for(let i: number = start_at; i < selected_items.length; i++){
        if(i%2 === 0 && i%3 === 0 && i !== start_at){
          this.total_pages++;
          this.array_all.push({page: this.array_page});
          this.array_page = [];
          this.array_page.push({
            id: selected_items[i].id,
            name: selected_items[i].name,
            link: selected_items[i].link,
            image_uri: selected_items[i].image_uri,
            image_alt: selected_items[i].image_alt
          });
          start_at = i;
        }
        else{
          this.array_page.push({
            id: selected_items[i].id,
            name: selected_items[i].name,
            link: selected_items[i].link,
            image_uri: selected_items[i].image_uri,
            image_alt: selected_items[i].image_alt
          });
          if(i === selected_items.length - 1){
            this.array_all.push({page: this.array_page});
            this.array_page = [];
          }
        }
      }

    });
  }

  knowledge_items: Array<{id: number, item_type: number, name: string, link: string, image_uri: string, image_alt: string, date: Date}> = [];
  badges_items: Array<{id: number, item_type: number, name: string, link: string, image_uri: string, image_alt: string, date: Date}> = [];
  certificates_items: Array<{id: number, item_type: number, name: string, link: string, image_uri: string, image_alt: string, date: Date}> = [];
}


