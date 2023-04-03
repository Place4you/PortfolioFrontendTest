import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from '../rest/login.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  providers: [CookieService]
})
export class AdminComponent implements OnInit {

    constructor(private loginService: LoginService, private cookieService: CookieService, private router: Router){ }
    
    view_click(view: string){
        const elemView: any = document.getElementById(`app_${view}`);
        let arrow: any = {}
        if(elemView !== null){
            const elemViewP: any = elemView.parentElement;
            if(elemViewP !== null){
                const elemViewPC: any = elemViewP.firstChild;
                if(elemViewPC !== null){
                    const elemViewPCC: any = elemViewPC.firstChild;
                    if(elemViewPCC !== null){
                        arrow = elemViewPCC.childNodes;
                    }
                }
            }
            if(window.getComputedStyle(elemView, null).display === "none"){
                elemView.style.display = "block";
                arrow[1].style.display = "none";
                arrow[2].style.display = "block";
            }
            else{
                elemView.style.display = "none";
                arrow[1].style.display = "block";
                arrow[2].style.display = "none";
            }
        }
    }

    b_goto(gtPosition: string): void {
        const admElem: any       = document.getElementById("admin");
        const home_elem: any     = document.getElementById("app_home");
        const work_elem: any     = document.getElementById("app_work");
        const about_elem: any    = document.getElementById("app_about");
        const contact_elem: any  = document.getElementById("app_contact");
        if(admElem !== null){
            if(home_elem !== null && work_elem !== null && about_elem !== null && contact_elem !== null){
                if(gtPosition === "top" || gtPosition === "app_home"){
                    admElem.scrollTop = 0;
                    if(gtPosition === "top"){
                        home_elem.style.display = "none";
                        work_elem.style.display = "none";
                        about_elem.style.display = "none";
                        contact_elem.style.display = "none";

                        const arrowsUp: any     = document.getElementsByClassName("arrow_up");
                        const arrowsDown: any   = document.getElementsByClassName("arrow_down");
                        for(let i = 0; i < arrowsUp.length; i++){
                            arrowsUp[i].style.display = "none";
                        }
                        for(let i = 0; i < arrowsDown.length; i++){
                            arrowsDown[i].style.display = "block";
                        }
                    }
                }
                else{
                    const elemNav: any = document.getElementById(gtPosition);
                    if(elemNav !== null){
                        if(elemNav.offsetTop > 120){
                            admElem.scrollTop = elemNav.offsetTop - 120;
                        }
                        else{
                            if(gtPosition === "app_work"){
                                admElem.scrollTop = home_elem.clientHeight;
                            }
                            else if(gtPosition === "app_about"){
                                admElem.scrollTop = home_elem.clientHeight + work_elem.clientHeight;
                            }
                            else if(gtPosition === "app_contact"){
                                admElem.scrollTop = home_elem.clientHeight + work_elem.clientHeight + about_elem.clientHeight;
                            }
                        }
                    }
                }
            }
        }
    }
    
    b_logout(): void {
        this.cookieService.delete("JWT", "/");
        this.router.navigate(['home']);
    }

    ngOnInit(): void {
        if(!this.cookieService.get('JWT')){
            this.router.navigate(['login']);
        }
        else{
            const cookieValue: string = this.cookieService.get('JWT');
            this.loginService.check_token(cookieValue)
            .subscribe((response: any) => {
                if(response === "0"){
                    this.b_logout();
                }
            });
        }
    }
}