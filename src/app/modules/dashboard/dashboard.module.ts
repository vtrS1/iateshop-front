import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CookieService } from 'ngx-cookie-service';

import { SidebarModule } from 'primeng/sidebar';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { DashboardComponent } from './page/home/dashboard.component';
import { DASHBOARD_ROUTES } from './dashboard.routing';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(DASHBOARD_ROUTES),
    SharedModule,
    // PrimeNG
    SidebarModule,
    ChartModule,
    ButtonModule,
    ToolbarModule,
    CardModule,
    ToastModule,
  ],
  providers: [MessageService, CookieService],
})
export class DashboardModule {}
