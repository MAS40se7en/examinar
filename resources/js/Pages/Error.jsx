import { FaBan } from "react-icons/fa6"
import { Link } from "@inertiajs/react"

export default function Error({ prvs }) {
  return (
    <div className="p-12 w-full h-screen bg-[#425993]">
        <div className="max-w-7xl bg-white rounded-3xl py-10 px-10 mx-auto sm:px-6 h-3/4 border-2 lg:px-8">
            <div className="items-center flex px-5 justify-between">
                <div>
                <h1 className="text-3xl font-extrabold">Action Not Allowed</h1>
                <p className="max-w-96 mt-5 mx-5">You don't have the required permission to access this page or execute the action you are trying to do.</p>
                </div>
                <FaBan size={82} color="red" />
            </div>
            <div>
                <p className="mt-10 mx-10">
                    To get more information, please contact a system administrator
                </p>
                <p className="mt-10 mx-10 flex flex-col">
                    go back to the last page?
                    <Link href={prvs} className="text-blue-500 hover:underline">Click here!</Link>
                </p>
            </div>
        </div>  
    </div>
  )
}