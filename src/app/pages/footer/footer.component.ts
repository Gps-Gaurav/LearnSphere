import { Component, OnInit } from '@angular/core';
import { User } from '../../model/master.model';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  currentYear: number = new Date().getFullYear(); // Initialize with an
  appInfo = {
    currentDate: new Date().toLocaleDateString(),
    currentUser: "Guest"
  };

  constructor() {}

  ngOnInit(): void {
  }

}
