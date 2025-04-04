import { Outlet } from 'react-router-dom'
import Navbar from '../Components/Navbar'

export default function MainLayout() {
    return (
        <>
            <Navbar />
            <div className=' mt-4 flex-1'>
                <Outlet />
            </div>
        </>
    )
}
