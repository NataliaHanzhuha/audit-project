import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TeacherFilterPipe } from "../modules/modal/add-student/teachers.pipe";
import { NgZorroModule } from "./ng-zorro.module";

@NgModule({
    declarations: [TeacherFilterPipe],
    imports: [
        NgZorroModule, 
        CommonModule, 
        FormsModule, 
        ReactiveFormsModule
    ],
    exports: [
        NgZorroModule, 
        CommonModule, 
        FormsModule, 
        ReactiveFormsModule, 
        TeacherFilterPipe
    ],
})
export class SharedModule { }
