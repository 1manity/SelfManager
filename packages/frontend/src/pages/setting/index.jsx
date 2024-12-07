import { NavLink } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { IconUser, IconSettings, IconDatabase } from '@tabler/icons-react';

function Setting() {
    const setting = [
        {
            name: '账户',
            children: [
                {
                    name: '个人信息',
                    path: '',
                    icon: IconUser,
                },
                {
                    name: '偏好设置',
                    path: 'preference',
                    icon: IconSettings,
                },
            ],
        },
        {
            name: '更多',
            children: [
                {
                    name: '数据统计',
                    path: 'data',
                    icon: IconDatabase,
                },
            ],
        },
    ];
    return (
        <div className="flex h-screen">
            <div className="w-64 p-6 border-r">
                <h2 className="scroll-m-20 text-2xl font-thin mb-6">设置</h2>
                <ul>
                    {setting.map((item) => {
                        return (
                            <li key={item.name} className="mb-2">
                                <div className="text-[#8a8f8d] text-sm mb-2">{item.name}</div>
                                {item.children ? (
                                    <ul>
                                        {item.children.map((child) => {
                                            return (
                                                <li key={child.name} className="">
                                                    <NavLink
                                                        className={({ isActive }) => {
                                                            return [
                                                                isActive ? 'bg-[#f4f5f5] font-bold' : '',
                                                                'flex hover:bg-[#f4f5f5] rounded-md p-2 text-sm transition duration-200 mb-1 ',
                                                            ].join(' ');
                                                        }}
                                                        to={`/setting/${child.path}`}
                                                        end
                                                    >
                                                        <div className="flex items-center justify-center">
                                                            <child.icon className="text-sm" size={16} />
                                                        </div>
                                                        <div className="ml-2">{child.name}</div>
                                                    </NavLink>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                ) : null}
                            </li>
                        );
                    })}
                </ul>
            </div>
            <div className="flex-1 bg-[#fafafa] p-6 overflow-auto">
                <Outlet></Outlet>
            </div>
        </div>
    );
}

export default Setting;
