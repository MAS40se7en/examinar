import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Link, useForm, usePage } from "@inertiajs/react";
import { Transition } from "@headlessui/react";

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = "",
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            role: user.role,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route("profile.update"));
    };

    return (
        <section className={`${className} dark:text-white`}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                    Profile Information
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-white">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center gap-5">
                    <InputLabel htmlFor="name" value="Name:" className="w-32" />

                    <TextInput
                        id="name"
                        className="mt-1 block md:w-96  border-[#bcbcbc] dark:border-[#3e3d3f] dark:bg-[#1b1b1b]"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-5">
                    <InputLabel
                        htmlFor="email"
                        value="Email Address:"
                        className="w-32"
                    />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block md:w-96  border-[#bcbcbc] dark:border-[#3e3d3f] dark:bg-[#1b1b1b]"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                        autoComplete="username"
                    />
                    {user.email_verified_at ? (
                        <span className="text-green-700 block text-sm  dark:text-green-400">
                            Verified
                        </span>
                    ) : (
                        <span className="text-red-700 text-sm dark:text-red-500 ">
                            Unverified
                        </span>
                    )}

                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div className="flex items-center gap-5">
                    <InputLabel
                        htmlFor="role"
                        value="Role:"
                        className="md:w-32 "
                    />
                    <p className="font-bold">{data.role.toUpperCase()}</p>
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="text-sm mt-2 text-gray-800 dark:text-white">
                            Your email address is unverified.
                            <Link
                                href={route("verification.send")}
                                method="post"
                                as="button"
                                className="underline text-sm text-gray-600 dark:text-gray-200 dark:hover:text-gray-400 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === "verification-link-sent" && (
                            <div className="mt-2 font-medium text-sm text-green-600">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4 border-b-4 border-b-[#898279] py-4">
                    <PrimaryButton
                        className="bg-green-600"
                        disabled={processing}
                    >
                        Save
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-green-600">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
