import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SITE_MAP } from '@/constants';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Bell,
  Building,
  CalendarClock,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Database,
  DollarSign,
  FileText,
  FolderDot,
  FolderPlus,
  Home,
  Kanban,
  Lock,
  LogIn,
  LogOut,
  Menu,
  Network,
  PlusSquare,
  Server,
  Settings,
  Shield,
  TrendingUp,
  UserCircle,
  UserPlus,
  Users,
  Wallet
} from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import NotificationsDropdown from './notifications-dropdown';
import UserNav from './user-nav';

// Define types for our navigation items
type NavItemProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
};

type NavSectionProps = {
  title: string;
  items: NavItemProps[];
};

// Define all navigation sections and their items
const navigationSections: NavSectionProps[] = [
  {
    title: "Dashboard",
    items: [
      {
        href: SITE_MAP.DASHBOARD,
        icon: <Home className="h-4 w-4" />,
        label: "Home",
      },
      {
        href: SITE_MAP.ANALYTICS,
        icon: <BarChart3 className="h-4 w-4" />,
        label: "Analytics",
      },
      {
        href: SITE_MAP.NOTIFICATIONS,
        icon: <Bell className="h-4 w-4" />,
        label: "Notifications",
      },
    ],
  },
  {
    title: "Company Management",
    items: [
      {
        href: SITE_MAP.TENANTS,
        icon: <Building className="h-4 w-4" />,
        label: "Companies",
      },
      {
        href: SITE_MAP.TENANT_CREATE,
        icon: <PlusSquare className="h-4 w-4" />,
        label: "New Company",
      },
    ],
  },
  {
    title: "User Management",
    items: [
      {
        href: SITE_MAP.USERS,
        icon: <Users className="h-4 w-4" />,
        label: "Users",
      },
      {
        href: SITE_MAP.USER_CREATE,
        icon: <UserPlus className="h-4 w-4" />,
        label: "New User",
      },
      {
        href: SITE_MAP.ROLES,
        icon: <Shield className="h-4 w-4" />,
        label: "Roles",
      },
      {
        href: SITE_MAP.PERMISSIONS,
        icon: <Lock className="h-4 w-4" />,
        label: "Permissions",
      },
    ],
  },
  {
    title: "HR Management",
    items: [
      {
        href: SITE_MAP.EMPLOYEES,
        icon: <UserCircle className="h-4 w-4" />,
        label: "Employees",
      },
      {
        href: SITE_MAP.DEPARTMENTS,
        icon: <Network className="h-4 w-4" />,
        label: "Departments",
      },
    ],
  },
  {
    title: "Attendance & Salary",
    items: [
      {
        href: SITE_MAP.ATTENDANCE,
        icon: <CalendarClock className="h-4 w-4" />,
        label: "Attendance",
      },
      {
        href: SITE_MAP.ATTENDANCE_CHECK_IN,
        icon: <LogIn className="h-4 w-4" />,
        label: "Check In",
      },
      {
        href: SITE_MAP.ATTENDANCE_CHECK_OUT,
        icon: <LogOut className="h-4 w-4" />,
        label: "Check Out",
      },
      {
        href: SITE_MAP.SALARY,
        icon: <Wallet className="h-4 w-4" />,
        label: "Salary",
      },
    ],
  },
  {
    title: "Project Management",
    items: [
      {
        href: SITE_MAP.PROJECTS,
        icon: <FolderDot className="h-4 w-4" />,
        label: "Projects",
      },
      {
        href: SITE_MAP.PROJECT_CREATE,
        icon: <FolderPlus className="h-4 w-4" />,
        label: "New Project",
      },
      {
        href: SITE_MAP.TASKS,
        icon: <CheckSquare className="h-4 w-4" />,
        label: "Tasks",
      },
      {
        href: SITE_MAP.KANBAN_BOARD,
        icon: <Kanban className="h-4 w-4" />,
        label: "Kanban Board",
      },
    ],
  },
  {
    title: "Reports",
    items: [
      {
        href: SITE_MAP.REPORTS_ATTENDANCE,
        icon: <ClipboardList className="h-4 w-4" />,
        label: "Attendance Reports",
      },
      {
        href: SITE_MAP.REPORTS_SALARY,
        icon: <DollarSign className="h-4 w-4" />,
        label: "Salary Reports",
      },
      {
        href: SITE_MAP.REPORTS_PROFIT,
        icon: <TrendingUp className="h-4 w-4" />,
        label: "Profit Reports",
      },
    ],
  },
  {
    title: "System Admin",
    items: [
      {
        href: SITE_MAP.LOGS,
        icon: <FileText className="h-4 w-4" />,
        label: "System Logs",
      },
      {
        href: SITE_MAP.SETTINGS_CACHE,
        icon: <Database className="h-4 w-4" />,
        label: "Cache Settings",
      },
      {
        href: SITE_MAP.SETTINGS_DB,
        icon: <Server className="h-4 w-4" />,
        label: "Database",
      },
      {
        href: SITE_MAP.SETTINGS_SYSTEM,
        icon: <Settings className="h-4 w-4" />,
        label: "Settings",
      },
    ],
  },
];


