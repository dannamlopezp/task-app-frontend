export interface Task {
    id: number;
    title: string;
    description: string;
    dueDate: string; 
    priority: 'alta' | 'media' | 'baja'; 
    status: 'pendiente' | 'en_progreso' | 'completada'; 
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}