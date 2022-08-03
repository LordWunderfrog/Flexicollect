/**
 * 
 * EmloyeeView component.
 * 
 * This component is used to display the following menu when the view is employee.
 * 
 */
export const empContent = [
  {
    id: 1,
    icon: "tachometer",
    label: "Dashboard",
    to: "/home/dashboard"
  },
  {
    id: 2,
    icon: "building",
    label: "Departments",
    to: "/home/departments"
  },
  {
    id: 3,
    icon: "user",
    label: "Clients",
    to: "/home/clients"
  },
  {
    id: 4,
    icon: "file-powerpoint-o",
    label: "Projects",
    to: "/home/projects"
  },
  {
    id: 5,
    icon: "users",
    label: "Consumers",
    to: "/home/consumers"
  },
  {
    id: 6,
    icon: "chart-line",
    label: "Responses and Reports",
    to: "/home/responses-report"
  },
  {
    id: 7,
    icon: "server",
    label: "Surveys",
    to: "/home/surveys"
  },
  {
    id: 8,
    icon: "edit",
    label: "Survey Builder",
    to: "/home/create-survey"
  }
];

export const empContentCollapsed = [
  {
    id: 1,
    icon: "tachometer",
    to: "/home/dashboard"
  },
  {
    id: 2,
    icon: "building",
    to: "/home/departments"
  },
  {
    id: 3,
    icon: "user",
    to: "/home/clients"
  },
  {
    id: 4,
    icon: "file-powerpoint-o",
    to: "/home/projects"
  },
  {
    id: 5,
    icon: "users",
    to: "/home/consumers"
  },
  {
    id: 6,
    icon: "chart-line",
    to: "/home/responses-report"
  },
  {
    id: 7,
    icon: "server",
    to: "/home/surveys"
  },
  {
    id: 8,
    icon: "edit",
    to: "/home/create-survey"
  }
];

export const empMobileContent = [
  {
    id: 1,
    icon: "bars",
    label: "Eolas"
  },
  {
    id: 2,
    parentId: 1,
    icon: "tachometer",
    label: "Dashboard",
    to: "/home/dashboard"
  },
  {
    id: 3,
    parentId: 1,
    icon: "building",
    label: "Departments",
    to: "/home/departments"
  },
  {
    id: 4,
    parentId: 1,
    icon: "user",
    label: "Clients",
    to: "/home/clients"
  },
  {
    id: 5,
    parentId: 1,
    icon: "file-powerpoint-o",
    label: "Projects",
    to: "/home/projects"
  },
  {
    id: 6,
    parentId: 1,
    icon: "users",
    label: "Consumers",
    to: "/home/consumers"
  },
  {
    id: 7,
    parentId: 1,
    icon: "chart-line",
    label: "Responses and Reports",
    to: "#a-link"
  },
  {
    id: 8,
    parentId: 1,
    icon: "server",
    label: "Surveys",
    to: "/home/surveys"
  },
  {
    id: 9,
    parentId: 1,
    icon: "edit",
    label: "Survey Builder",
    to: "/home/create-survey"
  }
];

export default { empContent, empContentCollapsed, empMobileContent };
