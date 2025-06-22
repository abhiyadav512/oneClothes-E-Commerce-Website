import React, { useState } from "react";
import { Pencil, Trash, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import moment from "moment";

const roles = ["USER", "ADMIN", "SUPER_ADMIN"];

const UserCardAdmin = ({ user, onEdit, onDelete, isSuperAdmin }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [selectedRole, setSelectedRole] = useState(user.role);

    // console.log(user);
    const handleSave = () => {
        if (selectedRole !== user.role) {
            onEdit({ ...user, role: selectedRole });
        }
        setIsEditing(false);
    };

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border bg-white shadow hover:shadow-md transition-all text-sm">
            {/* Avatar & Basic Info */}
            <div className="flex items-start md:items-center gap-4 w-full md:w-auto">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center uppercase text-base">
                    {user.name?.slice(0, 2) || "U"}
                </div>

                {/* Name & Email */}
                <div className="flex flex-col min-w-[160px]">
                    <div className="font-semibold truncate text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-500 truncate">{user.email}</div>
                </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2  items-center lg:grid-cols-3 gap-3 flex-1 text-sm text-gray-700">
                {/* Role */}
                <div>
                    <div className="text-xs text-gray-400 mb-1">Role</div>
                    {isSuperAdmin && isEditing ? (
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="border px-2 py-1 text-xs rounded w-full"
                        >
                            {roles.map((role) => (
                                <option key={role} value={role}>
                                    {role}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <span
                            className={`text-xs font-medium px-2 py-1 rounded inline-block ${user.role === "ADMIN"
                                ? "bg-yellow-100 text-yellow-700"
                                : user.role === "SUPER_ADMIN"
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-green-100 text-green-700"
                                }`}
                        >
                            {user.role}
                        </span>
                    )}
                </div>

                {/* Location */}
                <div>
                    <div className="text-xs text-gray-400 mb-1">Location</div>
                    <div className="text-xs text-gray-600">{user.location || "N/A"}</div>
                </div>

                {/* DOB */}
                <div>
                    <div className="text-xs text-gray-400 mb-1">Date of Birth</div>
                    <div className="text-xs text-gray-600">
                        {user.dob ? moment(user.dob).format("DD MMM YYYY") : "No DOB"}
                    </div>
                </div>

                {/* Joined */}
                <div>
                    <div className="text-xs text-gray-400 mb-1">Joined</div>
                    <div className="text-xs text-gray-500">
                        {moment(user.createdAt).format("DD MMM YYYY")}
                    </div>
                </div>
            </div>

            {/* Actions */}
            {isSuperAdmin && (
                <div className="flex gap-2 mt-2 md:mt-0">
                    {isEditing ? (
                        <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={handleSave}
                            aria-label="Save Role"
                        >
                            <Save size={16} />
                        </Button>
                    ) : (
                        <>
                            <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8"
                                onClick={() => setIsEditing(true)}
                                aria-label="Edit User"
                            >
                                <Pencil size={16} />
                            </Button>
                            <Button
                                size="icon"
                                variant="destructive"
                                className="h-8 w-8"
                                onClick={() => onDelete(user)}
                                aria-label="Delete User"
                            >
                                <Trash size={16} />
                            </Button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserCardAdmin;
