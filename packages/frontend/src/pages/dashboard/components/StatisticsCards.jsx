import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IconUsers, IconBug, IconListCheck } from '@tabler/icons-react';

const StatisticsCards = ({ statistics }) => {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">项目统计</CardTitle>
                    <IconUsers className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{statistics.projects.total}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                        我创建的：{statistics.projects.byRole.creator || 0}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">需求统计</CardTitle>
                    <IconListCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{statistics.requirements.total}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                        待开发：{statistics.requirements.byStatus.pending || 0}
                        {' | '}
                        进行中：{statistics.requirements.byStatus.in_progress || 0}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">缺陷统计</CardTitle>
                    <IconBug className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{statistics.defects.total}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                        待处理：{statistics.defects.byStatus.open || 0}
                        {' | '}
                        处理中：{statistics.defects.byStatus.in_progress || 0}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default StatisticsCards;
