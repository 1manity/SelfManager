import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

const VersionInfo = ({ version }) => {
    return (
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
                        <h3 className="font-medium">发布日期</h3>
                        <p className="text-sm text-gray-500">
                            {version.releaseDate ? format(new Date(version.releaseDate), 'yyyy-MM-dd') : '未设置'}
                        </p>
                    </div>
                    <div className="col-span-2">
                        <h3 className="font-medium">描述</h3>
                        <p className="text-sm text-gray-500">{version.description || '暂无描述'}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default VersionInfo;
