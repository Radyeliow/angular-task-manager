import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { taskItem, TaskServices } from '../../services/task-services';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  standalone: true,
  selector: 'app-task-list',
  styleUrl: './task-list.scss',
  templateUrl: './task-list.html',
})
export class TaskList implements OnInit {

  taskservices = inject(TaskServices);
  filter = signal<'all' | 'completed' | 'active'>('all');

  filtertasks = computed(() => {
    switch (this.filter()) {
      case 'all':
        return this.taskservices.tasks();
      case 'completed':
        return this.taskservices.completedtasks();
      case 'active':
        return this.taskservices.activetasks();
    }
  });

  getTask(filter: 'all' | 'completed' | 'active') {
    this.filter.set(filter);
  }

  deleteTask(id: number) {
    this.taskservices.deleteTask(id);
  }

  ngOnInit(): void {
    // 👈 تشغيل محرك جلب وتحديث البيانات المركزي فوراً عند فتح التطبيق
    this.taskservices.tasks();
  }

  progressPercentage = computed(() => {
    const allTasks = this.taskservices.tasks();
    const total = allTasks.length;
    if (total === 0) return 0;
    const completedCount = allTasks.filter(t => t.completed).length;
    return Math.round((completedCount / total) * 100);
  });
}
