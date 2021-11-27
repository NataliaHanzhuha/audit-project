import { Pipe, PipeTransform } from '@angular/core';
import { Teacher } from 'src/app/models/teacher';

@Pipe({name: 'teacherFilter'})

export class TeacherFilterPipe implements PipeTransform {
    transform(value: string, array: Teacher[]): string | undefined {
        if (!value) {
            return '';
        }

        return array.find((teacher: Teacher) => teacher.id === value)?.name;
    }
}