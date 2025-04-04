import { Outlet } from 'react-router-dom'
export default function LoginLayout() {
    return (
        <div className="h-screen w-full flex justify-center items-center bg-gradient-to-tr from-blue-950 to-blue-500">
            <Outlet/>
        </div>
    )
}
