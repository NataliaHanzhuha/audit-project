import { Pipe, PipeTransform } from '@angular/core';
import { Student } from 'src/app/models/student';

@Pipe({name: 'studentsFilter'})

export class StudentFilterPipe implements PipeTransform {
    transform(value: string, array: Student[]): string | undefined {
        if (!value) {
            return '';
        }
        console.log(value, array, array.find((student: Student) => student!.id === value)?.name);
        
        return array.find((student: Student) => student!.id === value)?.name;
    }
}