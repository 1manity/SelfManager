import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TasksBarChart = ({ requirements, defects }) => {
    // 数据处理方式改变，我们将需要按状态名称分组数据
    const prepareStatusData = () => {
        const reqStatusMap = {
            pending: '待开发',
            in_progress: '进行中',
            developed: '已开发',
            testing: '测试中',
            completed: '已完成',
        };

        const defStatusMap = {
            open: '待处理',
            in_progress: '处理中',
            to_verify: '待验证',
            resolved: '已解决',
            closed: '已关闭',
        };

        // 合并所有可能的状态，创建一个状态映射表
        const allStatusMap = { ...reqStatusMap, ...defStatusMap };
        const statusGroups = {};

        // 处理需求数据
        Object.keys(requirements.byStatus || {}).forEach((key) => {
            const statusName = allStatusMap[key] || key;
            if (!statusGroups[statusName]) {
                statusGroups[statusName] = { name: statusName, 需求: 0, 缺陷: 0 };
            }
            statusGroups[statusName].需求 = requirements.byStatus[key] || 0;
        });

        // 处理缺陷数据
        Object.keys(defects.byStatus || {}).forEach((key) => {
            const statusName = allStatusMap[key] || key;
            if (!statusGroups[statusName]) {
                statusGroups[statusName] = { name: statusName, 需求: 0, 缺陷: 0 };
            }
            statusGroups[statusName].缺陷 = defects.byStatus[key] || 0;
        });

        // 转换为数组并排序
        return Object.values(statusGroups);
    };

    const chartData = prepareStatusData();

    // 如果没有数据，显示提示信息
    if (chartData.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>任务状态分布</CardTitle>
                </CardHeader>
                <CardContent className="h-[280px] flex items-center justify-center">
                    <p className="text-center text-muted-foreground">暂无任务数据</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle>任务状态分布</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] pt-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{
                            top: 10,
                            right: 30,
                            left: 20,
                            bottom: 60,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend wrapperStyle={{ paddingTop: '15px' }} />
                        <Bar dataKey="需求" fill="#8884d8" />
                        <Bar dataKey="缺陷" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default TasksBarChart;
