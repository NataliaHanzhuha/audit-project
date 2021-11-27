import { Pipe, PipeTransform } from '@angular/core';
import { Student } from 'src/app/models/student';

@Pipe({
    name: 'studentFilter'
})

export class StudentPipe implements PipeTransform {
    transform(value: Student[] = [], selected: string): Student[] {
        return selected
                ? [value.find((item: Student) => item.id === selected)!]
                : value;
    }
}