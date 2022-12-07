import { Component } from '@angular/core';

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.scss']
})
export class WorkComponent {
  
  array_all: Array<{ page: any }> = [];
  array_page: Array<{ id: number, name: string, code_url: string, live_url: string, image_url: string, image_alt: string, date: Date, description: string }> = [];
  pageIndex: number = 0;
  total_pages: number = 1;

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

  constructor(){
    let start_at: number = 0;
    for(let i: number = start_at; i < this.project_items.length; i++){
      if(i%2 === 0 && i%3 === 0 && i !== start_at){
        this.total_pages++;
        this.array_all.push({page: this.array_page});
        this.array_page = [];
        this.array_page.push({
          id: this.project_items[i].id,
          name: this.project_items[i].name,
          code_url: this.project_items[i].code_url,
          live_url: this.project_items[i].live_url,
          image_url: this.project_items[i].image_url,
          image_alt: this.project_items[i].image_alt,
          date: this.project_items[i].date,
          description: this.project_items[i].description
        });
        start_at = i;
      }
      else{
        this.array_page.push({
          id: this.project_items[i].id,
          name: this.project_items[i].name,
          code_url: this.project_items[i].code_url,
          live_url: this.project_items[i].live_url,
          image_url: this.project_items[i].image_url,
          image_alt: this.project_items[i].image_alt,
          date: this.project_items[i].date,
          description: this.project_items[i].description
        });
        if(i === this.project_items.length - 1){
          this.array_all.push({page: this.array_page});
          this.array_page = [];
        }
      }
    }

  }


  // TEMPORAL FAKE DATABASE

  project_items: Array<{ id: number, name: string, code_url: string, live_url: string, image_url: string, image_alt: string, date: Date, description: string }> = [
    {
      id: 1,
      name: 'Test',
      code_url: 'https://github.com/asd',
      live_url: 'https://liveproject.com',
      image_url: 'https://i.imgur.com/JV66wJT.jpeg',
      image_alt: 'Some project example',
      date: new Date(),
      description: 'This is a fake project. And it should be treated like that.'
    },
    {
      id: 2,
      name: 'Test',
      code_url: 'https://github.com/asd',
      live_url: 'https://liveproject.com',
      image_url: 'https://i.imgur.com/JV66wJT.jpeg',
      image_alt: 'Some project example',
      date: new Date(),
      description: 'This is a fake project. And it should be treated like that.'
    },
    {
      id: 3,
      name: 'Test',
      code_url: 'https://github.com/asd',
      live_url: 'https://liveproject.com',
      image_url: 'https://i.imgur.com/JV66wJT.jpeg',
      image_alt: 'Some project example',
      date: new Date(),
      description: 'This is a fake project. And it should be treated like that.'
    },
    {
      id: 4,
      name: 'Test',
      code_url: 'https://github.com/asd',
      live_url: 'https://liveproject.com',
      image_url: 'https://i.imgur.com/JV66wJT.jpeg',
      image_alt: 'Some project example',
      date: new Date(),
      description: 'This is a fake project. And it should be treated like that.'
    },
    {
      id: 5,
      name: 'Test',
      code_url: 'https://github.com/asd',
      live_url: 'https://liveproject.com',
      image_url: 'https://i.imgur.com/JV66wJT.jpeg',
      image_alt: 'Some project example',
      date: new Date(),
      description: 'This is a fake project. And it should be treated like that.'
    },
    {
      id: 6,
      name: 'Test',
      code_url: 'https://github.com/asd',
      live_url: 'https://liveproject.com',
      image_url: 'https://i.imgur.com/JV66wJT.jpeg',
      image_alt: 'Some project example',
      date: new Date(),
      description: 'This is a fake project. And it should be treated like that.'
    },
    {
      id: 7,
      name: 'Test',
      code_url: 'https://github.com/asd',
      live_url: 'https://liveproject.com',
      image_url: 'https://i.imgur.com/JV66wJT.jpeg',
      image_alt: 'Some project example',
      date: new Date(),
      description: 'This is a fake project. And it should be treated like that.'
    },
    {
      id: 8,
      name: 'Test',
      code_url: 'https://github.com/asd',
      live_url: 'https://liveproject.com',
      image_url: 'https://i.imgur.com/JV66wJT.jpeg',
      image_alt: 'Some project example',
      date: new Date(),
      description: 'This is a fake project. And it should be treated like that.'
    }
  ]
}