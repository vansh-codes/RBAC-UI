import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import usersData from '../utils/userData.json'

const ROWS_PER_PAGE = 5;

export default function UsersTable() {
    const [users, setUsers] = useState(usersData.usersData);
    const [selectedRole, setSelectedRole] = useState("All");
    const [editUser, setEditUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const filteredUsers = users.filter((user) =>
        selectedRole === "All"
            ? true
            : user.role.toLowerCase() === selectedRole.toLowerCase()
    ).filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * ROWS_PER_PAGE,
        currentPage * ROWS_PER_PAGE
    );

    const handleToggleState = (email) => {
        const updatedUsers = users.map((user) =>
            user.email === email ? { ...user, state: !user.state } : user
        );
        setUsers(updatedUsers);
        const toggledUser = updatedUsers.find((user) => user.email === email);
        toast.success(`${toggledUser.name} is now ${toggledUser.state ? "active" : "inactive"}`);
    };

    const handleDeleteUser = (email) => {
        const updatedUsers = users.filter((user) => user.email !== email);
        setUsers(updatedUsers);
        toast.success("User deleted successfully");
    };

    const handleEditUser = (user) => {
        setEditUser(user);
    };

    const handleUpdateUser = (updatedUser) => {
        const updatedUsers = users.map((user) =>
            user.email === updatedUser.email ? updatedUser : user
        );
        setUsers(updatedUsers);
        setEditUser(null);
        toast.success("User updated successfully");
    };

    const renderRoleTab = (role) => (
        <button
            className={`mr-4 py-1 px-3 rounded-full transition-all duration-300 ${selectedRole === role ? "bg-blue-500 text-white" : "text-blue-500 hover:bg-blue-100"
                }`}
            onClick={() => {
                setSelectedRole(role);
                setCurrentPage(1); // Reset pagination after role change
            }}
        >
            {role}
        </button>
    );

    return (
        <div className="overflow-hidden bg-white shadow-lg rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Administrators Accounts</h2>
                <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                    + Add New User
                </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
                Find all of your seller&apos;s administrator accounts and their associated roles.
            </p>
            <div className="mb-4 flex justify-between">
                <div>
                    {renderRoleTab("All")}
                    {renderRoleTab("Super Admin")}
                    {renderRoleTab("Manager")}
                    {renderRoleTab("Accountant")}
                </div>
                <input
                    type="text"
                    placeholder="Search by name or email"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border rounded px-3 py-2 w-64"
                />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full bg-white shadow-md rounded">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="py-2 px-4">Account</th>
                            <th className="py-2 px-4">Email</th>
                            <th className="py-2 px-4">Role</th>
                            <th className="py-2 px-4">Access</th>
                            <th className="py-2 px-4 text-center">Last Activity</th>
                            <th className="py-2 px-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="h-72 overflow-y-auto">
                        {paginatedUsers.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center py-4">
                                    No users found
                                </td>
                            </tr>
                        )}

                        {paginatedUsers.map((user) => (
                            <tr
                                key={user.email}
                                className="border-t text-sm hover:bg-gray-100 transition-all duration-300"
                            >
                                <td className="py-2 px-4 flex items-center space-x-4">
                                    <img
                                        src={user.image}
                                        alt={user.name}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div>{user.name}</div>
                                </td>
                                <td className="py-2 px-4">{user.email}</td>
                                <td className="py-2 px-4">{user.role}</td>
                                <td className="py-2 px-4">{user.access}</td>
                                <td className="py-2 px-4 text-center">
                                    <input
                                        type="checkbox"
                                        checked={user.state}
                                        onChange={() => handleToggleState(user.email)}
                                        className="w-5 h-5 accent-blue-500 rounded-full"
                                    />
                                </td>
                                <td className="py-2 px-4 text-center">
                                    <button
                                        className="mr-2"
                                        onClick={() => handleEditUser(user)}
                                    >
                                        <FaEdit className="text-blue-500 hover:text-blue-700" />
                                    </button>
                                    <button onClick={() => handleDeleteUser(user.email)}>
                                        <FaTrash className="text-red-500 hover:text-red-700" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <span>
                    Showing {Math.min((currentPage - 1) * ROWS_PER_PAGE + 1, filteredUsers.length)}-
                    {Math.min(currentPage * ROWS_PER_PAGE, filteredUsers.length)} of{" "}
                    {filteredUsers.length} results
                </span>
                <div className="space-x-2">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                        className="px-4 py-2 border rounded disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <button
                        disabled={currentPage * ROWS_PER_PAGE >= filteredUsers.length}
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        className="px-4 py-2 border rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
            {/* Edit User Modal */}
            {editUser && (
                <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center animate-fade-in">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h3 className="text-xl font-semibold mb-4">Edit User</h3>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleUpdateUser(editUser);
                            }}
                        >
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Name</label>
                                <input
                                    type="text"
                                    value={editUser.name}
                                    onChange={(e) =>
                                        setEditUser({ ...editUser, name: e.target.value })
                                    }
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Email</label>
                                <input
                                    type="email"
                                    value={editUser.email}
                                    onChange={(e) =>
                                        setEditUser({ ...editUser, email: e.target.value })
                                    }
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Role</label>
                                <select
                                    value={editUser.role}
                                    onChange={(e) =>
                                        setEditUser({ ...editUser, role: e.target.value })
                                    }
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                >
                                    <option value="Super Admin">Super Admin</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Accountant">Accountant</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setEditUser(null)}
                                    className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
