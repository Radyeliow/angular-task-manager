import { Component , inject,OnInit, signal,computed } from '@angular/core';
import { taskItem, TaskServices } from '../../services/task-services';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-task-list',
  styleUrl: './task-list.scss',
  templateUrl: './task-list.html',
})
export class TaskList {

  taskservices = inject(TaskServices);

  taskList: taskItem[] = [];



    filter = signal<'all' | 'completed' | 'active'>('all');

    filtertasks = computed(
      () =>{
        switch(this.filter()){
          case 'all':
            return this.taskservices.tasks();
          case 'completed':
            return this.taskservices.completedtasks();
          case 'active':
            return this.taskservices.activetasks();
        }
      }
    )

    getTask(filter:'all' | 'completed' | 'active'){
      this.filter.set(filter);
    }

    deleteTask(id:number){
      this.taskservices.deleteTask(id);
    }

    ngOnInit(): void {
    this.taskList = this.taskservices.tasks();}


    progressPercentage = computed(() => {
      const allTasks = this.taskservices.tasks();
      const total = allTasks.length;

      if(total === 0) return 0;

      const completedCount = allTasks.filter(tasks=>tasks.completed);

      return Math.round((completedCount.length/total)*100)
    })

     

  }

