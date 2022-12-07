import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {

  // TEMPORAL FAKE DATABASE
  // max 6 items because of layout problems
  social_items: Array<{id: number, name: string, link: string, image_url: string, image_alt: string }> = [
    {
      id: 1,
      name: 'Linkedin',
      link: 'https://www.linkedin.com/in/lautaro-colella/',
      image_url: 'https://icones.pro/wp-content/uploads/2021/03/icone-linkedin-ronde-noire.png',
      image_alt: 'Linkedin image'
    },
    {
      id: 2,
      name: 'Github',
      link: 'https://github.com/LautaroColella',
      image_url: 'https://cdn-icons-png.flaticon.com/512/25/25231.png',
      image_alt: 'Github image'
    },
    {
      id: 3,
      name: 'Stackoverflow',
      link: 'https://stackoverflow.com/users/18895342/desahboy',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Stack_Overflow_icon.svg/768px-Stack_Overflow_icon.svg.png',
      image_alt: 'Stackoverflow image'
    },
    {
      id: 4,
      name: 'HackTheBox',
      link: 'https://www.hackthebox.com/home/users/profile/909077',
      image_url: 'https://i.imgur.com/Fzb3top.png',
      image_alt: 'HackTheBox image'
    },
    {
      id: 5,
      name: 'Whatsapp',
      link: 'https://api.whatsapp.com/send/?phone=5492236046462',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/WhatsApp_icon.png/640px-WhatsApp_icon.png',
      image_alt: 'Whatsapp image'
    }
  ]
}