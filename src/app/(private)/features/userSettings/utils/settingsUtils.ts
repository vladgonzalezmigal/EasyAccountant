import GearIcon from '@/app/(private)/components/svgs/GearIcon';
import SalesIcon from '@/app/(private)/components/svgs/SalesIcon';
import ExpensesIcon from '@/app/(private)/components/svgs/ExpensesIcon';
import PayrollIcon from '@/app/(private)/components/svgs/PayrollIcon';
import MailIcon from '@/app/(private)/components/svgs/MailIcon';
import VendorSection from '../components/expenses/VendorSection';
import StoreSection from '../components/stores/StoreSelection';

export const sections = [
    {
      id: 'expenses',
      title: 'Expenses',
      icon: ExpensesIcon,
      description: 'Configure your expense categories, approval workflows, and reporting preferences.',
      content: VendorSection
    },
    {
      id: 'payroll',
      title: 'Payroll',
      icon: PayrollIcon,
      description: 'Manage payroll schedules, tax settings, and employee payment methods.', 
      // content: VendorSection
    },
    {
      id: 'sales',
      title: 'Sales',
      icon: SalesIcon,
      description: 'Customize your sales pipeline, product catalog, and customer management options.',
      content: StoreSection
    },
    {
      id: 'email',
      title: 'Email',
      icon: MailIcon,
      description: 'Set up email notifications, templates, and communication preferences.',
      content: VendorSection
    },
    {
      id: 'account',
      title: 'Account',
      icon: GearIcon,
      description: 'Manage your account details, security settings, and user permissions.'
    }
  ];