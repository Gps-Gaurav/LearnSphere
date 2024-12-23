import {
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { MasterService } from '../../services/master.service';
import {
  IApiResponse,
  Icourse,
  IcourseVideos,
  IEnrollment,
  User,
} from '../../model/master.model';
import { SlicePipe, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { CarouselComponent } from '../carousel/carousel.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SlicePipe,FooterComponent,CarouselComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  // App Information
  private readonly APP_INFO = {
    currentDate: '2024-12-23 17:39:42',
    currentUser: 'Gps-Gaurav',
    environment: 'development'
  };

  private readonly STORAGE_KEY = 'learningUser';

  masterSrv = inject(MasterService);
  router = inject(Router);
  courseList = signal<Icourse[]>([]);
  courseVideos: IcourseVideos[] = [];
  @ViewChild('courseModel') modal: ElementRef | undefined;
  loggedUserData: User = new User();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadCourses();
  }

  private loadUserData(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const localData = localStorage.getItem(this.STORAGE_KEY);
        if (localData) {
          this.loggedUserData = JSON.parse(localData);
          this.logActivity('User Data Loaded', `UserId: ${this.loggedUserData.userId}`);
        }
      } catch (error: any) {
        this.logActivity('Error Loading User Data', error.message);
      }
    }
  }

  onEnroll(courseId: number): void {
    this.logActivity('Enrollment Attempt', `CourseId: ${courseId}`);

    if (this.loggedUserData.userId === 0) {
      this.logActivity('Enrollment Failed', 'User not logged in');
      alert('Please login first');
      return;
    }

    const enrollObj: IEnrollment = {
      courseId: courseId,
      enrolledDate: new Date(),
      enrollmentId: 0,
      userId: this.loggedUserData.userId,
      isCompleted: false,
      courseName: '',
      thumbnailUrl: '',
      courseDescription: '',
    };

    this.masterSrv.onEnrollment(enrollObj).subscribe({
      next: (res: IApiResponse) => {
        if (res.result) {
          this.logActivity('Enrollment Success', `CourseId: ${courseId}`);
          alert('Enrollment success');

          if (isPlatformBrowser(this.platformId)) {
            this.saveToLocalStorage(`${this.STORAGE_KEY}_enrollment_${courseId}`, {
              courseId,
              enrolledDate: this.APP_INFO.currentDate
            });
          }
        } else {
          this.logActivity('Enrollment Failed', res.message);
          alert(res.message);
        }
      },
      error: (error) => {
        this.logActivity('Enrollment Error', error.message);
        alert('Enrollment failed: ' + error.message);
      }
    });
  }

  openModel(courseId: number): void {
    if (this.modal) {
      this.modal.nativeElement.style.display = 'block';
      this.logActivity('Modal Opened', `CourseId: ${courseId}`);
    }
  }

  closeModel(courseId: number): void {
    if (this.modal) {
      this.modal.nativeElement.style.display = 'none';
      this.logActivity('Modal Closed', `CourseId: ${courseId}`);
    }
  }

  loadCourses(): void {
    this.logActivity('Loading Courses', 'Fetching all courses');

    this.masterSrv.getAllCourse().subscribe({
      next: (res: IApiResponse) => {
        if (res.result) {
          this.courseList.set(res.data);
          this.logActivity('Courses Loaded', `Count: ${res.data.length}`);
        } else {
          this.logActivity('No Courses Found', res.message);
        }
      },
      error: (error) => {
        this.logActivity('Error Loading Courses', error.message);
        console.error('Failed to load courses:', error);
      }
    });
  }

  getCourseVideos(courseId: number): void {
    this.logActivity('Loading Course Videos', `CourseId: ${courseId}`);

    this.masterSrv.getCourseVideosbyCourseId(courseId).subscribe({
      next: (res: IApiResponse) => {
        if (res.result) {
          this.courseVideos = res.data;
          this.logActivity('Videos Loaded', `CourseId: ${courseId}, Count: ${res.data.length}`);
        } else {
          this.logActivity('No Videos Found', `CourseId: ${courseId}`);
        }
      },
      error: (error) => {
        this.logActivity('Error Loading Videos', `CourseId: ${courseId}, Error: ${error.message}`);
        console.error('Failed to load course videos:', error);
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
    `);
  }
}
