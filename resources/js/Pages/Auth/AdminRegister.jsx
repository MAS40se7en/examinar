import { useEffect, useState } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import SelectInput from "@/Components/SelectInput";
import { Head, Link, useForm } from "@inertiajs/react";
import RegisterIcon from "../../../assets/register.png";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

export default function AdminForm() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "admin",
    });

    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    }

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route("register"));
    };

    return (
        <GuestLayout
            icon={
                <img
                    src={RegisterIcon}
                    className="w-32 md:w-64 mt-20"
                    alt="register Icon"
                />
            }
        >
            <Head title="Register" />
            <h2 className="text-2xl text-white font-bold">Sign Up As Admin</h2>
            <form onSubmit={submit}>
                <div className="mt-4 flex flex-col gap-2">
                    <InputLabel
                        htmlFor="name"
                        value="Full Name"
                        className="text-white"
                    />
                    <TextInput
                        id="name"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        name="name"
                        isFocused={true}
                        className="dark:text-white dark:bg-white/10 border-none rounded-xl"
                        type="text"
                        required
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>
                <div className="mt-4 flex flex-col gap-2">
                    <InputLabel
                        htmlFor="email"
                        value="Email Address"
                        className="text-white"
                    />
                    <TextInput
                        id="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        name="email"
                        type="email"
                        className="dark:text-white dark:bg-white/10 border-none rounded-xl"
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>
                <div className="mt-4 flex flex-col gap-2">
                    <InputLabel
                        htmlFor="password"
                        value="Password"
                        className="text-white"
                    />
                    <div className="grid grid-cols-7 items-center">
                        <TextInput
                            id="password"
                            name="password"
                            type="password"
                            className="col-span-6 dark:text-white dark:bg-white/10 border-none rounded-xl"
                            value={data.password}
                            onChange={(e) => setData("password", e.target.value)}
                            required
                        />
                        <span
                        onClick={togglePasswordVisibility}
                        className="text-2xl mx-auto text-white cursor-pointer">
                            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    <InputError message={errors.password} className="mt-2" />
                    <div className="flex flex-col text-white opacity-45">
                        <small>Password must:</small> 
                        <small>- be at least 8 characters.</small>
                        <small>- contain an uppercase letter.</small>
                        <small>- contain a lowercase letter.</small>
                        <small>- contain a number, and a special character.</small>
                    </div>
                </div>
                <div className="mt-4 flex flex-col gap-2">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                        className="text-white"
                    />
                    <div className="grid grid-cols-7 items-center">
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="col-span-6 dark:text-white dark:bg-white/10 border-none rounded-xl"
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                            required
                        />
                        <span
                        onClick={togglePasswordVisibility}
                        className="text-2xl mx-auto text-white cursor-pointer">
                            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="mt-6">
                    <PrimaryButton
                        className="w-full bg-blue-500 dark:bg-gray-800 flex items-center justify-center"
                        disabled={processing}
                    >
                        Register
                    </PrimaryButton>
                </div>
            </form>
            <div className="mt-20 items-center justify-center md:fixed md:bottom-10">
                <p className="text-white mb-2">Already have an Account?</p>
                <Link
                    href={route("login")}
                    className="inline-flex w-52 items-center justify-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                >
                    Sign In
                </Link>
            </div>
            <div></div>
        </GuestLayout>
    );
}