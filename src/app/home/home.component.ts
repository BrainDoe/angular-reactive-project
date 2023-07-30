import { CoursesService } from "./../services/courses.service";
import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { Observable, of, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { LoadingService } from "../services/loading.service";
import { MessagesService } from "../messages/messages.service";
import { CourseStoreService } from "../services/courses-store.service";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  beginnerCourses$: Observable<Course[]>;

  advancedCourses$: Observable<Course[]>;

  constructor(
    private coursesService: CoursesService,
    private dialog: MatDialog,
    private loadingService: LoadingService,
    private messageService: MessagesService,
    private courseStoreService: CourseStoreService
  ) {}

  ngOnInit() {
    this.reloadCourses();
  }

  reloadCourses() {
    // A new implementation for managing data using the course store service. Now a stateful implementation.
    this.beginnerCourses$ =
      this.courseStoreService.filterByCategory("BEGINNER");

    this.advancedCourses$ =
      this.courseStoreService.filterByCategory("ADVANCED");

    // A stateless implementation. No longer needed now
    // const courses$ = this.coursesService.loadCourses().pipe(
    //   map(courses => courses.sort(sortCoursesBySeqNo)),
    //   catchError((error) => {
    //     const message = "Could not load courses";
    //     this.messageService.showError(message);
    //     console.log(message, error);
    //     return throwError(error)
    //   })

    // finalize operator is called when an observable completes or errors.
    //! We now want to implement a different method for calling the loader from the service.
    // finalize(() => this.loadingService.loadingOff())

    // )

    // const loadCourses$ = this.loadingService.showLoaderUntilCompleted(courses$);

    // this.beginnerCourses$ = loadCourses$.pipe(
    //   map(courses => courses.filter(course => course.category == "BEGINNER")),
    // )

    // this.advancedCourses$ = loadCourses$.pipe(
    //   map(courses => courses.filter(course => course.category == "ADVANCED"))
    // )
  }
}
