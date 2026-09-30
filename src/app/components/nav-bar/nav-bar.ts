import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  imports: [RouterLink ,RouterLinkActive],
  selector: 'app-nav-bar',
  styleUrl: './nav-bar.scss',
  templateUrl: './nav-bar.html',
})
export class NavBar {}
