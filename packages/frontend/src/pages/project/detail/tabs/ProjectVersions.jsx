import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const versionStatusMap = {
    planned: { label: '计划中', color: 'bg-blue-500' },
    in_progress: { label: '进行中', color: 'bg-yellow-500' },
    released: { label: '已发布', color: 'bg-green-500' },
    deprecated: { label: '已废弃', color: 'bg-gray-500' },
};

const ProjectVersions = ({ project, onCreateVersion }) => {
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">版本列表</h2>
                <Button onClick={onCreateVersion}>
                    <IconPlus className="h-4 w-4 mr-2" />
                    新建版本
                </Button>
            </div>
            <div className="grid grid-cols-1 gap-4">
                {project?.versions.map((version) => (
                    <Card
                        key={version.id}
                        className="hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => navigate(`/project/${project.id}/version/${version.id}`)}
                    >
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <h3 className="font-medium">{version.versionNumber}</h3>
                                        <Badge className={versionStatusMap[version.status]?.color || 'bg-gray-500'}>
                                            {versionStatusMap[version.status]?.label || version.status}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">{version.description}</p>
                                </div>
                                <div className="text-sm text-gray-500">
                                    计划发布：{format(new Date(version.releaseDate), 'yyyy-MM-dd')}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {project?.versions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">暂无版本，点击"新建版本"按钮创建第一个版本</div>
                )}
            </div>
        </div>
    );
};

export default ProjectVersions;
