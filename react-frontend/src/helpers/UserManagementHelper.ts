import {CompanyUser} from "../services/UserManagementService.ts";

export const STATUS_HELPER = [
    {
        label: "Active",
        color: "success.main",
        description: "User is fully active and can log in to the system."
    },
    {
        label: "Pending",
        color: "warning.main",
        description: "User has verified their email but is awaiting admin approval before they can log in."
    },
    {
        label: "Invited",
        color: "info.main",
        description: "User was invited by an admin or manager and has not yet accepted the invitation."
    },
    {
        label: "Rejected",
        color: "error.main",
        description: "User's registration or invitation was rejected by an admin or manager and cannot access the system."
    },
    {
        label: "Inactive",
        color: "grey.600",
        description: "User account has been deactivated by an admin or manager and cannot log in."
    },
    {
        label: "All",
        color: "text.primary",
        description: "Displays all users, regardless of their status."
    }
];

export const USER_STATUSES = [
    {label: "Active", value: "active"},
    {label: "Pending", value: "pending"},
    {label: "Invited", value: "invited"},
    {label: "Rejected", value: "rejected"},
    {label: "Inactive", value: "inactive"},
    {label: "All", value: "all"}
];

export const getStatusCounts = (users: { status: string }[]) => {
    return {
        pending: users.filter(u => u.status === "pending").length,
        invited: users.filter(u => u.status === "invited").length,
        rejected: users.filter(u => u.status === "rejected").length,
        active: users.filter(u => u.status === "active").length,
    };
};

export const filterUsersByStatus = (users: CompanyUser[], status: string, search: string, roleFilter: string) => {
    return users.filter(u => {
        // Status filter
        if (status !== "all" && u.status !== status) return false;
        // Search filter
        const searchLower = search.toLowerCase();
        if (
            searchLower &&
            !(
                u.name.toLowerCase().includes(searchLower) ||
                u.email.toLowerCase().includes(searchLower)
            )
        ) {
            return false;
        }
        // Role filter
        return !(roleFilter && u.role !== roleFilter);
    })
}