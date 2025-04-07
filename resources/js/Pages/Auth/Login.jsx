import { useEffect, useState } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import LoginIcon from "../../../assets/login.png";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const handleRemember = (e) => {
        setData(
            e.target.name,
            e.target.type === "checkbox" ? e.target.checked : e.target.value
        );
    };

    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route("login"));
    };

    return (
        <GuestLayout
            icon={
                <img
                    src={LoginIcon}
                    className="w-32 md:w-64 md:mt-20"
                    alt="login Icon"
                />
            }
        >
            <Head title="Log in" />

            {status && (
                <div className="mb-4 font-medium text-sm text-green-600">
                    {status}
                </div>
            )}
            <h2 className="text-2xl text-white font-bold">Sign In</h2>
            <form onSubmit={submit}>
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
                            type={passwordVisible ? "text" : "password"}
                            className="col-span-6 dark:text-white dark:bg-white/10 border-none rounded-xl"
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            required
                        />
                        <span
                            onClick={togglePasswordVisibility}
                            className="text-2xl mx-auto text-white cursor-pointer"
                        >
                            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-2 flex justify-end">
                    {canResetPassword && (
                        <Link
                            href={route("password.request")}
                            className="text-white"
                        >
                            Forgot your password?
                        </Link>
                    )}
                </div>

                <div className="mt-6">
                    <PrimaryButton
                        className="w-full bg-blue-500 dark:bg-gray-800 flex items-center justify-center rounded-xl"
                        disabled={processing}
                    >
                        Login
                    </PrimaryButton>
                </div>
                <div className="text-white mt-3">
                    <input
                        type="checkbox"
                        name="remember"
                        checked={data.remember}
                        onChange={handleRemember}
                        className="cursor-pointer"
                    />
                    <label htmlFor="checkbox" className="ml-2">
                        Remember Me
                    </label>
                </div>
            </form>
            <div className="mt-20 items-center justify-center ">
                <p className="text-white mb-2">Don't have an Account?</p>
                <Link
                    href={route("register")}
                    className="inline-flex w-52 items-center justify-center px-4 py-2 bg-gray-800 border border-transparent rounded-xl font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                >
                    Register
                </Link>
            </div>
        </GuestLayout>
    );
}
