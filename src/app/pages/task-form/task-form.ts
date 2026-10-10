import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskServices } from '../../services/task-services';
import { Router, RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroPlusCircle, heroXCircle, heroDocumentPlus, heroExclamationCircle } from '@ng-icons/heroicons/outline';

@Component({
  imports: [ReactiveFormsModule, RouterLink, NgIconComponent],
  selector: 'app-task-form',
  styleUrl: './task-form.scss',
  templateUrl: './task-form.html',
  providers: [provideIcons({ heroPlusCircle, heroXCircle, heroDocumentPlus, heroExclamationCircle })]
})
export class TaskForm {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskServices);
  private router = inject(Router);
  taskForm = this.fb.group(
    {
      title : ["",[Validators.required, Validators.minLength(3)]],
      description : ["",[Validators.required, Validators.minLength(10)]]
    }
  )

  onSubmit(){
    if(this.taskForm.valid){
      console.log("Form Submitted", this.taskForm.value);
      this.taskService.addTask(this.taskForm.value.title!, this.taskForm.value.description!);
      this.router.navigate(['/']);
    }
  }
}
