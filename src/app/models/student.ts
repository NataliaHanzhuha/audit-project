import { StudentType } from "./student-type.enum";
import { Teacher } from "./teacher";

export interface Student {
    id: string;
    name: string;
    teachers: string[];
}

export class RouteDTO {
    constructor(
        public teacherId: string | null = null,
        public studentId: string | null = null,
        public startDate: Date | null = null,
        public type: StudentType | null = null,
        public payed: number = 0,
        public classNumber: number =  1,
    ) {}
}

export class RouteFilter {
    constructor(
        public teacherId?: string | null,
        public studentId?: string | null) {}
}

export interface Routes {
    teacherId: Teacher | undefined,
    studentId: any,
    startDate: Date,
    type: StudentType,
    payed: number,
    classNumber: number,
    studentName?: string,
    __v?: any;
    _id?: any;
}