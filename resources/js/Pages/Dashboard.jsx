import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { data } from "autoprefixer";
import AdminDashboard from "./DashboardUIs/AdminDashboard";
import UserDashboard from "./DashboardUIs/UserDashboard";

export default function Dashboard({ auth, projects, success }) {
    const bgClass =
        auth.user.role === "admin" ? "admin-bglight" : "user-bglight";
    const bgDarkClass =
        auth.user.role === "admin" ? "admin-bgdark" : "user-bgdark";

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard
                </h2>
            }
            bgClass={bgClass}
            bgDarkClass={bgDarkClass}
        >
            {/*  */}
            <Head title="Dashboard" />
            {auth.user.role === "admin" ? (
                <AdminDashboard
                    projects={projects}
                    auth={auth}
                    success={success}
                />
            ) : (
                <UserDashboard projects={projects} auth={auth} />
            )}
        </AuthenticatedLayout>
    );
}
