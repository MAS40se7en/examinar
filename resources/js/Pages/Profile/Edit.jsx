import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import { Head } from "@inertiajs/react";

export default function Edit({ auth, mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Profile
                </h2>
            }
            bgClass={`profile-bglight`}
            bgDarkClass={`profile-bgdark`}
        >
            <Head title="Profile" />

            <div className="py-12  flex flex-col gap-10 lg:flex-row lg:justify-around ">
                <div className="dark:text-white pl-10 lg:pl-28 border-black flex items-center lg:items-start lg:flex-col justify-between gap-2">
                    <div className="lg:mt-32">
                        <h2 className="text-4xl font-bold">
                            Edit Your Profile
                        </h2>
                        <p className="block pr-4 mt-3">
                            Update your Name, Email and Password.
                        </p>
                    </div>
                    <div className="mt-7 pr-8 lg:pr-0 lg:mb-7">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
                <div className=" w-full sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white dark:bg-[#141414]  shadow rounded-3xl ">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="w-full"
                        />

                        <UpdatePasswordForm className="max-w-full mt-4" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
