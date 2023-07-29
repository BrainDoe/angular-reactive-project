import { BehaviorSubject, Observable, throwError } from "rxjs";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { Injectable } from "@angular/core";
import { catchError, map, shareReplay, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { LoadingService } from "./loading.service";
import { MessagesService } from "../messages/messages.service";

@Injectable({
  providedIn: "root",
})
export class CourseStoreService {
  private subject = new BehaviorSubject<Course[]>([]);
  courses$: Observable<Course[]> = this.subject.asObservable();

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private message: MessagesService
  ) {
    this.loadAllCourses();
  }
  private loadAllCourses() {
    const loadCourses$ = this.http.get<Course>(`/api/courses`).pipe(
      map((response) => response["payload"]),
      catchError((error) => {
        const message = "Could not load courses";
        this.message.showError(message);
        console.log(message, error);
        return throwError(error);
      }),
      tap((courses) => this.subject.next(courses))
    );

    this.loadingService.showLoaderUntilCompleted(loadCourses$).subscribe();
  }

  editCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    const courses = this.subject.getValue();
    const index = courses.findIndex((course) => course.id == courseId);

    const newCourse: Course = {
      ...courses[index],
      ...changes,
    };

    const newCourses: Course[] = courses.slice(0);

    newCourses[index] = newCourse;
    this.subject.next(newCourses);

    return this.http.put(`/api/courses/${courseId}`, changes).pipe(
      catchError((error) => {
        const message = "Could not update the course";
        this.message.showError(message);
        console.log(message, error);
        return throwError(error);
      }),
      shareReplay()
    );
  }

  filterByCategory(category: string): Observable<Course[]> {
    return this.courses$.pipe(
      map((courses) =>
        courses
          .filter((course) => course.category == category)
          .sort(sortCoursesBySeqNo)
      )
    );
  }
}
