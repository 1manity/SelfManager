import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const roleMap = {
    creator: { label: '创建者', color: 'bg-purple-500' },
    manager: { label: '管理员', color: 'bg-blue-500' },
    member: { label: '成员', color: 'bg-gray-500' },
};

const ProjectMembers = ({ project, canManageMembers, onAddMember, onRemoveMember }) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">成员列表</h2>
                {canManageMembers && (
                    <Button onClick={onAddMember}>
                        <IconPlus className="h-4 w-4 mr-2" />
                        添加成员
                    </Button>
                )}
            </div>
            <Card>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left p-4">用户</th>
                                <th className="text-left p-4">角色</th>
                                <th className="text-left p-4">加入时间</th>
                                {canManageMembers && <th className="text-right p-4">操作</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {/* 创建者 */}
                            <tr className="border-b">
                                <td className="p-4">
                                    <div className="flex items-center">
                                        <Avatar className="h-8 w-8 mr-2">
                                            <AvatarImage src={project.creator.avatar} />
                                            <AvatarFallback>{project.creator.username[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">{project.creator.username}</div>
                                            <div className="text-sm text-gray-500">{project.creator.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <Badge className={roleMap.creator.color}>{roleMap.creator.label}</Badge>
                                </td>
                                <td className="p-4 text-sm text-gray-500">
                                    {format(new Date(project.createdAt), 'yyyy-MM-dd')}
                                </td>
                                {canManageMembers && <td className="p-4"></td>}
                            </tr>

                            {/* 其他成员 */}
                            {project.members
                                .filter((member) => member.id !== project.creator.id)
                                .map((member) => (
                                    <tr key={member.id} className="border-b">
                                        <td className="p-4">
                                            <div className="flex items-center">
                                                <Avatar className="h-8 w-8 mr-2">
                                                    <AvatarImage src={member.avatar} />
                                                    <AvatarFallback>{member.username[0]}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium">{member.username}</div>
                                                    <div className="text-sm text-gray-500">{member.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <Badge
                                                className={roleMap[member.ProjectUser?.role]?.color || 'bg-gray-500'}
                                            >
                                                {roleMap[member.ProjectUser?.role]?.label || member.ProjectUser?.role}
                                            </Badge>
                                        </td>
                                        <td className="p-4 text-sm text-gray-500">
                                            {member.ProjectUser?.joinedAt
                                                ? format(new Date(member.ProjectUser.joinedAt), 'yyyy-MM-dd')
                                                : '-'}
                                        </td>
                                        {canManageMembers && (
                                            <td className="p-4 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onRemoveMember(member.id)}
                                                >
                                                    <IconTrash className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProjectMembers;
