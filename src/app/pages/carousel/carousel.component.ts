import { Component, ViewEncapsulation } from '@angular/core';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CarouselModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent {
  carouselOptions: OwlOptions = {
    loop: true,
    margin: 5,
    nav: true,
    dots: false,
    autoplay: true,
    autoplayTimeout: 2000,
    autoplayHoverPause: true,
    responsive: {
      0: { items: 1 },
      600: { items: 2 },
      1000: { items: 3 }
    },
    navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>']
  };

  // Carousel Data
  slides() {
    return [
      {
        url: 'https://picsum.photos/1920/600?random=21',
        title: 'Welcome to LearnSphere',
        description: 'Watch and learn efficiently'
      },
      {
        url: 'https://picsum.photos/1920/600?random=20',
        title: 'Learn Advanced JavaScript',
        description: 'Remember important topics for programming'
      },
      {
        url: 'https://picsum.photos/1920/600?random=13',
        title: 'Learn Machine Learning',
        description: 'machine learning algorithms and models'
      },
      {
        url: 'https://picsum.photos/1920/600?random=14',
        title: 'Learn Data Science',
        description: 'data science for deep analysis for large data sets'
      },
      {
        url: 'https://picsum.photos/1920/600?random=15',
        title: 'Learn Python',
        description: 'python programming is vast and diversified programming language'
      },
      {
        url: 'https://picsum.photos/1920/600?random=16',
        title: 'Learn Angular',
        description: 'angular is a powerful framework'
      }
    ];
  }
}
