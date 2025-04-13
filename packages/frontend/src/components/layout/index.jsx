import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar.jsx';
import { cn } from '@/lib/utils.js';
import {
    IconArrowLeft,
    IconBrandTabler,
    IconSettings,
    IconBorderAll,
    IconChecklist,
    IconUsers,
} from '@tabler/icons-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setUser } from '@/store/user'; // 确保路径正确

import { whoami } from '@/api/user';
import FloatingNotificationBell from '@/components/FloatingNotificationBell';
const Layout = () => {
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();

    useEffect(() => {
        const initializeUser = async () => {
            try {
                const res = await whoami();
                if (res.code === 200) {
                    dispatch(setUser(res.data)); // 假设 res.data 包含用户信息
                } else {
                    throw new Error(res.message);
                }
            } catch (error) {
                console.error('初始化用户信息失败:', error);
            }
        };

        if (user.id === null) {
            // 仅在用户未初始化时调用
            initializeUser();
        }
    }, [dispatch, user]);

    const baseLinks = [
        {
            label: '仪表盘',
            href: '/dashboard',
            icon: <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
            label: '项目',
            href: '/projects',
            icon: <IconBorderAll className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
    ];

    // 管理员专属链接
    const adminLinks = [
        {
            label: '用户管理',
            href: '/users',
            icon: <IconUsers className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
    ];

    const footerLinks = [
        {
            label: '设置',
            href: '/setting/',
            icon: <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
            label: '登出',
            href: '/login',
            icon: <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
    ];

    // 根据用户角色构建导航链接
    const links = [
        ...baseLinks,
        ...(user.role === 'super_admin' || user.role === 'admin' ? adminLinks : []),
        ...footerLinks,
    ];

    const [open, setOpen] = useState(false);
    return (
        <div
            className={cn(
                'rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 border border-neutral-200 dark:border-neutral-700',
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
                                label: user.nickname,
                                href: '#',
                                icon: (
                                    <img
                                        src={user.avatar}
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
            <div className="flex flex-1 overflow-hidden">
                <div className="rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full overflow-auto">
                    <FloatingNotificationBell />
                    <Outlet></Outlet>
                </div>
            </div>
        </div>
    );
};

export default Layout;
