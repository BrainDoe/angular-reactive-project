import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Course } from "../model/course";
import { map, shareReplay } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class CoursesService {
  constructor(private http: HttpClient) {}

  loadCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`/api/courses`).pipe(
      map((courses) => courses["payload"]),
      shareReplay()
    );
  }

  editCourse(courseId: string, changes: Course): Observable<any> {
    return this.http
      .put<any>(`/api/courses/${courseId}`, changes)
      .pipe(shareReplay());
  }
}
