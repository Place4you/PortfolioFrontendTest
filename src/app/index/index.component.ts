import { Component } from '@angular/core';
import { InformationService } from '../rest/information.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent {

  constructor(private informationService: InformationService) { }

  titles_array:   string[] = ["Doctor", "Medic", "Asd", "Player"];
  current_title:  string = "Nothing";
  curr_title_i:   number = 0;


  update_title(el: any){
    const resize_ob = new ResizeObserver((entries) => {
      if(entries !== null){
        if(entries[0].contentRect.width === 0){
          for(this.curr_title_i; this.curr_title_i < this.titles_array.length;){
            this.current_title = this.titles_array[this.curr_title_i];
            console.log(this.curr_title_i); // correct output
            console.log(this.current_title); // correct output
            this.curr_title_i++;
            if(this.curr_title_i >= this.titles_array.length){
              this.curr_title_i = 0;
            }
            $scope.$apply(); // Cannot find name '$scope'
            this.current_title.$apply(); // Property '$apply' does not exist on type 'string'
            break;
          }
        }
      }
    });

    resize_ob.observe(el);
  }

  ngOnInit(){
    this.informationService.getInformationTable()
    .subscribe((response: any) => {
      for(let i: number = 0; i < response.body.length; i++){
        if(response.body[i].name === "index_titles" && response.body[i].information){
          this.titles_array.push(response.body[i].information);
          i = response.body.length;
        }
      }
    });
    
    const elemTitleBox = document.querySelector("#home_title_box");
    if(elemTitleBox !== null){
      this.update_title(elemTitleBox);
    }
  }
}