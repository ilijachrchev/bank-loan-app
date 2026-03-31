import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  authService = inject(AuthService);

  features = [
    { icon: '⚡', title: 'Fast Approval', desc: 'Get loan decisions within 24 hours with our streamlined process.' },
    { icon: '🔒', title: 'Secure & Safe', desc: 'Bank-grade security with 256-bit encryption protecting your data.' },
    { icon: '📊', title: 'Easy Tracking', desc: 'Track your application status in real-time from your dashboard.' },
    { icon: '🤝', title: 'Expert Support', desc: 'Dedicated banking professionals available to guide you.' }
  ];

  steps = [
    { num: '1', title: 'Create Account', desc: 'Register as a customer and complete your profile in minutes.' },
    { num: '2', title: 'Apply Online', desc: 'Fill out our simple loan application form with your details.' },
    { num: '3', title: 'Get Approved', desc: 'Our team reviews and responds within 24 hours.' }
  ];

  stats = [
    { value: '10,000+', label: 'Happy Customers' },
    { value: '$500M+', label: 'Loans Approved' },
    { value: '24hr', label: 'Average Response' },
    { value: '99%', label: 'Satisfaction Rate' }
  ];
}
