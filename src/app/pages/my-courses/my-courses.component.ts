import { Component, inject, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { IApiResponse, IEnrollment, User } from '../../model/master.model';
import { MasterService } from '../../services/master.service';
import { SlicePipe, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-courses',
  standalone: true,
  imports: [SlicePipe, RouterLink],
  templateUrl: './my-courses.component.html',
  styleUrl: './my-courses.component.css',
})
export class MyCoursesComponent implements OnInit {
  // App Information
  private readonly APP_INFO = {
    currentDate: '2024-12-23 17:45:11',
    currentUser: 'Gps-Gaurav'
  };

  private readonly STORAGE_KEY = 'learningUser';

  loggedUserData: User = new User();
  masterSrv = inject(MasterService);
  courseList: IEnrollment[] = [];

  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  courseId: number = 0;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.logActivity('Component Initialization', 'Starting component setup');

    this.activatedRoute.params.subscribe({
      next: (res: any) => {
        this.courseId = res.id;
        this.logActivity('Route Parameters', `CourseId: ${this.courseId || 'undefined'}`);
      },
      error: (error) => {
        this.logActivity('Route Error', error.message);
      }
    });
  }

  ngOnInit(): void {
    const userDataLoaded = this.loadUserData();
    if (userDataLoaded) {
      this.getEnrollmentByUserId();
    } else {
      this.logActivity('Initialization Failed', 'User data not loaded');
      this.router.navigate(['/']);
    }
  }

  private loadUserData(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const localData = localStorage.getItem(this.STORAGE_KEY);
        if (localData) {
          this.loggedUserData = JSON.parse(localData);
          this.logActivity('User Data Loaded', `UserId: ${this.loggedUserData.userId}`);
          return true;
        } else {
          this.logActivity('Authentication Required', 'No user data found in storage');
          return false;
        }
      } catch (error: any) {
        this.logActivity('Storage Error', error.message);
        return false;
      }
    }
    return false;
  }

  startLearning(id: number): void {
    this.logActivity('Navigation', `Starting course: ${id}`);

    if (isPlatformBrowser(this.platformId)) {
      this.saveToLocalStorage(`${this.STORAGE_KEY}_lastAccessed`, {
        courseId: id,
        timestamp: this.APP_INFO.currentDate,
        userId: this.loggedUserData.userId
      });
    }

    this.router.navigate(['course-details', id]);
  }

  getEnrollmentByUserId(): void {
    if (!this.loggedUserData.userId) {
      this.logActivity('Error', 'No user ID found');
      this.router.navigate(['/']);
      return;
    }

    this.logActivity('API Request', `Fetching enrollments for user: ${this.loggedUserData.userId}`);

    this.masterSrv.getEnrollmentByUserId(this.loggedUserData.userId).subscribe({
      next: (res: IApiResponse) => {
        if (res.result) {
          this.courseList = res.data;
          this.logActivity('Data Received', `Found ${this.courseList.length} enrollments`);

          if (isPlatformBrowser(this.platformId)) {
            this.saveToLocalStorage(`${this.STORAGE_KEY}_enrollments`, {
              data: this.courseList,
              timestamp: this.APP_INFO.currentDate,
              userId: this.loggedUserData.userId
            });
          }
        } else {
          this.logActivity('API Response', `No enrollments found: ${res.message}`);
        }
      },
      error: (error) => {
        this.logActivity('API Error', error.message);
        // Attempt to load from cache if available
        if (isPlatformBrowser(this.platformId)) {
          const cachedData = this.getFromLocalStorage(`${this.STORAGE_KEY}_enrollments`);
          if (cachedData?.userId === this.loggedUserData.userId) {
            this.courseList = cachedData.data;
            this.logActivity('Cache Used', `Loaded ${this.courseList.length} enrollments from cache`);
          }
        }
      }
    });
  }

  private saveToLocalStorage(key: string, data: any): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(key, JSON.stringify(data));
        this.logActivity('Storage Update', `Saved data to ${key}`);
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
        this.logActivity('Storage Error', `Failed to retrieve ${key}: ${error.message}`);
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
    `);
  }
}
