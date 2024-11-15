import { Component, inject } from '@angular/core';
import {
  IApiResponse,
  IcourseVideos,
  ICourseWithVideos,
  IEnrollment,
  User,
} from '../../model/master.model';
import { MasterService } from '../../services/master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [],
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.css',
})
export class CourseDetailsComponent {
  loggedUserData: User = new User();
  masterSrv = inject(MasterService);
  courseList: IEnrollment[] = [];
  videoList: IcourseVideos[] = [];
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  courseId: number = 0;
  currentVideoUrl : string ='';
  safeUrl: SafeResourceUrl | undefined;

  constructor(private sanitize : DomSanitizer) {
    this.activatedRoute.params.subscribe((res: any) => {
      this.courseId = res.id;
      this.getVideos();
    });
  }
  sanitizeUrl(url:string): SafeResourceUrl{
    return this.sanitize.bypassSecurityTrustResourceUrl('https://www.yputibe.com/embed'+url);

  }
  watchVideo(url: string){
 this.safeUrl = this.sanitizeUrl(url);
  }
  ngOnInit(): void {
    const localData = localStorage.getItem('learningUser');
    if (localData != null) {
      const parseData = JSON.parse(localData);
      this.loggedUserData = parseData;
    }
  }
  getVideos() {
    this.masterSrv
      .getCourseVideosbyCourseId(this.courseId)
      .subscribe((res: IApiResponse) => {
        this.videoList = res.data;
      });
  }
}
