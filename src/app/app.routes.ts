// src/app/app.routes.ts (VERSION SIN GUARDS - REENFOQUE)

import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { TaskListComponent } from './components/task-list/task-list.component';
export const routes: Routes = [
    {
        path: 'auth',
        children: [
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
            { path: '', redirectTo: 'login', pathMatch: 'full' } 
        ]
    },
    {
        path: 'tasks',
        children: [
            { path: '', component: TaskListComponent },
            { path: 'new', component: TaskFormComponent },
            { path: 'edit/:id', component: TaskFormComponent },
            { path: '**', redirectTo: '', pathMatch: 'full' }
        ]
    },

    { 
        path: '', 
        redirectTo: 'auth/login',
        pathMatch: 'full' 
    },
    
    { 
        path: '**', 
        redirectTo: 'auth/login' //
    }
];