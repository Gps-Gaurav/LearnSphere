import { Component, inject, OnInit } from '@angular/core';
import { IApiResponse, IEnrollment, User } from '../../model/master.model';
import { MasterService } from '../../services/master.service';
import { SlicePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-courses',
  standalone: true,
  imports: [SlicePipe, RouterLink],
  templateUrl: './my-courses.component.html',
  styleUrl: './my-courses.component.css',
})
export class MyCoursesComponent implements OnInit {
  loggedUserData: User = new User();
  masterSrv = inject(MasterService);
  courseList: IEnrollment[] = [];

  router = inject(Router);
  activatedRoute = inject(ActivatedRoute)
  courseId:number = 0;

  constructor(){
    this.activatedRoute.params.subscribe((res:any)=>{
      this.courseId = res.id;

    })
  }
  ngOnInit(): void {
    const localData = localStorage.getItem('learningUser');
    if (localData != null) {
      const parseData = JSON.parse(localData);
      this.loggedUserData = parseData;
    }
    this.getEnrollmentByUserId();
  }

  startLearning(id: number) {
    this.router.navigate(['course-details', id]);
  }
  getEnrollmentByUserId() {
    this.masterSrv
      .getEnrollmentByUserId(this.loggedUserData.userId)
      .subscribe((res: IApiResponse) => {
        this.courseList = res.data;
      });
  }


}
