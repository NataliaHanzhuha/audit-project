import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        redirectTo: '/audit',
        pathMatch: 'full',
      },
      {
        path: 'audit',
        loadChildren: () => import('../../pages/audit/audit.module')
            .then((m) => m.AuditModule),
      },
      {
        path: 'teacher',
        loadChildren: () => import('../../pages/teacher-dashboard/teacher-dashboard.module')
          .then((m) => m.TeacherDashboardModule),
      },
      {
        path: 'student',
        loadChildren: () => import('../../pages/student-dashboard/student-dashboard.module')
          .then((m) => m.StudentDashboardModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
