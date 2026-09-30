import { Injectable, signal,computed } from '@angular/core';



export interface taskItem{
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
}
@Injectable(
  {
    providedIn: 'root'
  }
)
export class TaskServices {
  private taskList=signal<taskItem[]>([
    {
      id: 1 ,
      title: 'تأسيس مشروع أنغولار النظيف',
      description: 'إنشاء مجلدات المشروع وضبط ملف المسارات app.routes.ts بالـ Lazy Loading.',
      completed: true,
      createdAt: new Date()
    },
    {
      id: 2,
      title: 'بناء المحرك المركزي للبيانات TaskService',
      description: 'كتابة دوال الإضافة والحذف وتعديل حالة المهمة باستخدام الـ Signals.',
      completed: true,
      createdAt: new Date()
    },
    {
      id: 3,
      title: 'تصميم واجهة عرض المهام TaskList',
      description: 'عمل تكرار لبطاقات المهام باستخدام الـ loop الحديث @for وتلوين الحدود حسب الحالة.',
      completed: false,
      createdAt: new Date()
    },
    {
      id: 4,
      title: 'برمجة استمارة الإضافة بـ Reactive Forms',
      description: 'ربط حقول الإدخال عبر الـ FormBuilder وإضافة شروط التحقق Validators لحماية المدخلات.',
      completed: false,
      createdAt: new Date()
    },
    {
      id: 5,
      title: 'إضافة ميزة الحفظ التلقائي في المتصفح LocalStorage',
      description: 'تطوير الخدمة لتقوم بحفظ واسترجاع المهام تلقائياً لمنع ضياع البيانات عند تحديث الصفحة.',
      completed: false,
      createdAt: new Date()
    },
    {
      id: 6,
      title: 'بناء صفحة تفاصيل المهمة الديناميكية',
      description: 'قراءة الـ id المتغير من الرابط باستخدام ActivatedRoute وعرض تفاصيل المهمة المستهدفة.',
      completed: false,
      createdAt: new Date()
    },
    {
      id: 7,
      title: 'مراجعة المشروع ورفعه على الـ Portfolio',
      description: 'تنظيف كود الأكواد البرمجية والتأكد من مطابقتها للـ Clean Code ورفع التطبيق على GitHub.',
      completed: false,
      createdAt: new Date()
    }
  ]);

  constructor(){
    const savedData = localStorage.getItem('saveTasks');
    if(savedData){
      const parsedTasks : taskItem[] = JSON.parse(savedData);
      this.taskList.set(parsedTasks);
    }
  }


  tasks=this.taskList.asReadonly();

  completedtasks = computed(
    () => this.taskList().filter((task)=>task.completed)
  )

  activetasks = computed(
    () => this.taskList().filter((task)=>!task.completed)
  )

  deleteTask(id:number){
    this.taskList.update((tasks)=>{
      return tasks.filter((task)=> task.id !== id);
    })

    this.saveTasksLocal();
  }


  addTask(title:string , description:string){
    const newTask:taskItem = {
      id:  Date.now(),
      title : title,
      description : description,
      completed : false,
      createdAt : new Date()
    }
    this.taskList.update((tasks)=>[...tasks,newTask])
    this.saveTasksLocal();
  }

  saveTasksLocal(){
    localStorage.setItem('saveTasks',JSON.stringify(this.taskList()));
  }

  toggleTaskStatus(id: number) {
    this.taskList.update((tasks) =>
      // نستخدم .map للمرور على كل المهام، وتعديل المهمة التي تطابق الـ id فقط
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );

    // 👈 استدعاء دالتك العبقرية لحفظ التعديل الجديد فوراً في ذاكرة المتصفح
    this.saveTasksLocal();
  }

}
