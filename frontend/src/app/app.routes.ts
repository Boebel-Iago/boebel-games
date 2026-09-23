import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
import { StudentLoginComponent } from './features/student-login/student-login.component';
import { PixelArtComponent } from './features/games/pixel-art/pixel-art.component';
import { ProfessionsComponent } from './features/games/professions/professions.component';
import { BrowserSearchComponent } from './features/games/browser-search/browser-search.component';
import { ticketGuard } from './core/guards/ticket.guard';
import { adminGuard } from './core/guards/admin.guard';
import { FactCheckerComponent } from './features/games/fact-checker/fact-checker.component';
import { CreatorsVsCopiersComponent } from './features/games/creators-vs-copiers/creators-vs-copiers.component';
import { EmergencyEscapeComponent } from './features/games/emergency-escape/emergency-escape.component';
import { LevelRepository, LocalLevelRepositoryService } from './features/games/emergency-escape/content/level-repository.service';
import { ProgressReporter } from './features/games/emergency-escape/progress/progress-reporter.service';
import { ApiProgressReporterService } from './features/games/emergency-escape/progress/api-progress-reporter.service';
import { SeaTurtlesComponent } from './features/games/sea-turtles/sea-turtles.component';
import { PhaseRepository, LocalPhaseRepositoryService } from './features/games/sea-turtles/content/phase-repository.service';
import { FreeGamesComponent } from './features/public/free-games/free-games.component';
import { TextShapesComponent } from './features/games/text-and-shapes/text-shapes.component';
import { MiniPosterComponent } from './features/games/mini-poster/mini-poster.component';

// Repórter falso para bloquear 100% o contato com o servidor e BD nas rotas /free
class MockProgressReporter {
  report(data: any) {
    console.log('[Free Mode] Telemetria bloqueada. Nenhum dado enviado.', data);
  }
}

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
        path: 'free/text-and-shapes', 
        component: TextShapesComponent,
        providers: [
            { provide: ProgressReporter, useClass: MockProgressReporter }
        ]
    },
    { 
        path: 'free/mini-poster', 
        component: MiniPosterComponent,
        providers: [
            { provide: ProgressReporter, useClass: MockProgressReporter }
        ]
    },
    { 
        path: 'free/sea-turtles', 
        component: SeaTurtlesComponent,
        providers: [
            { provide: ProgressReporter, useClass: MockProgressReporter },
            { provide: PhaseRepository, useClass: LocalPhaseRepositoryService } 
        ]
    },
    { 
        path: 'free/emergency-escape', 
        component: EmergencyEscapeComponent,
        providers: [
            { provide: LevelRepository, useClass: LocalLevelRepositoryService },
            { provide: ProgressReporter, useClass: MockProgressReporter }
        ] 
    },

    // ==========================================
    // JOGOS PROTEGIDOS (COM INGRESSO E BANCO)
    // ==========================================
    { 
        path: 'games/text-and-shapes', 
        component: TextShapesComponent,
        canActivate: [ticketGuard],
        providers: [
            { provide: ProgressReporter, useClass: ApiProgressReporterService }
        ]
    },
    { 
        path: 'games/mini-poster', 
        component: MiniPosterComponent,
        canActivate: [ticketGuard],
        providers: [
            { provide: ProgressReporter, useClass: ApiProgressReporterService }
        ]
    },
    { 
        path: 'games/sea-turtles', 
        component: SeaTurtlesComponent,
        canActivate: [ticketGuard],
        providers: [
            // O serviço de telemetria que você já usa no outro jogo
            { provide: ProgressReporter, useClass: ApiProgressReporterService },
            
            // Supondo que você criou um LocalPhaseRepositoryService seguindo a mesma lógica do LevelRepository
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
        path: 'games/creators-vs-copiers', 
        component: CreatorsVsCopiersComponent,
        canActivate: [ticketGuard] 
    },
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
    { path: 'admin/dashboard', component: DashboardComponent, canActivate: [adminGuard]},
    ];
