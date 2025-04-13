import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ProjectStatusChart = ({ projects }) => {
    // 处理数据
    const getStatusData = () => {
        const statusCounts = {
            planning: 0,
            in_progress: 0,
            completed: 0,
            suspended: 0,
        };

        projects.forEach((project) => {
            if (statusCounts[project.status] !== undefined) {
                statusCounts[project.status]++;
            }
        });

        return Object.keys(statusCounts)
            .map((key) => ({
                name:
                    key === 'planning'
                        ? '规划中'
                        : key === 'in_progress'
                          ? '进行中'
                          : key === 'completed'
                            ? '已完成'
                            : '已暂停',
                value: statusCounts[key],
            }))
            .filter((item) => item.value > 0);
    };

    const data = getStatusData();

    // 如果没有数据，显示提示信息
    if (data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>项目状态分布</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                    <p className="text-center text-muted-foreground">暂无项目数据</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle>项目状态分布</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] pt-0">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="55%"
                            labelLine={true}
                            outerRadius={70}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} 个项目`, '数量']} />
                        <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default ProjectStatusChart;
