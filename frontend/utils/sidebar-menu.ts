export const sidebarMenu = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "dashboard",
    path: "/dashboard",
  },
  {
    id: "employee",
    label: "Employee",
    icon: "user",
    children: [
      {
        id: "employee-database",
        label: "Employee Database",
        path: "/employee/database",
      },
      {
        id: "add-employee",
        label: "Add New Employee",
        path: "/employee/add",
      },
      {
        id: "performance-report",
        label: "Performance Report",
        path: "/employee/performance-report",
      },
      {
        id: "performance-history",
        label: "Performance History",
        path: "/employee/performance-history",
      },
    ],
  },
  {
    id: "payroll",
    label: "Payroll",
    icon: "box",
    path: "/payroll",
  },
  {
    id: "pay-slip",
    label: "Pay Slip",
    icon: "share",
    path: "/pay-slip",
  },
  {
    id: "attendance",
    label: "Attendance",
    icon: "users",
    path: "/attendance",
  },
  {
    id: "request-center",
    label: "Request Center",
    icon: "calendar",
    path: "/request-center",
  },
  {
    id: "career-database",
    label: "Career Database",
    icon: "users",
    children: [
      {
        id: "job-postings",
        label: "Job Postings",
        path: "/career-database/job-postings",
      },
      {
        id: "candidates",
        label: "Candidates",
        path: "/career-database/candidates",
      },
      {
        id: "applications",
        label: "Applications",
        path: "/career-database/applications",
      },
      {
        id: "interviews",
        label: "Interviews",
        path: "/career-database/interviews",
      },
      {
        id: "offer-letters",
        label: "Offer Letters",
        path: "/career-database/offer-letters",
      },
    ],
  },
  {
    id: "document-manager",
    label: "Document Manager",
    icon: "file",
    path: "/documents",
  },
  {
    id: "notice-board",
    label: "Notice Board",
    icon: "file-text",
    path: "/notice-board",
  },
  {
    id: "activity-log",
    label: "Activity Log",
    icon: "list",
    path: "/activity-log",
  },
  {
    id: "exit-interview",
    label: "Exit Interview",
    icon: "file",
    path: "/exit-interview",
  },
  {
    id: "profile",
    label: "Profile",
    icon: "user",
    path: "/profile",
  },
];
