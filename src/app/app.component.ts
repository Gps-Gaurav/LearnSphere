import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IApiResponse, Login, User } from './model/master.model';
import { FormsModule } from '@angular/forms';
import { MasterService } from './services/master.service';
import { json } from 'stream/consumers';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'E-Learning';
  isLoginFormVisible :boolean = true;

  userRegisterObj : User = new User();
  userLoginObj : Login = new Login();

  masterSrv = inject(MasterService)
  toggleForm(val:boolean){
    this.isLoginFormVisible = val;
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
     this.closeModal();
   }else{
     alert(res.message);
   }
 })
  }
}