const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className='flex h-screen overflow-hidden'>
      {/* Sidebar for larger screens */}
      <aside className={cn(
        'hidden overflow-y-auto border-r bg-gray-100/40 transition-all duration-300 ease-in-out lg:block',
        isSidebarCollapsed ? 'w-16' : 'w-64'
      )}>
        <SidebarContent isCollapsed={isSidebarCollapsed} />
      </aside>

      <div className='flex flex-1 flex-col overflow-hidden'>
        <header className='flex h-16 items-center justify-between border-b px-4 lg:px-6'>
          <div className='flex items-center gap-4'>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant='outline' size='icon' className='lg:hidden'>
                  <Menu className='h-4 w-4' />
                </Button>
              </SheetTrigger>
              <SheetContent side='left' className='w-64 p-0'>
                <SidebarContent isCollapsed={false} />
              </SheetContent>
            </Sheet>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden lg:flex"
            >
              {isSidebarCollapsed ? 
                <ChevronRight className="h-5 w-5" /> : 
                <ChevronLeft className="h-5 w-5" />
              }
            </Button>
            <h1 className='text-2xl font-bold'>Dashboard</h1>
          </div>
          <div className='flex items-center gap-4'>
            <form className='hidden md:block'>
              <Input type='search' placeholder='Search...' className='md:w-[100px] lg:w-[300px]' />
            </form>
            <NotificationsDropdown />
            <UserNav />
          </div>
        </header>

        <main className='flex-1 overflow-y-auto p-4 lg:p-6'>{children}</main>
      </div>
    </div>
  );
};

const SidebarContent = ({ isCollapsed = false }: { isCollapsed?: boolean }) => {
  return (
    <ScrollArea className="h-full py-6">
      <h2 className={cn(
        "mb-4 text-lg font-semibold tracking-tight",
        isCollapsed ? "text-center px-2" : "px-7"
      )}>
        {isCollapsed ? "AD" : "Admin Dashboard"}
      </h2>
      <div className="space-y-4">
        {navigationSections.map((section, index) => (
          <div key={`section-${index}`}>
            <h3 className={cn(
              "mb-2 text-sm font-semibold tracking-tight text-gray-500",
              isCollapsed ? "text-center text-[0.65rem] px-1 opacity-60" : "px-7"
            )}>
              {isCollapsed ? "•••" : section.title}
            </h3>
            <NavigationMenu orientation="vertical" className='w-full max-w-full'>
              <NavigationMenuList className="flex-col items-start space-y-1 w-full">
                {section.items.map((item, itemIndex) => (
                  <NavigationMenuItem className="w-full" key={`item-${index}-${itemIndex}`}>
                    <Link href={item.href} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "justify-start w-full",
                          isCollapsed && "flex items-center justify-center py-2 h-10 px-0"
                        )}
                        title={isCollapsed ? item.label : undefined}
                      >
                        <div className="flex items-center">
                          <div className={isCollapsed ? "h-5 w-5" : "mr-2 h-4 w-4"}>
                            {item.icon}
                          </div>
                          {!isCollapsed && <span>{item.label}</span>}
                        </div>
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default DashboardLayout;
