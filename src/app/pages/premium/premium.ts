import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { PaymentService, PremiumVerificationResponse } from '../../../core/services/payment.service';

type BillingCycle = 'monthly' | 'yearly';

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: { color: string };
  handler?: (response: Record<string, string>) => void;
}

interface RazorpayCheckout {
  open(): void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayCheckout;
  }
}

interface Plan {
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  accent: string;
  popular?: boolean;
}

@Component({
  selector: 'app-premium',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './premium.html',
  styleUrl: './premium.scss',
})
export class Premium {
  private paymentService = inject(PaymentService);
  billingCycle = signal<BillingCycle>('yearly');
  selectedPlan = signal('PairUp Pro');
  purchasingPlan = signal<string | null>(null);
  paymentError = signal('');
  isPremium = signal(false);
  isPremiumChecked = signal(false);
  showPlans = signal(false);
  membership = signal<PremiumVerificationResponse['membership']>(null);

  constructor() {
    void this.verifyPremiumUser();
  }

  async verifyPremiumUser() {
    try {
      const response = await firstValueFrom(this.paymentService.verifyPremiumUser());
      this.isPremium.set(response.isPremium);
      this.membership.set(
        response.membership ??
          (response.membershipType
            ? { type: response.membershipType, duration: response.duration ?? null }
            : null),
      );
      return response.isPremium;
    } catch {
      this.isPremium.set(false);
      return false;
    } finally {
      this.isPremiumChecked.set(true);
    }
  }

  async handlePaymentSuccess(response: Record<string, string>) {
    console.log('Payment completed:', response);
    await this.verifyPremiumUser();
    this.showPlans.set(false);
  }

  membershipDurationLabel() {
    const duration = this.membership()?.duration;
    return duration === 'yearly' ? 'Yearly' : duration === 'monthly' ? 'Monthly' : 'Not available';
  }

  readonly plans: Plan[] = [
    {
      name: 'PairUp Free',
      description: 'A simple way to start meeting your people.',
      monthlyPrice: 0,
      yearlyPrice: 0,
      accent: 'border-base-300',
      features: [
        'Create your developer profile',
        'Discover compatible people',
        'Send connection requests',
      ],
    },
    {
      name: 'PairUp Pro',
      description: 'More visibility, more conversations, more momentum.',
      monthlyPrice: 299,
      yearlyPrice: 239,
      accent: 'border-primary shadow-primary/20',
      popular: true,
      features: [
        'Unlimited connection requests',
        'See who viewed your profile',
        'Priority profile visibility',
        'Advanced matching insights',
      ],
    },
    {
      name: 'PairUp Elite',
      description: 'The complete toolkit for building a standout network.',
      monthlyPrice: 599,
      yearlyPrice: 479,
      accent: 'border-secondary',
      features: [
        'Everything in PairUp Pro',
        'Profile spotlight every month',
        'Personalized match recommendations',
        'Early access to new features',
      ],
    },
  ];

  setBillingCycle(cycle: BillingCycle) {
    this.billingCycle.set(cycle);
  }

  selectPlan(planName: string) {
    this.selectedPlan.set(planName);
    this.paymentError.set('');

    if (planName === 'PairUp Free') {
      return;
    }

    this.purchasingPlan.set(planName);
    this.paymentService
      .createOrder({
        membershipType: planName as 'PairUp Pro' | 'PairUp Elite',
        duration: this.billingCycle(),
      })
      .subscribe({
        next: (order) => {
          this.purchasingPlan.set(null);
          console.log('Payment order created:', order);

          const { amount, keyId, currency, notes, orderId } = order;

          const options: RazorpayOptions = {
            key: keyId,
            amount,
            currency,
            name: 'PairUp',
            description: `${order.notes.membershipType} - ${order.notes.duration}`,
            order_id: orderId,
            prefill: {
              name: notes.firstName,
              email: notes.emailId,
              contact: '9999912399'
            },
            theme: {
              color: '#F37254',
            },
            handler: (response) => {
              void this.handlePaymentSuccess(response);
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
        },
        error: (error) => {
          this.purchasingPlan.set(null);
          this.paymentError.set(error?.error?.msg || 'Unable to start checkout. Please try again.');
        },
      });
  }

  priceFor(plan: Plan) {
    return this.billingCycle() === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
  }
}
