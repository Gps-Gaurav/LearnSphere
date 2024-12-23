import { Component, inject, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { IApiResponse, Login, User } from './model/master.model';
import { FormsModule } from '@angular/forms';
import { MasterService } from './services/master.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  // App Information
  private readonly APP_INFO = {
    currentDate: '2024-12-23 17:23:59',
    currentUser: 'Gps-Gaurav',
    version: '1.0.0'
  };

  private readonly STORAGE_KEY = 'learningUser';

  title = 'E-Learning';
  isLoginFormVisible: boolean = true;

  userRegisterObj: User = new User();
  userLoginObj: Login = new Login();

  masterSrv = inject(MasterService);
  loggedUserData: User = new User();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    if (isPlatformBrowser(this.platformId)) {
      const localData = this.getFromLocalStorage(this.STORAGE_KEY);
      if (localData) {
        this.loggedUserData = localData;
        this.logActivity('User Data Loaded', `UserId: ${this.loggedUserData.userId}`);
      }
    }
  }

  toggleForm(val: boolean): void {
    this.isLoginFormVisible = val;
    this.logActivity('Form Toggled', `Visible: ${val}`);
  }

  onlogOut(): void {
    this.loggedUserData = new User();
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.STORAGE_KEY);
      this.logActivity('User Logged Out', 'Session cleared');
    }
  }

  openModal(): void {
    if (isPlatformBrowser(this.platformId)) {
      const modal = document.getElementById('myModal');
      if (modal) {
        modal.style.display = 'block';
        this.logActivity('Modal Opened', 'Login/Register modal displayed');
      }
    }
  }

  closeModal(): void {
    if (isPlatformBrowser(this.platformId)) {
      const modal = document.getElementById('myModal');
      if (modal) {
        modal.style.display = 'none';
        this.logActivity('Modal Closed', 'Login/Register modal hidden');
      }
    }
  }

  onRegister(): void {
    this.logActivity('Registration Attempt', `User: ${this.userRegisterObj.userName}`);

    this.masterSrv.addNewUser(this.userRegisterObj).subscribe({
      next: (res: IApiResponse) => {
        if (res.result) {
          this.logActivity('Registration Success', res.message);
          alert(res.message);
          this.closeModal();
        } else {
          this.logActivity('Registration Failed', res.message);
          alert(res.message);
        }
      },
      error: (error) => {
        this.logActivity('Registration Error', error.message);
        alert('Registration failed: ' + error.message);
      }
    });
  }

  onlogin(): void {
    this.logActivity('Login Attempt', `User: ${this.userLoginObj.userName}`);

    this.masterSrv.onLogin(this.userLoginObj).subscribe({
      next: (res: IApiResponse) => {
        if (res.result) {
          this.logActivity('Login Success', res.message);
          alert(res.message);

          if (isPlatformBrowser(this.platformId)) {
            this.saveToLocalStorage(this.STORAGE_KEY, res.data);
          }

          this.loggedUserData = res.data;
          this.closeModal();
        } else {
          this.logActivity('Login Failed', res.message);
          alert(res.message);
        }
      },
      error: (error) => {
        this.logActivity('Login Error', error.message);
        alert('Login failed: ' + error.message);
      }
    });
  }

  private saveToLocalStorage(key: string, data: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      this.logActivity('Storage', `Data saved to ${key}`);
    } catch (error) {
      const errorMessage = (error as Error).message;
      this.logActivity('Storage Error', `Failed to save to ${key}: ${errorMessage}`);
    }
  }

  private getFromLocalStorage(key: string): any {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      const errorMessage = (error as Error).message;
      this.logActivity('Storage Error', `Failed to retrieve from ${key}: ${errorMessage}`);
      return null;
    }
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
