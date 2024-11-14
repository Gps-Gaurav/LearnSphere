import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { IApiResponse, Login, User } from './model/master.model';
import { FormsModule } from '@angular/forms';
import { MasterService } from './services/master.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule,RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  ngOnInit(): void {
    const localData = localStorage.getItem('learningUser');
    if(localData != null){
    const parseData = JSON.parse(localData);
    this.loggedUserData= parseData;
    }
  }
  title = 'E-Learning';
  isLoginFormVisible :boolean = true;

  userRegisterObj : User = new User();
  userLoginObj : Login = new Login();

  masterSrv = inject(MasterService)

  loggedUserData : User = new User();

  toggleForm(val:boolean){
    this.isLoginFormVisible = val;
  }

  onlogOut(){
    this.loggedUserData = new User();
    localStorage.removeItem('learningUser')
  }
  openModal(){
    const modal = document.getElementById('myModal');
    if(modal){
      modal.style.display = 'block';
    }
  }
  closeModal(){
    const modal = document.getElementById('myModal');
    if(modal){
      modal.style.display = 'none';
    }
  }
  onRegister(){
 this.masterSrv.addNewUser(this.userRegisterObj).subscribe((res:IApiResponse)=>{
   if(res.result){
     alert(res.message);
     this.closeModal();
   }else{
     alert(res.message);
   }
 })
  }
  onlogin(){
 this.masterSrv.onLogin(this.userLoginObj).subscribe((res:IApiResponse)=>{
   if(res.result){
     alert(res.message);
     localStorage.setItem("learningUser", JSON.stringify(res.data))
     this.loggedUserData = res.data;
     this.closeModal();
   }else{
     alert(res.message);
   }
 })
  }
}
