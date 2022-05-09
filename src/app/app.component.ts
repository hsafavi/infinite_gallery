import {
  AfterContentInit,
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { RandomSize } from './utilities/randomSize';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit, AfterContentInit {
  ngAfterContentInit(): void {
    setTimeout(() => {
      this.msnry.layout();
    }, 50);
    this.addImages(50, true);
    this.lazyload(300);
  }
  ngAfterViewInit(): void {
    document.addEventListener('scroll', () => this.lazyload());
  }
  ngOnInit(): void {
    let grid = document.querySelector('.grid');
    this.addImages(15, false);
    this.msnry = new Masonry(grid, {
      // options...

      itemSelector: '.grid-item',
    });
    this.msnry.on('layoutComplete', () => this.setMargin());
  }

  msnry: any;
  elmts: any[] = [];

  private timeout!: any;

  private setMargin() {
    const container = document.getElementById('holder');
    let itemWidth = 200;
    if (window.innerWidth < 600) {
      itemWidth = 150;
    }

    const cols = this.msnry.cols;
    if (cols > 1) {
      if (container) {
        container.style.marginLeft =
          (window.innerWidth - cols * itemWidth) / 2 + 'px';
      }
      this.msnry.off('layoutComplete');
    }
  }
  private lazyload(threshold: number = 100) {
    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      let scrollTop = window.scrollY;

      if (scrollTop > document.body.scrollHeight * 0.5) {
        this.addImages(100);
      }
      let lazyImages = document.querySelectorAll('[lazy]');

      lazyImages.forEach((lazyImage: any) => {
        var src = lazyImage.dataset.src;
        const top = lazyImage.parentElement.offsetTop;

        if (
          top < scrollTop + window.innerHeight + threshold &&
          top >= scrollTop - window.innerHeight - threshold
        ) {
          lazyImage.tagName.toLowerCase() === 'img'
            ? (lazyImage.src = src)
            : (lazyImage.style.backgroundImage = "url('" + src + "')");
          lazyImage.removeAttribute('lazy');
        }
      });
      if (lazyImages.length == 0) {
        document.removeEventListener('scroll', () => this.lazyload());
      }
    }, 10);
  }
  private addImages(count: number, lazy: boolean = true) {
    const holder = document.getElementById('holder');

    for (let i = 0; i < count; i++) {
      const size = new RandomSize();
      const random: number = Math.floor(Math.random() * 100000);
      const elm = document.createElement('div');
      if (lazy)
        elm.innerHTML = `<div class="grid-item grid-item${size.height}">
          <img lazy data-src="https://picsum.photos//${size.width}/${size.height}?random=${random}" alt=""></div>`;
      else
        elm.innerHTML = `<div class="grid-item grid-item${size.height}">
        <img src="https://picsum.photos//${size.width}/${size.height}?random=${random}" alt=""></div>`;
      holder?.append(elm);
      this.elmts.push(elm);
    }
    if (this.msnry) {
      this.msnry.appended(this.elmts);
    }
    this.elmts = [];
  }
}
