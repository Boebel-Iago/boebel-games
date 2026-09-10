import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
import { StudentLoginComponent } from './features/student-login/student-login.component';
import { PixelArtComponent } from './features/games/pixel-art/pixel-art.component';
import { ProfessionsComponent } from './features/games/professions/professions.component';
import { BrowserSearchComponent } from './features/games/browser-search/browser-search.component';
import { ticketGuard } from './core/guards/ticket.guard';
import { FactCheckerComponent } from './features/games/fact-checker/fact-checker.component';

export const routes: Routes = [
    
    { 
        path: 'games/fact-checker', 
        component: FactCheckerComponent,
        canActivate: [ticketGuard] 
    },
    { 
        path: 'games/pixel-art', 
        component: PixelArtComponent,
        canActivate: [ticketGuard] // Cadeado aplicado
    },
    { 
        path: 'games/professions', 
        component: ProfessionsComponent,
        canActivate: [ticketGuard] // Cadeado aplicado
    },
    { 
        path: 'games/browser-search', 
        component: BrowserSearchComponent,
        canActivate: [ticketGuard] // Cadeado aplicado
    },
    { path: '', component: StudentLoginComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent},
    { path: 'admin/dashboard', component: DashboardComponent},
    ];
