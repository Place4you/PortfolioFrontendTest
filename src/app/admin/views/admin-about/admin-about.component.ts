import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router'
import { CookieService } from 'ngx-cookie-service';
import { AboutService } from '../../../rest/about.service';
import { InformationService } from '../../../rest/information.service';

@Component({
  selector: 'app-admin-about',
  templateUrl: './admin-about.component.html',
  styleUrls: ['./admin-about.component.scss']
})
export class AdminAboutComponent implements AfterViewInit {

  constructor(private router: Router, private cookieService: CookieService, private aboutService: AboutService, private informationService: InformationService) { }

  error_message_add: string | undefined = undefined;
  error_message_edit: string | undefined = undefined;
  error_message_delete: string | undefined = undefined;
  error_message_journey: string | undefined = undefined;
  current_value: string = "add";
  found_item_id: boolean = false;
  item_to_edit: any = {};
  journey_info: string | undefined = undefined;
  journey_info_id: number = 0;

  reset_default_values(): void {
    this.error_message_add    = undefined;
    this.error_message_edit   = undefined;
    this.error_message_delete = undefined;
    this.current_value        = "add";
    this.found_item_id        = false;
  }

  edit_journey(text: string): void {
    if(!text){
      this.error_message_journey = "Field <journey> can't be null";
    }
    else {
      if(text !== this.journey_info){
        if(!this.cookieService.get('JWT')){
          this.router.navigate(['login']);
        }
        else{
          const cookieValue: string = this.cookieService.get('JWT');
          this.informationService.editInformationTable(cookieValue, this.journey_info_id, "journey", text)
          .subscribe((response: any): void  => {
            if(response === "0"){
              this.router.navigate(['login']);
            }
            else {
              this.router.navigate(['home']);
              this.error_message_journey = undefined;
            }
          });
        }
      }
      else{
        this.error_message_journey = "Information not edited";
      }
    }
  }


  method_change(event: any): void {
    const value = event.target.value;
    if(value !== this.current_value){
      if(value === "add"){
        this.reset_default_values();
        this.current_value = "add";
      }
      else if(value === "edit"){
        this.reset_default_values();
        this.current_value = "edit";
      }
      else if(value === "delete"){
        this.reset_default_values();
        this.current_value = "delete";
      }
      else if(value === "journey"){
        this.reset_default_values();
        this.current_value = "journey";
      }
    }
  }

  create_item(
    input_type: string,
    name: string,
    date: string,
    description: string,
    uri: string,
    image_uri: string,
    image_alt: string
  ): void {
    const type = Number(input_type) || 0;
    if(type === 0){
      this.error_message_add = "Invalid item type";
    }
    else if(type < 1){
      this.error_message_add = "Item type must be greater than 0";
    }
    else if(type > 3){
      this.error_message_add = "Item type must be lesser than 4";
    }
    else if(!name){
      this.error_message_add = "Field <name> can't be null";
    }
    else if(!date){
      this.error_message_add = "Field <date> can't be null";
    }
    else if(!description){
      this.error_message_add = "Field <description> can't be null";
    }

    else {
      if(!this.cookieService.get('JWT')){
        this.router.navigate(['login']);
      }
      else{
        const cookieValue: string = this.cookieService.get('JWT');
        this.aboutService.createItem(cookieValue, type, name, date, description, uri, image_uri, image_alt)
        .subscribe((response: any): void  => {
          if(response === "0"){
            this.router.navigate(['login']);
          }
          else {
            this.router.navigate(['home']);
            this.error_message_add = undefined;
          }
        });
      }
    }
  }

  search_edit_item(inputId: string): void {
    const itemId = Number(inputId) || 0;
    if(itemId === 0){
      this.error_message_edit = "Invalid item id";
    }
    else if(itemId < 1){
      this.error_message_edit = "The item id must be greater than 0";
    }
    else if(itemId > 65535){
      this.error_message_edit = "The item id must be lesser than 65536";
    }
    else {
      this.aboutService.getItem(itemId)
      .subscribe((response: any): void  => {
        if(response === "0"){
          this.router.navigate(['login']);
        }
        else {
          this.error_message_edit = "";
          this.found_item_id = true;
          this.item_to_edit = {
            id: response.body.id,
            type: response.body.item_type,
            name: response.body.name,
            date: response.body.date,
            description: response.body.description,
            uri: response.body.link,
            image_uri: response.body.image_uri,
            image_alt: response.body.image_alt
          }
        }
      });
    }
  }

  edit_item(
    name: string,
    date: string,
    description: string,
    uri: string,
    image_uri: string,
    image_alt: string
  ): void {
    if(!name){
      this.error_message_edit = "Field <name> can't be null";
    }
    else if(!date){
      this.error_message_edit = "Field <date> can't be null";
    }
    else if(!description){
      this.error_message_edit = "Field <description> can't be null";
    }
    else {
      if(this.item_to_edit.name){
        let something_changed: boolean = false;
        if(name !== this.item_to_edit.name){
          something_changed = true;
        }
        if(date !== this.item_to_edit.date){
          something_changed = true;
        }
        if(description !== this.item_to_edit.description){
          something_changed = true;
        }
        if(uri !== this.item_to_edit.uri){
          something_changed = true;
        }
        if(image_uri !== this.item_to_edit.image_uri){
          something_changed = true;
        }
        if(image_alt !== this.item_to_edit.image_alt){
          something_changed = true;
        }

        if(something_changed){
          if(!this.cookieService.get('JWT')){
            this.router.navigate(['login']);
          }
          else{
            const cookieValue: string = this.cookieService.get('JWT');
            this.aboutService.updateItem(cookieValue, this.item_to_edit.id, this.item_to_edit.type, name, date, description, uri, image_uri, image_alt)
            .subscribe((response: any): void  => {
              if(response === "0"){
                this.router.navigate(['login']);
              }
              else {
                this.router.navigate(['home']);
                this.error_message_edit = undefined;
              }
            });
          }
        }
        else {
          this.error_message_edit = "Item not edited";
        }
      }
      else {
        this.error_message_edit = "Item to update not found";
        this.found_item_id = false;
      }
    }
  }

  delete_item(inputId: string): void {
    const itemId = Number(inputId) || 0;
    if(itemId === 0){
      this.error_message_delete = "Invalid item id";
    }
    else if(itemId < 1){
      this.error_message_delete = "The item id must be greater than 0";
    }
    else if(itemId > 65535){
      this.error_message_delete = "The item id must be lesser than 65536";
    }
    else {
      if(!this.cookieService.get('JWT')){
        this.router.navigate(['login']);
      }
      else{
        const cookieValue: string = this.cookieService.get('JWT');
        this.aboutService.deleteItem(cookieValue, itemId)
        .subscribe((response: any): void  => {
          if(response === "0"){
            this.router.navigate(['login']);
          }
          else {
            this.router.navigate(['home']);
            this.error_message_delete = undefined;
          }
        });
      }
    }
  }

  ngOnInit(): void {
    this.informationService.getInformationTable()
    .subscribe((response: any): void  => {
      for(let i: number = 0; i < response.body.length; i++){
        if(response.body[i].name === "journey" && response.body[i].information){
          this.journey_info = response.body[i].information;
          this.journey_info_id = i + 1;
          i = response.body.length;
        }
      }
    });
  }

  ngAfterViewInit(): void {
    const date_input = document.getElementById("add_date") as HTMLInputElement;
    if(date_input !== null){
      date_input.max = new Date().toLocaleDateString('fr-ca');
      date_input.value = new Date().toLocaleDateString('fr-ca');
    }
  }

}