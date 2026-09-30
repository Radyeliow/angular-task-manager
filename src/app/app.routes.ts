import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path : "",
    loadComponent : () => import('../app/pages/task-list/task-list').then(c => c.TaskList)
  }

  ,

  {
    path : "add-task" ,
    loadComponent : () => import('../app/pages/task-form/task-form').then(c => c.TaskForm)
  }

  ,

  {
    path : "task/:id" ,
    loadComponent : () => import('../app/pages/task-details/task-details').then(c => c.TaskDetails)
  }

  ,

  {
    path : "**",
    redirectTo : ""
  }
];
