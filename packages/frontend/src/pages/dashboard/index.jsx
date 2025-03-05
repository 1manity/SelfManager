import React, { useState, useEffect } from 'react';
import { getDashboardData } from '@/api/dashboard';
import StatisticsCards from './components/StatisticsCards';
import RecentProjects from './components/RecentProjects';
import PendingTasks from './components/PendingTasks';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await getDashboardData();
            if (response.code === 200) {
                setData(response.data);
            } else {
                setError(response.message);
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-6">加载中...</div>;
    if (error) return <div className="p-6 text-red-500">{error}</div>;
    if (!data) return <div className="p-6">暂无数据</div>;

    return (
        <div className="p-6 space-y-6">
            <StatisticsCards
                statistics={{
                    projects: data.projects,
                    requirements: data.requirements,
                    defects: data.defects,
                }}
            />
            <div className="grid gap-6 md:grid-cols-2">
                <RecentProjects projects={data.recentProjects} />
                <PendingTasks tasks={data.pendingTasks} />
            </div>
        </div>
    );
};

export default Dashboard;
