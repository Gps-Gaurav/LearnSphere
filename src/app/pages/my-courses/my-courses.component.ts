import { Component, inject, OnInit } from '@angular/core';
import { IApiResponse, IEnrollment, User } from '../../model/master.model';
import { MasterService } from '../../services/master.service';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-my-courses',
  standalone: true,
  imports: [SlicePipe],
  templateUrl: './my-courses.component.html',
  styleUrl: './my-courses.component.css',
})
export class MyCoursesComponent implements OnInit {
  loggedUserData: User = new User();
  masterSrv = inject(MasterService);
  courseList: IEnrollment[] = [];

  ngOnInit(): void {
    const localData = localStorage.getItem('learningUser');
    if (localData != null) {
      const parseData = JSON.parse(localData);
      this.loggedUserData = parseData;
    }
    this.getEnrollmentByUserId();
  }
  getEnrollmentByUserId() {
    this.masterSrv
      .getEnrollmentByUserId(this.loggedUserData.userId)
      .subscribe((res: IApiResponse) => {
        this.courseList = res.data;
      });
  }
}
