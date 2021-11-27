import { Pipe, PipeTransform } from '@angular/core';
import { AuditStudent, AuditTeacher, Filter } from 'src/app/models/teacher';
import { RouteService } from 'src/app/services/route.service';

@Pipe({
  name: 'studentFilter',
  pure: false
})
export class StudentFilterPipe implements PipeTransform {
  readonly payByMonth = this.routeService.getItemCount();

  constructor(private routeService: RouteService) {}

  transform(teacher: AuditTeacher, filter: Filter, currentMonth: number): AuditStudent[] | [] {

    if (filter.selectedStudent !== null) {
      const student = teacher.students.find((student: AuditStudent) => student.studentId === filter.selectedStudent);

      return !!student ? [student] : [];
    }

    const filtered = teacher.students
    .sort((a: AuditStudent, b: AuditStudent) => a!.payArray![currentMonth] - b!.payArray![currentMonth])
      .sort((a: AuditStudent, b: AuditStudent) => a.type - b.type)
      .filter((item: AuditStudent) => {
        return filter?.selectedPayType === null 
                ? true 
                : !filter?.selectedPayType 
                  ? !item.type && (item.payArray && item.payArray![currentMonth] < this.payByMonth) // debt
                  : !item.type && (item.payArray && item.payArray![currentMonth] === this.payByMonth) // payed
      })
      .filter((item: AuditStudent) => {
        return filter?.selectedStudentType === null
                ? true
                : filter?.selectedStudentType === item.type;
      });

      return filtered
  }
}
