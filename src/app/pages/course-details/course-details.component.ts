import { Component, inject, OnInit, PLATFORM_ID, Inject } from '@angular/core';
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
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [],
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.css',
})
export class CourseDetailsComponent implements OnInit {
  // App Information
  private readonly APP_INFO = {
    currentDate: '2024-12-23 17:37:14',
    currentUser: 'Gps-Gaurav',
    version: '1.0.0'
  };

  private readonly STORAGE_KEY = 'learningUser';

  loggedUserData: User = new User();
  masterSrv = inject(MasterService);
  courseList: IEnrollment[] = [];
  videoList: IcourseVideos[] = [];
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  courseId: number = 0;
  currentVideoUrl: string = '';
  safeUrl: SafeResourceUrl | undefined;

  constructor(
    private sanitize: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.activatedRoute.params.subscribe((res: any) => {
      this.courseId = res.id;
      this.logActivity('Route Parameter', `CourseId: ${this.courseId}`);
      this.getVideos();
    });
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const localData = localStorage.getItem(this.STORAGE_KEY);
        if (localData) {
          this.loggedUserData = JSON.parse(localData);
          this.logActivity('User Data Loaded', `UserId: ${this.loggedUserData.userId}`);
        } else {
          this.logActivity('No User Data', 'Redirecting to login');
          this.router.navigate(['/']);
        }
      } catch (error: any) {
        this.logActivity('Error Loading User Data', error.message);
        this.router.navigate(['/']);
      }
    }
  }

  sanitizeUrl(url: string): SafeResourceUrl {
    const sanitizedUrl = this.sanitize.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed' + url);
    this.logActivity('URL Sanitized', `Original URL: ${url}`);
    return sanitizedUrl;
  }

  watchVideo(url: string): void {
    this.logActivity('Watch Video', `URL: ${url}`);
    this.safeUrl = this.sanitizeUrl(url);

    if (isPlatformBrowser(this.platformId)) {
      // Save last watched video to localStorage
      this.saveToLocalStorage(`${this.STORAGE_KEY}_lastVideo_${this.courseId}`, {
        url,
        timestamp: this.APP_INFO.currentDate,
        courseId: this.courseId
      });
    }
  }

  getVideos(): void {
    this.logActivity('Fetching Videos', `CourseId: ${this.courseId}`);

    this.masterSrv.getCourseVideosbyCourseId(this.courseId).subscribe({
      next: (res: IApiResponse) => {
        if (res.result) {
          this.videoList = res.data;
          this.logActivity('Videos Fetched', `Count: ${this.videoList.length}`);

          // Load last watched video if exists
          if (isPlatformBrowser(this.platformId)) {
            const lastWatched = this.getFromLocalStorage(`${this.STORAGE_KEY}_lastVideo_${this.courseId}`);
            if (lastWatched) {
              this.logActivity('Last Watched Video Found', `URL: ${lastWatched.url}`);
              this.watchVideo(lastWatched.url);
            }
          }
        } else {
          this.logActivity('No Videos Found', res.message);
        }
      },
      error: (error) => {
        this.logActivity('Error Fetching Videos', error.message);
      }
    });
  }

  private saveToLocalStorage(key: string, data: any): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(key, JSON.stringify(data));
        this.logActivity('Storage', `Data saved to ${key}`);
      } catch (error: any) {
        this.logActivity('Storage Error', `Failed to save to ${key}: ${error.message}`);
      }
    }
  }

  private getFromLocalStorage(key: string): any {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
      } catch (error: any) {
        this.logActivity('Storage Error', `Failed to retrieve from ${key}: ${error.message}`);
        return null;
      }
    }
    return null;
  }

  private logActivity(action: string, detail: string): void {
    console.log(`
[${action}]
Timestamp: ${this.APP_INFO.currentDate}
User: ${this.APP_INFO.currentUser}
Detail: ${detail}
CourseId: ${this.courseId}
    `);
  }
}
