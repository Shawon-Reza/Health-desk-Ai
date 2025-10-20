import React from 'react'
import { Outlet } from 'react-router-dom'

const AdminDashboard = () => {
    return (

        <div className='max-h-screen min-h-screen '>

            {/* Admin dashboard sidebar for navigation  */}
            <section>
                sidebar
            </section>











            {/* Child Routes start for AdminDashboard */}
            <section>
                <section>
                    {/* This is Admin Dashboard navbar */}
                    <nav>
                        Admin Dashboard Navbar
                    </nav>
                </section>

                <section>
                    {/* This is Admin Dashboard Content */}
                    <Outlet />
                </section>
            </section>

        </div>
    )
}

export default AdminDashboard