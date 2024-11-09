import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  apiUrl :string = "https://projectapi.gerasim.in/api/Onlinelearning/";

  constructor(private http: HttpClient) { }

  getAllCourse(){
    return this.http.get(`${this.apiUrl}GetAllCourse`)
  }
}
