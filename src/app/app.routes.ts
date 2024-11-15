import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CourseDetailsComponent } from './pages/course-details/course-details.component';
import { MyCoursesComponent } from './pages/my-courses/my-courses.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: "home",
    component: HomeComponent
  },
  {
    path:"course-details/:id",
    component: CourseDetailsComponent
  },
  {
    path: "my-courses",
    component : MyCoursesComponent
  }
];
