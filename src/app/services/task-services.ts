import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface taskItem {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TaskServices {

  private http = inject(HttpClient);
  private apiUrl = 'https://jsonplaceholder.typicode.com/todos';

  // يبدأ السجنال فارغاً تماماً وينتظر تحديد مصدر البيانات الأصح
  private taskList = signal<taskItem[]>([]);

constructor() {
   // 👈 جلب البيانات فوراً عند إنشاء الخدمة
   const savedData = localStorage.getItem('saveTasks');
    if (savedData) {
      const parsedTasks: taskItem[] = JSON.parse(savedData);
      if (parsedTasks && parsedTasks.length > 0) {
        this.taskList.set(parsedTasks);
         // نعم عثرنا على بيانات مخزنة ومعدلة
      }
    }
}

  // دالة قراءة مستقلة ونظيفة
/*
private readFromLocalStorage(): boolean {
    const savedData = localStorage.getItem('saveTasks');
    if (savedData) {
      const parsedTasks: taskItem[] = JSON.parse(savedData);
      if (parsedTasks && parsedTasks.length > 0) {
        this.taskList.set(parsedTasks);
        return true; // نعم عثرنا على بيانات مخزنة ومعدلة
      }
    }
    return false; // الذاكرة فارغة تماماً
  }
*/

  // دالة الـ GET جلب البيانات من الإنترنت
  loadTasksFromServer() {
    // 👈 التحقق الصارم: لو نجحت القراءة المحلية ووجدنا بيانات معدلة، اقفل بوابات الإنترنت فوراً لمنع الارتداد!


    // إذا كانت هذه أول مرة يفتح فيها المستخدم الموقع والذاكرة فارغة، اذهب واجلب الـ 5 كروت
    this.http.get<taskItem[]>(`${this.apiUrl}?_limit=5`).subscribe({
      next: (data) => {
        const readyTasks = data.map(task => ({
          id: task.id,
          title: task.title,
          description: 'هذه المهمة تم سحبها حية وديناميكياً عبر شبكة الإنترنت من سيرفر خارجي! 🌐',
          completed: task.completed,
          createdAt: new Date()
        }));
        this.taskList.set(readyTasks);
        this.saveTasksLocal();     // حفظهم فوراً في المتصفح ليكونوا خط الدفاع القادم
      },
      error: (err) => console.error('❌ خطأ شبكة خارجي في الـ GET:', err)
    });
     // حفظهم فوراً في المتصفح ليكونوا خط الدفاع القادم
  }

  // دالة الـ POST لإرسال مهمة جديدة أونلاين
  createNewTaskOnServer(title: string, description: string) {
    const rawPayload = {
      title: title,
      completed: false,
      userId: 1
    };

    this.http.post<taskItem>(this.apiUrl, rawPayload).subscribe({
      next: (savedResponse) => {
        console.log('✨ تم حفظ المهمة على السيرفر أونلاين بنجاح:', savedResponse);

        const validatedTask: taskItem = {
          id:  Date.now(),
          title: savedResponse.title,
          description: description, // قراءة النص المحلي للاستمارة لملء الكارت
          completed: savedResponse.completed,
          createdAt: new Date()
        };

        // إدراج الكارت الجديد في أول اللوحة وتحديث الذاكرة
        this.taskList.update(tasks => [...tasks,validatedTask]);
         this.saveTasksLocal();
      },
      error: (err) => console.error('❌ فشل إرسال وحفظ المهمة عبر الـ POST:', err)
    });
    // حفظهم فوراً في المتصفح ليكونوا خط الدفاع القادم
  }

  completedtasks = computed(() => this.taskList().filter(task => task.completed));
  activetasks = computed(() => this.taskList().filter(task => !task.completed));

  // دالة الحذف المحدثة
  deleteTask(id: number) {
    this.taskList.update(tasks => tasks.filter(task => task.id != id));
    this.saveTasksLocal(); // تحديث المتصفح فوراً ليمسح العنصر من الذاكرة
  }

  // دالة تبديل الحالة المحدثة
  toggleTaskStatus(id: number) {
    this.taskList.update(tasks =>
      tasks.map(task => task.id == id ? { ...task, completed: !task.completed } : task)
    );
    this.saveTasksLocal(); // تحديث المتصفح فوراً لحفظ الشطب واللون الأخضر
  }

  private saveTasksLocal() {
    localStorage.setItem('saveTasks', JSON.stringify(this.taskList()));
  }

  tasks = this.taskList.asReadonly();

}
