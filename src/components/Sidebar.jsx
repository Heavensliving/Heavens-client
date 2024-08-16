import React from 'react';
import { NavLink } from 'react-router-dom';
import 'boxicons/css/boxicons.min.css';
import './Sidebar.css';

const Sidebar = ({ children }) => {
    const userRole = localStorage.getItem('userRole'); // Retrieve the user role from localStorage

    const menuItem = [
        {
            path: userRole === 'property-manager' ? "/dashboard-property-manage" : "/Dashboard",
            name: "Dashboard",
            icon: <i className='bx bx-home'></i>
        },
        {
            path: userRole === 'property-manager' ? "dashboard-manage-studentmanagement" : "/StudentManagement",
            name: "Student Management",
            icon: <i className='bx bx-male-female'></i>
        },
        {
            path: userRole === 'property-manager' ? "/dashboard-property-manage/staff" : "/StaffManagement",
            name: "Staff Management",
            icon: <i className='bx bxs-user'></i>
        },
        {
            path: userRole === 'property-manager' ? "/dashboard-property-manage/properties" : "/PropertyManagement",
            name: "Property Management",
            icon: <i className='bx bx-buildings'></i>
        },
        {
            path: userRole === 'property-manager' ? "/dashboard-manage-paymentmanagement" : "/Payments",
            name: "Payments",
            icon: <i className='bx bx-wallet'></i>
        },
        {
            path: userRole === 'property-manager' ? "/dashboard-property-manage/maintenance" : "/m",
            name: "Maintenance",
            icon: <i class='bx bx-error-alt'></i>
        },
    ];

    return (
        <div className="container">
            <div className="sidebar">
                <div className="top_section">
                    <h4 className="logo">Heavens <span>Living</span></h4>
                </div>
                {menuItem.map((item, index) => (
                    <NavLink to={item.path} key={index} className="link" activeClassName="active">
                        <div className="icon">{item.icon}</div>
                        <div className="link_text">{item.name}</div>
                    </NavLink>
                ))}
            </div>
            <main>{children}</main>
        </div>
    );
};

export default Sidebar;
