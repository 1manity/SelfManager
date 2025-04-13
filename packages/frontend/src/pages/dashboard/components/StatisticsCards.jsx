import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IconUsers, IconBug, IconListCheck } from '@tabler/icons-react';

const StatisticsCards = ({ statistics }) => {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">项目统计</CardTitle>
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <IconUsers className="h-5 w-5 text-blue-500" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{statistics.projects.total}</div>
                    <div className="text-xs text-muted-foreground mt-1 space-y-1">
                        <div>我创建的：{statistics.projects.byRole?.creator || 0}</div>
                        <div>
                            我参与的：
                            {(statistics.projects.byRole?.admin || 0) + (statistics.projects.byRole?.member || 0)}
                        </div>
                        <div className="h-1 w-full bg-gray-100 mt-2 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-500 rounded-full"
                                style={{
                                    width: `${statistics.projects.byRole?.creator ? (statistics.projects.byRole.creator / statistics.projects.total) * 100 : 0}%`,
                                }}
                            ></div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">需求统计</CardTitle>
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <IconListCheck className="h-5 w-5 text-green-500" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{statistics.requirements.total}</div>
                    <div className="text-xs text-muted-foreground mt-1 space-y-1">
                        <div>待开发：{statistics.requirements.byStatus?.pending || 0}</div>
                        <div>进行中：{statistics.requirements.byStatus?.in_progress || 0}</div>
                        <div>已完成：{statistics.requirements.byStatus?.completed || 0}</div>
                        <div className="h-1 w-full bg-gray-100 mt-2 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-green-500 rounded-full"
                                style={{
                                    width: `${statistics.requirements.byStatus?.completed ? (statistics.requirements.byStatus.completed / statistics.requirements.total) * 100 : 0}%`,
                                }}
                            ></div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500 shadow-sm hover:shadow transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">缺陷统计</CardTitle>
                    <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                        <IconBug className="h-5 w-5 text-red-500" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{statistics.defects.total}</div>
                    <div className="text-xs text-muted-foreground mt-1 space-y-1">
                        <div>待处理：{statistics.defects.byStatus?.open || 0}</div>
                        <div>处理中：{statistics.defects.byStatus?.in_progress || 0}</div>
                        <div>
                            已解决：
                            {(statistics.defects.byStatus?.resolved || 0) + (statistics.defects.byStatus?.closed || 0)}
                        </div>
                        <div className="h-1 w-full bg-gray-100 mt-2 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-red-500 rounded-full"
                                style={{
                                    width: `${
                                        statistics.defects.byStatus?.resolved || statistics.defects.byStatus?.closed
                                            ? (((statistics.defects.byStatus?.resolved || 0) +
                                                  (statistics.defects.byStatus?.closed || 0)) /
                                                  statistics.defects.total) *
                                              100
                                            : 0
                                    }%`,
                                }}
                            ></div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default StatisticsCards;
