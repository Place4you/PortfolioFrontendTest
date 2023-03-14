import { Component } from '@angular/core';
import { ContactService } from '../rest/contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {

  constructor(private contactService: ContactService) { }
  
  social_items: Array<{id: number, name: string, link: string, image_uri: string, image_alt: string }> = []



  ngOnInit(){
    this.contactService.getItems()
    .subscribe((response: any) => {
      for(let i: number = 0; i < response.body.length; i++){
        if(response.body[i]){
          this.social_items.push(response.body[i]);
        }
      }
    });
  }
}