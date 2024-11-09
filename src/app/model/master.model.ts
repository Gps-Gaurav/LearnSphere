export interface IApiResponse{
  message: string;
  result :boolean;
  data : any;
}
export class userlist{
  videoId: number;
  videoUrl: string;
  videoTitle: string;
  videoDescription: string;
  videoThumbnail: string;
  totalDuration: string;

  constructor(){
    this.videoId = 0;
    this.videoUrl = "";
    this.videoTitle = "";
    this.videoDescription = "";
    this.videoThumbnail = "";
    this.totalDuration = "";
  }
}
export interface Icourse{
  courseId: number,
  courseName: string,
  createdDate: string,
  totalHours: number,
  totalVideos: number,
  courseDescription : string,
  thumbnailUrl: string
}
export interface ICourseWithVideos{
  courseId: number,
  courseName: string,
  createdDate: string,
  totalHours: number,
  totalVideos: number,
  courseDescription : string,
  lmsCourseVideos:{
    courseVideoId: number,
    courseId: number,
    videoId :number,
  }
}
export interface IcourseVideos{
  courseVideoId: number,
  courseName: string,
  courseId: number,
  videoTitle: string,
  videoId :number,
  videoUrl: string,
}
