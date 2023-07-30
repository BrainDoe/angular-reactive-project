import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Course } from "../model/course";
import { map, shareReplay, tap } from "rxjs/operators";
import { Lesson } from "../model/lesson";

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

  loadCourse(courseId: number): Observable<Course> {
    return this.http
      .get<Course>(`/api/courses/${courseId}`)
      .pipe(shareReplay());
  }

  loadAllCourseLessons(courseId: number): Observable<Lesson[]> {
    return this.http
      .get<Lesson[]>(`/api/lessons`, {
        params: {
          pageSize: "1000",
          courseId: courseId.toString(),
        },
      })
      .pipe(
        map((res) => res["payload"]),
        shareReplay()
      );
  }

  editCourse(courseId: string, changes: Course): Observable<any> {
    return this.http
      .put<any>(`/api/courses/${courseId}`, changes)
      .pipe(shareReplay());
  }

  searchLessons(search: string): Observable<Lesson[]> {
    return this.http
      .get<Lesson[]>(`/api/lessons`, {
        params: {
          filter: search,
          pageSize: "100",
        },
      })
      .pipe(
        map((res) => res["payload"]),
        shareReplay()
      );
  }
}
