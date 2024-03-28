import { Component, OnInit } from '@angular/core';
import { fromEvent, map, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  public isSticky$: any
  constructor() { }

  ngOnInit(): void {
    this.isSticky$ = fromEvent(window, 'scroll').pipe(
      map((x) => window.scrollY),
      distinctUntilChanged(),
      map((scrollTop: number) => scrollTop > 24)
    );
    console.log('isSticky',this.isSticky$);
    
  }

}
