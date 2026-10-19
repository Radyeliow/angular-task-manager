import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroTrash, heroCheckCircle, heroClock } from '@ng-icons/heroicons/outline';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { taskItem, TaskServices } from '../../services/task-services';
import { DatePipe } from '@angular/common';

@Component({
  imports: [ RouterLink, NgIconComponent, DatePipe ],
  standalone: true,
  selector: 'app-task-details',
  styleUrl: './task-details.scss',
  templateUrl: './task-details.html',
  providers: [provideIcons({ heroTrash, heroCheckCircle, heroClock })]
})
export class TaskDetails implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private taskservices = inject(TaskServices);

  taskId = signal<number | null>(null);

  task = computed(() => {
    const Id = this.taskId();
    if (Id === null) return undefined;
    // مقارنة مرنة == لضمان العثور على العنصر وتجنب مشاكل الـ String والـ Number
    return this.taskservices.tasks().find(t => t.id == Id);
  });

  deletTask() {
    const id = this.taskId();
    if (id !== null) {
      this.taskservices.deleteTask(id);
      this.router.navigate(['/']); // التوجيه السليم الفوري بعد الحذف
    }
  }

  toggleSave() {
    const id = this.taskId();
    if (id !== null) {
      this.taskservices.toggleTaskStatus(id);
    }
  }

  ngOnInit(): void {
    const taskid = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(taskid)) {
      this.taskId.set(taskid);
    }
  }
}
