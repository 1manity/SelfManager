import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MyRequirements from '../components/MyRequirements';
import MyDefects from '../components/MyDefects';
import MyTasksList from '../components/MyTasksList';
import { getDefectsByVersionId } from '@/api/defect';
import { getRequirementsByVersionId } from '@/api/requirement';
import { useToast } from '@/hooks/use-toast';
import { useSelector } from 'react-redux';

const MyTasksTab = () => {
    const { version, project } = useOutletContext();
    const [myRequirements, setMyRequirements] = useState([]);
    const [myDefects, setMyDefects] = useState([]);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const user = useSelector((state) => state.user.user);

    useEffect(() => {
        if (version?.id && user?.id) {
            fetchMyTasks();
        }
    }, [version?.id, user?.id]);

    const fetchMyTasks = async () => {
        try {
            setLoading(true);
            const [reqResponse, defectResponse] = await Promise.all([
                getRequirementsByVersionId(version.id),
                getDefectsByVersionId(version.id),
            ]);

            if (reqResponse.code === 200) {
                // 过滤出当前用户负责的需求
                const userRequirements = reqResponse.data.filter(
                    (req) => req.assigneeId === user.id || req.creatorId === user.id
                );
                console.log(userRequirements);
                setMyRequirements(userRequirements);
            } else {
                setMyRequirements([]);
            }

            if (defectResponse.code === 200) {
                // 过滤出当前用户负责的缺陷
                const userDefects = defectResponse.data.filter(
                    (defect) => defect.assigneeId === user.id || defect.creatorId === user.id
                );
                setMyDefects(userDefects);
            } else {
                setMyDefects([]);
            }
        } catch (error) {
            console.error('获取我的任务失败:', error);
            toast({
                title: '获取我的任务失败',
                description: error.message,
                variant: 'destructive',
            });
            // 确保在错误情况下也设置为空数组
            setMyRequirements([]);
            setMyDefects([]);
        } finally {
            setLoading(false);
        }
    };

    const handleTaskUpdated = () => {
        fetchMyTasks();
    };

    // 检查子组件是否存在
    if (!MyTasksList || !MyRequirements || !MyDefects) {
        console.error('子组件未定义:', { MyTasksList, MyRequirements, MyDefects });
        return <div className="p-6">组件加载错误</div>;
    }

    return (
        <div className="space-y-6 p-6">
            <h2 className="text-lg font-semibold">我的任务</h2>

            <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">全部任务</TabsTrigger>
                    <TabsTrigger value="requirements">需求任务</TabsTrigger>
                    <TabsTrigger value="defects">缺陷任务</TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                    <MyTasksList
                        requirements={myRequirements || []}
                        defects={myDefects || []}
                        versionId={version?.id}
                        projectId={project?.id}
                        onTaskUpdated={handleTaskUpdated}
                        loading={loading}
                    />
                </TabsContent>
                <TabsContent value="requirements">
                    <MyRequirements
                        requirements={myRequirements || []}
                        versionId={version?.id}
                        projectId={project?.id}
                        onRequirementUpdated={handleTaskUpdated}
                        loading={loading}
                    />
                </TabsContent>
                <TabsContent value="defects">
                    <MyDefects
                        defects={myDefects || []}
                        versionId={version?.id}
                        projectId={project?.id}
                        onDefectUpdated={handleTaskUpdated}
                        loading={loading}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default MyTasksTab;
