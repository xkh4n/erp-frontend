import { Outlet } from 'react-router-dom'
export default function LoginLayout() {
    return (
        <div className="h-screen w-full flex justify-center items-center bg-blue-950">
            <Outlet/>
        </div>
    )
}
