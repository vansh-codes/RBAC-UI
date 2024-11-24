import { useState } from "react";
import toast from "react-hot-toast";

const roles = [
    {
        name: "Super Admin",
        count: 15,
        permissions: ["Threat Detection", "Network Security", "Access Control"],
        users: ["user1", "user2", "user3", "user4", "user5"],
    },
    {
        name: "Manager",
        count: 7,
        permissions: ["Threat Detection", "Incident Response"],
        users: ["user6", "user7", "user8", "user9"],
    },
    {
        name: "Accountant",
        count: 3,
        permissions: ["Data Protection"],
        users: ["user10", "user11", "user12"],
    },
];

const categories = [
    "Threat Detection",
    "Data Protection",
    "Network Security",
    "Incident Response",
    "Access Control",
    "Vulnerability Management",
];

export default function RolesCard() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [roleData, setRoleData] = useState(null);
    const [newRoleName, setNewRoleName] = useState("");
    const [permissions, setPermissions] = useState({});
    const [isEditable, setIsEditable] = useState(true);

    const handleModalClose = () => {
        setIsModalOpen(false);
        setRoleData(null);
        setPermissions({});
        setIsEditable(false);
    };

    const handleRoleClick = (role) => {
        setRoleData(role);
        setNewRoleName(role.name);
        setIsEditable(false);
        const updatedPermissions = {};
        categories.forEach((category) => {
            updatedPermissions[category] = {
                read: role.permissions.includes(category),
                write: role.permissions.includes(category),
                edit: role.permissions.includes(category),
            };
        });
        setPermissions(updatedPermissions);
        setIsModalOpen(true);
    };

    const handleAddNewRole = () => {
        setRoleData(null);
        setNewRoleName("");
        setPermissions(
            categories.reduce((acc, category) => {
                acc[category] = { read: false, write: false, edit: false };
                return acc;
            }, {})
        );
        setIsEditable(true);
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!newRoleName) {
            toast.error("Role Name is required");
            return;
        }
        const newRole = {
            name: newRoleName,
            count: 0,
            permissions: categories.filter((category) => permissions[category].read),
            users: [],
        };
        roles.push(newRole);
        setIsModalOpen(false);
        toast.success("Role added successfully");
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Administrator Roles Available</h2>
                <button
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    onClick={handleAddNewRole}
                >
                    + Add New Roles
                </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
                A role provides access to predefined menus and features, enabling
                administrators to access what they need based on their role.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {roles.map((role) => (
                    <div
                        key={role.name}
                        className="border border-gray-300 p-4 rounded-lg hover:shadow-lg cursor-pointer"
                        onClick={() => handleRoleClick(role)}
                    >
                        <h3 className="text-xl font-bold">{role.name}</h3>
                        <p className="text-gray-600">{role.count} Accounts</p>
                        <div className="flex -space-x-3 mt-3 relative">
                            {role.users.slice(0, 4).map((user, index) => (
                                <img
                                    key={index}
                                    src={`https://i.pravatar.cc/150?img=${index + 1}`}
                                    alt={`Avatar of ${user}`}
                                    className="w-10 h-10 rounded-full border-2 border-white"
                                />
                            ))}
                            {role.count > 4 && (
                                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs border-2 border-white">
                                    {role.count - 4 > 10 ? "10+" : `${role.count - 4}+`}
                                </div>
                            )}
                        </div>
                        <p className="mt-2 text-gray-500 truncate">
                            {role.permissions.join(", ")}
                        </p>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-6 w-11/12 sm:w-2/3 lg:w-1/2">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold">
                                {roleData ? "Role Details" : "Add New Role"}
                            </h2>
                            {!isEditable && (
                                <button
                                    className="text-blue-500 text-xl"
                                    onClick={() => setIsEditable(true)}
                                >
                                    Edit
                                </button>
                            )}
                        </div>
                        <input
                            type="text"
                            className="border border-gray-300 p-2 mb-4 w-full"
                            placeholder="Role Name"
                            value={newRoleName}
                            onChange={(e) => setNewRoleName(e.target.value)}
                            disabled={!isEditable}
                        />
                        <div className="mb-4">
                            <table className="w-full">
                                <thead>
                                    <tr>
                                        <th className="text-left">Category</th>
                                        <th className="text-center">Read</th>
                                        <th className="text-center">Write</th>
                                        <th className="text-center">Edit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map((category) => (
                                        <tr key={category}>
                                            <td className="text-left">{category}</td>
                                            {["read", "write", "edit"].map((type) => (
                                                <td key={type} className="text-center">
                                                    <input
                                                        type="checkbox"
                                                        className="w-5 h-5 accent-blue-500 rounded-full"
                                                        checked={permissions[category]?.[type] || false}
                                                        onChange={() =>
                                                            setPermissions((prev) => ({
                                                                ...prev,
                                                                [category]: {
                                                                    ...prev[category],
                                                                    [type]: !prev[category][type],
                                                                },
                                                            }))
                                                        }
                                                        disabled={!isEditable}
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-between">
                            <button
                                className="bg-gray-500 text-white py-2 px-4 rounded"
                                onClick={handleModalClose}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-blue-500 text-white py-2 px-4 rounded"
                                onClick={handleSave}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
