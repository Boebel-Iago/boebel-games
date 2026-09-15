import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
import { StudentLoginComponent } from './features/student-login/student-login.component';
import { PixelArtComponent } from './features/games/pixel-art/pixel-art.component';
import { ProfessionsComponent } from './features/games/professions/professions.component';
import { BrowserSearchComponent } from './features/games/browser-search/browser-search.component';
import { ticketGuard } from './core/guards/ticket.guard';
import { FactCheckerComponent } from './features/games/fact-checker/fact-checker.component';
import { CreatorsVsCopiersComponent } from './features/games/creators-vs-copiers/creators-vs-copiers.component';
import { EmergencyEscapeComponent } from './features/games/emergency-escape/emergency-escape.component';
import { LevelRepository, LocalLevelRepositoryService } from './features/games/emergency-escape/content/level-repository.service';
import { ProgressReporter } from './core/progress/progress-reporter';
import { ApiProgressReporterService } from './core/progress/api-progress-reporter.service';
import { SeaTurtlesComponent } from './features/games/sea-turtles/sea-turtles.component';
import { PhaseRepository, LocalPhaseRepositoryService } from './features/games/sea-turtles/content/phase-repository.service';
import { FreeGamesComponent } from './features/public/free-games/free-games.component';
import { BrowserSearchRepository } from './features/games/browser-search/content/browser-search-repository.service';
import { ProfessionsRepository } from './features/games/professions/content/professions-repository.service';
import { FactCheckerRepository } from './features/games/fact-checker/content/fact-checker-repository.service';
import { CreatorsVsCopiersRepository } from './features/games/creators-vs-copiers/content/creators-vs-copiers-repository.service';
import { PixelArtRepository } from './features/games/pixel-art/content/pixel-art-repository.service';

export const routes: Routes = [
    
    // ==========================================
    // JOGOS FREE (DEMONSTRAÇÃO / PÚBLICO)
    // Sem TicketGuard, Não salvam no Banco de Dados
    // ==========================================
    { 
        path: 'free', 
        component: FreeGamesComponent 
    },
    { 
        path: 'free/sea-turtles', 
        component: SeaTurtlesComponent,
        providers: [
            { provide: ProgressReporter, useClass: ApiProgressReporterService },
            { provide: PhaseRepository, useClass: LocalPhaseRepositoryService } 
        ]
    },
    { 
        path: 'free/emergency-escape', 
        component: EmergencyEscapeComponent,
        providers: [
            { provide: LevelRepository, useClass: LocalLevelRepositoryService },
            { provide: ProgressReporter, useClass: ApiProgressReporterService }
        ] 
    },

    // ==========================================
    // JOGOS PROTEGIDOS (COM INGRESSO E BANCO)
    // ==========================================
    { 
        path: 'games/sea-turtles', 
        component: SeaTurtlesComponent,
        canActivate: [ticketGuard],
        providers: [
            { provide: ProgressReporter, useClass: ApiProgressReporterService },
            { provide: PhaseRepository, useClass: LocalPhaseRepositoryService } 
        ]
    },
    { 
        path: 'games/emergency-escape', 
        component: EmergencyEscapeComponent,
        canActivate: [ticketGuard],
        providers: [
            { provide: LevelRepository, useClass: LocalLevelRepositoryService },
            { provide: ProgressReporter, useClass: ApiProgressReporterService }
        ] 
    },
    { 
        path: 'games/browser-search', 
        component: BrowserSearchComponent,
        canActivate: [ticketGuard],
        providers: [
            { provide: ProgressReporter, useClass: ApiProgressReporterService },
            BrowserSearchRepository
        ]
    },
    { 
        path: 'games/creators-vs-copiers', 
        component: CreatorsVsCopiersComponent,
        canActivate: [ticketGuard],
        providers: [
            { provide: ProgressReporter, useClass: ApiProgressReporterService },
            CreatorsVsCopiersRepository
        ]
    },
    { 
        path: 'games/fact-checker', 
        component: FactCheckerComponent,
        canActivate: [ticketGuard],
        providers: [
            { provide: ProgressReporter, useClass: ApiProgressReporterService },
            FactCheckerRepository
        ]
    },
    { 
        path: 'games/pixel-art', 
        component: PixelArtComponent,
        canActivate: [ticketGuard],
        providers: [
            { provide: ProgressReporter, useClass: ApiProgressReporterService },
            PixelArtRepository
        ]
    },
    { 
        path: 'games/professions', 
        component: ProfessionsComponent,
        canActivate: [ticketGuard],
        providers: [
            { provide: ProgressReporter, useClass: ApiProgressReporterService },
            ProfessionsRepository
        ]
    },
    { path: '', component: StudentLoginComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent},
    { path: 'admin/dashboard', component: DashboardComponent},
    ];
