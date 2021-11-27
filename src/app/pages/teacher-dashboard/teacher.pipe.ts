import { Pipe, PipeTransform } from '@angular/core';
import { Teacher } from 'src/app/models/teacher';

@Pipe({
    name: 'teacherFilter'
})

export class TeacherPipe implements PipeTransform {
    transform(value: Teacher[] = [], selected: string): Teacher[] {
        return selected
                ? [value.find((item: Teacher) => item.id === selected)!]
                : value;
    }
}