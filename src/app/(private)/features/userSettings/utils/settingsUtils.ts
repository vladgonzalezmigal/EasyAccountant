import GearIcon from '@/app/(private)/components/svgs/GearIcon';
import SalesIcon from '@/app/(private)/components/svgs/SalesIcon';
import ExpensesIcon from '@/app/(private)/components/svgs/ExpensesIcon';
import PayrollIcon from '@/app/(private)/components/svgs/PayrollIcon';
import MailIcon from '@/app/(private)/components/svgs/MailIcon';

export const sections = [
    {
      id: 'expenses',
      title: 'Expenses',
      icon: ExpensesIcon,
      description: 'Configure your expense categories, approval workflows, and reporting preferences.'
    },
    {
      id: 'payroll',
      title: 'Payroll',
      icon: PayrollIcon,
      description: 'Manage payroll schedules, tax settings, and employee payment methods.'
    },
    {
      id: 'sales',
      title: 'Sales',
      icon: SalesIcon,
      description: 'Customize your sales pipeline, product catalog, and customer management options.'
    },
    {
      id: 'email',
      title: 'Email',
      icon: MailIcon,
      description: 'Set up email notifications, templates, and communication preferences.'
    },
    {
      id: 'account',
      title: 'Account',
      icon: GearIcon,
      description: 'Manage your account details, security settings, and user permissions.'
    }
  ];