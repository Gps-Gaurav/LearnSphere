import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MasterService } from '../../services/master.service';
import { IApiResponse, Icourse, IcourseVideos } from '../../model/master.model';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SlicePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit  {

  masterSrv = inject(MasterService);
  courseList = signal<Icourse[]>([]);
  courseVideos : IcourseVideos[] = [];
  @ViewChild('courseModel') modal : ElementRef | undefined;

ngOnInit(): void {
this.loadCourses();
}
openModel(courseId: number){
  if(this.modal){
    this.modal.nativeElement.style.display = 'block';

  }

  }
closeModel(courseId: number){
  if(this.modal){
    this.modal.nativeElement.style.display = 'none';

  }

  }
loadCourses(){
  this.masterSrv.getAllCourse().subscribe((res:IApiResponse) => {
    this.courseList.set(res.data);
  },error =>{
    console.log(error);
  });
}
getCourseVideos(courseId: number){
  this.masterSrv.getCourseVideosbyCourseId(courseId).subscribe((res:IApiResponse) => {
    this.courseList = res.data;
  },error =>{
    console.log(error);
  });
}

}
