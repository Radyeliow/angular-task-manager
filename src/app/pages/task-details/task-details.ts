import { Component, inject,signal,computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { taskItem, TaskServices } from '../../services/task-services';
import { DatePipe } from '@angular/common';

@Component({
  imports: [DatePipe,RouterLink],
  selector: 'app-task-details',
  styleUrl: './task-details.scss',
  templateUrl: './task-details.html',
})
export class TaskDetails {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  taskId =  signal<number|null>(null);
  private taskservices = inject(TaskServices);

  selectedTask :taskItem | undefined ;
  task = computed(
    () => {
      const Id = this.taskId();
      if(!Id)return undefined;
      return this.taskservices.tasks().find(task => task.id === Id)
    }
  )

  deletTask(){
    const id =this.taskId();
    if(id !== null) {
    this.taskservices.deleteTask(id);
    this.router.navigate(['/']);
  }
  }

  toggleSave(){
    const id = this.taskId();
    if(id !== null){
      this.taskservices.toggleTaskStatus(id);
    }
  }

  ngOnInit(): void {
    const taskid = Number(this.route.snapshot.paramMap.get('id'));
     if(taskid)
     {
      this.taskId.set(taskid);
     }

  }

}
