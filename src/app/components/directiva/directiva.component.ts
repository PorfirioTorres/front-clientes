import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-directiva',
  templateUrl: './directiva.component.html',
  styleUrls: ['./directiva.component.css']
})
export class DirectivaComponent implements OnInit {
  cursos: string[];
  mostrar: boolean;
  constructor() {
      this.cursos = ['Spring', 'Hibernate', 'Java SE', 'Java EE'];
      this.mostrar = true;
   }

  ngOnInit() {
  }
}
