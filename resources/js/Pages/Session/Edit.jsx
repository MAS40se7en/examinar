import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import InputError from "@/Components/InputError";
import { FaXmark } from "react-icons/fa6";
import Modal from "@/Components/Modal";

export default function Edit({
    project,
    defaultStartDate,
    isStartDateDisabled,
    session,
    closeEditSession,
}) {
    const { data, setData, patch, processing, errors } = useForm({
        start_date: session.start_date || "",
        end_date: session.end_date || "",
        number_of_questions: session.number_of_questions || 1,
        project_id: project.id,
    });

    const [customErrors, setCustomErrors] = useState({
        overlapErr: false,
        emptyError: false,
        insufficientErr: false,
        noQuestionsErr: false,
        startDateErr: false,
        endDateErr: false,
    });

    useEffect(() => {
        if (defaultStartDate) {
            setData("start_date", defaultStartDate);
        }
    }, [defaultStartDate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setCustomErrors({
            overlapErr: false,
            emptyError: false,
            insufficientErr: false,
            noQuestionsErr: false,
            startDateErr: false,
            endDateErr: false,
        });

        patch(route("session.update", session.id), {
            onSuccess: () => {
                closeEditSession();
            },
            onError: () => {
                setCustomErrors({
                    overlapErr: errors.overlap ? true : false,
                    emptyError: errors.emptyError ? true : false,
                    insufficientErr: errors.insufficientQuestions
                        ? true
                        : false,
                    noQuestionsErr: errors.noQuestions ? true : false,
                    startDateErr: errors.belowStartDateErr ? true : false,
                    endDateErr: errors.aboveEndDateErr ? true : false,
                });
            },
        });
    };

    useEffect(() => {
        setCustomErrors({
            overlapErr: errors.overlap ? true : false,
            emptyError: errors.emptyError ? true : false,
            insufficientErr: errors.insufficientQuestions ? true : false,
            noQuestionsErr: errors.noQuestions ? true : false,
            startDateErr: errors.belowStartDateErr ? true : false,
            endDateErr: errors.aboveEndDateErr ? true : false,
        });
    }, [errors]);

    return (
        <div className="py-12">
            <div className="sm:px-6 lg:px-8">
                <div className="sm:rounded-lg">
                    <div className="p-6 text-gray-900 border rounded-3xl border-gray-300 bg-[#d9d9d9] dark:bg-[#141414] dark:text-white dark:border-[#242424]">
                        <form onSubmit={handleSubmit}>
                            {/* Start Date Field */}
                            <div className="flex flex-col gap-2 mt-4">
                                <InputLabel
                                    htmlFor="start_date"
                                    value="Start Date:"
                                />
                                <TextInput
                                    id="start_date"
                                    type="date"
                                    name="start_date"
                                    disabled={isStartDateDisabled}
                                    className="rounded-xl w-full lg:w-64 h-8 dark:bg-[#1b1b1b] border-none focus:outline-none focus:ring-0"
                                    value={data.start_date}
                                    onChange={(e) =>
                                        setData("start_date", e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.start_date}
                                    className="mt-2"
                                />
                                {customErrors.startDateErr && (
                                    <div className="mt-2 text-red-500">
                                        {errors.belowStartDateErr}
                                    </div>
                                )}
                            </div>

                            {/* End Date Field */}
                            <div className="flex flex-col gap-2 mt-4">
                                <InputLabel
                                    htmlFor="end_date"
                                    value="End Date:"
                                />
                                <TextInput
                                    id="end_date"
                                    type="date"
                                    value={data.end_date}
                                    onChange={(e) =>
                                        setData("end_date", e.target.value)
                                    }
                                    className="rounded-xl w-full lg:w-64 h-8 dark:bg-[#1b1b1b] border-none focus:outline-none focus:ring-0"
                                />
                                <InputError
                                    message={errors.end_date}
                                    className="mt-2"
                                />
                                {customErrors.endDateErr && (
                                    <div className="mt-2 text-red-500">
                                        {errors.aboveEndDateErr}
                                    </div>
                                )}
                            </div>

                            {/* Number of Questions Per User Field */}
                            <div className="flex flex-col gap-2 mt-4">
                                <InputLabel
                                    htmlFor="number_of_questions"
                                    value="Number of Questions Per User:"
                                />
                                <TextInput
                                    id="number_of_questions"
                                    type="number"
                                    min="1"
                                    value={data.number_of_questions}
                                    onChange={(e) =>
                                        setData(
                                            "number_of_questions",
                                            e.target.value
                                        )
                                    }
                                    className="rounded-xl w-full lg:w-64 h-8 dark:bg-[#1b1b1b] border-none focus:outline-none focus:ring-0"
                                />
                                <InputError
                                    message={errors[0]}
                                    className="mt-2"
                                />
                                {customErrors.overlapErr && (
                                    <div className="text-red-500 mt-1">
                                        {errors.overlap}
                                    </div>
                                )}
                                {customErrors.emptyError && (
                                    <div className="text-red-500 mt-1">
                                        {errors.emptyError}
                                    </div>
                                )}
                                {customErrors.insufficientErr && (
                                    <div className="text-red-500 mt-1">
                                        {errors.insufficientQuestions}
                                    </div>
                                )}
                                {customErrors.noQuestionsErr && (
                                    <div className="text-red-500 mt-1">
                                        {errors.noQuestions}
                                    </div>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-4 px-6 mt-6">
                                <button
                                    type="button"
                                    onClick={closeEditSession}
                                    className="bg-red-500 px-6 py-1 rounded-xl font-bold text-white dark:bg-red-700 dark:hover:bg-red-500 hover:bg-red-700 focus:outline-none focus:ring-1 transition ease-in-out duration-150"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="text-white bg-green-500 px-6 py-1 rounded-xl font-bold dark:hover:bg-green-700 hover:bg-green-700 focus:outline-none focus:ring-1 transition ease-in-out duration-150"
                                >
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
