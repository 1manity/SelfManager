import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer, Tooltip } from 'recharts';

const ProgressOverview = ({ statistics }) => {
    // 计算项目完成率
    const getProjectCompletionRate = () => {
        const total = statistics.projects.total || 0;
        const completed = statistics.projects.byStatus?.completed || 0;
        return total > 0 ? Math.round((completed / total) * 100) : 0;
    };

    // 计算需求完成率
    const getRequirementCompletionRate = () => {
        const total = statistics.requirements.total || 0;
        // 只有"已完成"状态才算完成
        const completed = statistics.requirements.byStatus?.completed || 0;
        return total > 0 ? Math.round((completed / total) * 100) : 0;
    };

    // 计算缺陷处理率 - 修正为包含所有已完成的状态
    const getDefectResolutionRate = () => {
        const total = statistics.defects.total || 0;
        // "已解决"、"已关闭"和"待验证"都表示缺陷已被处理
        const resolved =
            (statistics.defects.byStatus?.resolved || 0) +
            (statistics.defects.byStatus?.closed || 0) +
            (statistics.defects.byStatus?.to_verify || 0);
        return total > 0 ? Math.round((resolved / total) * 100) : 0;
    };

    const data = [
        {
            name: '项目完成率',
            value: getProjectCompletionRate(),
            fill: '#0088FE',
        },
        {
            name: '需求完成率',
            value: getRequirementCompletionRate(),
            fill: '#00C49F',
        },
        {
            name: '缺陷处理率',
            value: getDefectResolutionRate(),
            fill: '#FFBB28',
        },
    ];

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle>进度概览</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] pt-0">
                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                        cx="50%"
                        cy="50%"
                        innerRadius="20%"
                        outerRadius="70%"
                        barSize={18}
                        data={data}
                        startAngle={180}
                        endAngle={0}
                    >
                        <RadialBar
                            minAngle={15}
                            background
                            clockWise={true}
                            dataKey="value"
                            cornerRadius={5}
                            label={{ position: 'insideStart', fill: '#fff', fontWeight: 'bold' }}
                        />
                        <Legend
                            iconSize={10}
                            layout="horizontal"
                            verticalAlign="bottom"
                            align="center"
                            wrapperStyle={{ paddingTop: '15px' }}
                            formatter={(value, entry) => `${value}: ${entry.payload.value}%`}
                        />
                        <Tooltip formatter={(value) => [`${value}%`, '完成率']} />
                    </RadialBarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default ProgressOverview;
