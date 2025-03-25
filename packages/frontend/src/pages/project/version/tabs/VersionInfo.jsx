import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const versionStatusMap = {
    planned: { label: '计划中', color: 'bg-blue-500' },
    in_progress: { label: '进行中', color: 'bg-yellow-500' },
    released: { label: '已发布', color: 'bg-green-500' },
    deprecated: { label: '已废弃', color: 'bg-gray-500' },
};

const VersionInfo = () => {
    const { version, project } = useOutletContext();

    return (
        <div className="space-y-6 p-6">
            <Card>
                <CardHeader>
                    <CardTitle>版本概览</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-medium">版本号</h3>
                            <p className="text-sm text-gray-500">{version.versionNumber}</p>
                        </div>
                        <div>
                            <h3 className="font-medium">版本状态</h3>
                            <div className="flex items-center mt-1">
                                <Badge className={versionStatusMap[version.status]?.color || 'bg-gray-500'}>
                                    {versionStatusMap[version.status]?.label || version.status}
                                </Badge>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-medium">计划发布日期</h3>
                            <p className="text-sm text-gray-500">
                                {version.releaseDate ? format(new Date(version.releaseDate), 'yyyy-MM-dd') : '未设置'}
                            </p>
                        </div>
                        <div>
                            <h3 className="font-medium">创建者</h3>
                            <div className="flex items-center mt-1">
                                <Avatar className="h-6 w-6 mr-2">
                                    <AvatarImage src={version.creator?.avatar} />
                                    <AvatarFallback>{version.creator?.username?.[0] || 'U'}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{version.creator?.username || '未知'}</span>
                            </div>
                        </div>
                        <div className="col-span-2">
                            <h3 className="font-medium">版本描述</h3>
                            <p className="text-sm text-gray-500">{version.description || '暂无描述'}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>所属项目</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center">
                        <div>
                            <h3 className="font-medium">{project.name}</h3>
                            <p className="text-sm text-gray-500">{project.description || '暂无描述'}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default VersionInfo;
