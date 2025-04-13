import React, { useState, useEffect } from 'react';
import { getDashboardData } from '@/api/dashboard';
import { adaptDashboardData } from './utils/dataAdapter';
import StatisticsCards from './components/StatisticsCards';
import RecentProjects from './components/RecentProjects';
import PendingTasks from './components/PendingTasks';
import ProjectStatusChart from './components/ProjectStatusChart';
import TasksBarChart from './components/TasksBarChart';
import ProgressOverview from './components/ProgressOverview';

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
                const adaptedData = adaptDashboardData(response.data);
                setData(adaptedData);
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
            <h1 className="text-2xl font-bold mb-4">仪表盘概览</h1>

            <StatisticsCards
                statistics={{
                    projects: data.projects,
                    requirements: data.requirements,
                    defects: data.defects,
                }}
            />

            <div className="grid gap-6 md:grid-cols-2">
                <ProjectStatusChart projects={data.recentProjects} />
                <ProgressOverview
                    statistics={{
                        projects: data.projects,
                        requirements: data.requirements,
                        defects: data.defects,
                    }}
                />
            </div>

            <TasksBarChart requirements={data.requirements} defects={data.defects} />

            <div className="grid gap-6 md:grid-cols-2">
                <RecentProjects projects={data.recentProjects} />
                <PendingTasks tasks={data.pendingTasks} />
            </div>
        </div>
    );
};

export default Dashboard;
