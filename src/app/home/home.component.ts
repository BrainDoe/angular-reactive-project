import { CoursesService } from './../services/courses.service';
import {Component, OnInit} from '@angular/core';
import {Course, sortCoursesBySeqNo} from '../model/course';
import {Observable, of, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import { LoadingService } from '../services/loading.service';
import { MessagesService } from '../messages/messages.service';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>;

  advancedCourses$: Observable<Course[]>;


  constructor(
    private coursesService: CoursesService, 
    private dialog: MatDialog,
    private loadingService: LoadingService,
    private messageService: MessagesService) {}

  ngOnInit() {
    this.reloadCourses()
  }
  
  reloadCourses() {
    // this.loadingService.loadingOn();

    const courses$ = this.coursesService.loadCourses().pipe(
      map(courses => courses.sort(sortCoursesBySeqNo)),
      catchError((error) => {
        const message = "Could not load courses";
        this.messageService.showError(message);
        console.log(message, error);
        return throwError(error)
      })

      // finalize operator is called when an observable completes or errors.
      //! We now want to implement a different method for calling the loader from the service.
      // finalize(() => this.loadingService.loadingOff())
      )

      const loadCourses$ = this.loadingService.showLoaderUntilCompleted(courses$);
  
      this.beginnerCourses$ = loadCourses$.pipe(
        map(courses => courses.filter(course => course.category == "BEGINNER")),
      )
  
      this.advancedCourses$ = loadCourses$.pipe(
        map(courses => courses.filter(course => course.category == "ADVANCED"))
      )
  }

  

}




