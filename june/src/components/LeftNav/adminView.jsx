/**
 * 
 * AdminView component.
 * 
 * This component is used to display the following menu when the view is admin.
 * 
 */
export const admContent = [
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
  },
  {
    id: 9,
    icon: "picture-o",
    label: "Gallery",
    to: "/home/gallery"
  },
  {
    id: 10,
    icon: "users",
    label: "Users",
    to: "/home/users"
  },
  {
    id: 11,
    icon: "server",
    label: "Translations",
    to: "/home/translations"
  }
];

export const admContentCollapsed = [
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
  },
  {
    id: 9,
    icon: "picture-o",
    to: "/home/gallery"
  },
  {
    id: 10,
    icon: "users",
    to: "/home/users"
  }
  ,
  {
    id: 11,
    icon: "server",
    to: "/home/translations"
  }
];

export const admMobileContent = [
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
    to: "/home/responses-report"
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
  },
  {
    id: 10,
    parentId: 1,
    icon: "picture-o",
    label: "Gallery",
    to: "/home/gallery"
  },
  {
    id: 11,
    icon: "users",
    label: "Users",
    to: "/home/users"
  }
];

export default {
  admContent,
  admContentCollapsed,
  admMobileContent
}