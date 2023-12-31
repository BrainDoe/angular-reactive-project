import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import { Lesson } from "../model/lesson";

@Component({
  selector: "lesson",
  templateUrl: "./lesson.component.html",
  styleUrls: ["./lesson.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonComponent {
  @Input() lesson: Lesson;
}
