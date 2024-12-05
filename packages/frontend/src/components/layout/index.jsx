import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar.jsx';
import { cn } from '@/lib/utils.js';
import { IconArrowLeft, IconBrandTabler, IconSettings, IconUserBolt, IconChecklist } from '@tabler/icons-react';
import { useState } from 'react';

const Layout = () => {
    const links = [
        {
            label: 'Dashboard',
            href: '/dashboard',
            icon: <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
            label: 'Tasks',
            href: 'tasks',
            icon: <IconChecklist className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
            label: 'Settings',
            href: '#',
            icon: <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
            label: 'Logout',
            href: '#',
            icon: <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
    ];
    const [open, setOpen] = useState(false);
    return (
        <div
            className={cn(
                'rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 border border-neutral-200 dark:border-neutral-700 overflow-hidden',
                'h-screen' // for your use case, use `h-screen` instead of `h-[60vh]` max-w-7xl mx-auto
            )}
        >
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-10">
                    <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                        {/*{open ? <Logo /> : <LogoIcon />}*/}
                        <div className="mt-8 flex flex-col gap-2">
                            {links.map((link, idx) => (
                                <SidebarLink key={idx} link={link} />
                            ))}
                        </div>
                    </div>
                    <div>
                        <SidebarLink
                            link={{
                                label: '1manity',
                                href: '#',
                                icon: (
                                    <img
                                        src="https://1manity.top/10.jpg"
                                        className="h-7 w-7 flex-shrink-0 rounded-full"
                                        width={50}
                                        height={50}
                                        alt="Avatar"
                                    />
                                ),
                            }}
                        />
                    </div>
                </SidebarBody>
            </Sidebar>
            <div className="flex flex-1">
                <div className="rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
                    <Outlet></Outlet>
                </div>
            </div>
        </div>
    );
};

export default Layout;
