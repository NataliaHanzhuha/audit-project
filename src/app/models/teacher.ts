import { StudentType } from "./student-type.enum";

export interface Teacher {
    id: string;
    name: string;
    students: string[];
    _id?: any;
    __v?: any;
}

export interface Filter {
    selectedTeacher: string | null;
    selectedMonth: number[];
    selectedPayType: number | null;
    selectedStudentType: number | null;
    selectedStudent: string | null;
}

export interface AuditTeacher {
    id: string;
    name: string;
    students: AuditStudent[];
    isEmpty?: boolean;
}

export interface AuditStudent {
    studentId: any,
    startDate: Date,
    type: StudentType,
    payed: number,
    classNumber: number,
    studentName?: string,
    id: string;
    payArray?: any[];
}