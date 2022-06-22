/**
 * 
 * ClientView component.
 * 
 * This component is used to display the following menu when the view is client.
 * 
 */
export const clnContent = [
    {
        id: 1,
        icon: "chart-line",
        label: "Responses and Reports",
        to: "/home/client-responses-report"
    },
]

export const clnContentCollapsed = [
    {
        id: 1,
        icon: "chart-line",
        to: "/home/client-responses-report"
    }
]

export const clnMobileContent = [
    {
        id: 1,
        icon: "bars",
        label: "Eolas"
    },
    {
        id: 2,
        parentId: 1,
        icon: "chart-line",
        label: "Responses and Reports",
        to: "/home/client-responses-report"
    }
]

export default {
    clnContent,
    clnContentCollapsed,
    clnMobileContent
};