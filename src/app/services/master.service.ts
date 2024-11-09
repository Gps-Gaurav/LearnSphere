import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IApiResponse } from '../model/master.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  apiUrl :string = "https://projectapi.gerasim.in/api/OnlineLearning/";

  constructor(private http: HttpClient) { }

  getAllCourse(): Observable<IApiResponse>{
    return this.http.get<IApiResponse>(`${this.apiUrl}GetAllCourse`)
  }
  getCourseVideosbyCourseId(id: number): Observable<IApiResponse>{
    return this.http.get<IApiResponse>(`${this.apiUrl}GetCourseVideosbyCourseId?courseId=${id}`)
  }
}
