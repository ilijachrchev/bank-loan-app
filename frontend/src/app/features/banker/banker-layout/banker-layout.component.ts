import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-banker-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './banker-layout.component.html',
  styles: [`
    :host { display: block; }

    .sidebar {
      background: linear-gradient(165deg, #0F172A 0%, #131e35 60%, #0c1828 100%);
      border-right: 1px solid rgba(255,255,255,0.05);
    }

    .nav-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #334155;
      padding: 0 14px;
      margin-bottom: 6px;
      margin-top: 20px;
      display: block;
    }

    .sidebar-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      border-radius: 10px;
      color: #64748b;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.15s;
      margin-bottom: 2px;

      mat-icon {
        font-size: 19px;
        width: 19px;
        height: 19px;
        flex-shrink: 0;
        transition: color 0.15s;
      }

      &:hover {
        background: rgba(255,255,255,0.05);
        color: #cbd5e1;
      }

      &.active {
        background: rgba(245,158,11,0.12);
        color: #F59E0B;

        mat-icon {
          color: #F59E0B;
        }
      }
    }

    .user-card {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: 12px;
      transition: background 0.15s;
      cursor: default;

      &:hover {
        background: rgba(255,255,255,0.04);
      }
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: linear-gradient(135deg, rgba(245,158,11,0.25), rgba(245,158,11,0.1));
      border: 1px solid rgba(245,158,11,0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      span {
        color: #F59E0B;
        font-weight: 700;
        font-size: 14px;
      }
    }

    .logout-btn {
      color: #334155 !important;
      transition: color 0.15s !important;

      &:hover {
        color: #ef4444 !important;
      }
    }
  `]
})
export class BankerLayoutComponent {
  private authService = inject(AuthService);

  get currentUser() {
    return this.authService.currentUser();
  }

  logout() {
    this.authService.logout();
  }
}
