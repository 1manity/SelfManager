import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getVersionById } from '@/api/version';
import { Button } from '@/components/ui/button';
import { IconChevronLeft, IconFileDescription, IconBug, IconInfoCircle } from '@tabler/icons-react';
import {
    getRequirementsByVersionId,
    updateRequirementStatus,
    deleteRequirement,
    createRequirement,
    updateRequirement,
    assignRequirement,
} from '@/api/requirement';
import {
    getDefectsByVersionId,
    updateDefectStatus,
    deleteDefect,
    createDefect,
    updateDefect,
    assignDefect,
} from '@/api/defect';
import { useToast } from '@/hooks/use-toast';
import VersionInfo from './components/VersionInfo';
import RequirementList from './components/RequirementList';
import DefectList from './components/DefectList';
import MyRequirements from './components/MyRequirements';
import MyDefects from './components/MyDefects';
import MyTasksList from './components/MyTasksList';
import { getProjectUsers } from '@/api/project';

const VersionDetail = () => {
    const { projectId, versionId } = useParams();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('info');
    const [version, setVersion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [requirements, setRequirements] = useState([]);
    const [bugs, setBugs] = useState([]);
    const currentUser = useSelector((state) => state.user.user);
    const { toast } = useToast();
    const [members, setMembers] = useState([]);

    useEffect(() => {
        fetchVersionData();
        fetchProjectMembers();
    }, [versionId, projectId]);

    const fetchVersionData = async () => {
        try {
            setLoading(true);
            const versionResponse = await getVersionById(versionId);
            const requirementsResponse = await getRequirementsByVersionId(versionId);
            const bugsResponse = await getDefectsByVersionId(versionId);

            if (versionResponse.code === 200) {
                setVersion(versionResponse.data);
            }

            if (requirementsResponse.code === 200) {
                setRequirements(requirementsResponse.data);
            }

            if (bugsResponse.code === 200) {
                setBugs(bugsResponse.data);
            }
        } catch (error) {
            toast({
                title: '获取数据失败',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchProjectMembers = async () => {
        try {
            const response = await getProjectUsers(projectId);
            if (response.code === 200) {
                setMembers(response.data.members);
            }
        } catch (error) {
            console.error('获取项目成员失败:', error);
        }
    };

    // 需求相关处理函数
    const handleCreateRequirement = async (requirementData) => {
        try {
            const response = await createRequirement(requirementData);
            if (response.code === 200) {
                setRequirements([...requirements, response.data]);
                toast({ title: '需求创建成功' });
                return true;
            }
            return false;
        } catch (error) {
            toast({ title: '需求创建失败', description: error.message });
            return false;
        }
    };

    const handleUpdateRequirement = async (requirementData) => {
        console.log('requirementData', requirementData);
        console.log('requirements', requirements);
        try {
            // 检查requirementData是否为数组
            if (Array.isArray(requirementData)) {
                // 如果是数组，直接更新状态
                setRequirements(requirementData);
                toast({ title: '需求列表更新成功' });
                return true;
            } else {
                // 如果是单个对象，调用API更新
                const response = await updateRequirement(requirementData.id, requirementData);
                if (response.code === 200) {
                    setRequirements(requirements.map((req) => (req.id === response.data.id ? response.data : req)));
                    toast({ title: '需求更新成功' });
                    return true;
                }
            }
            return false;
        } catch (error) {
            toast({ title: '需求更新失败', description: error.message });
            return false;
        }
    };

    const handleDeleteRequirement = async (requirementId) => {
        try {
            const response = await deleteRequirement(requirementId);
            if (response.code === 200) {
                setRequirements(requirements.filter((req) => req.id !== requirementId));
                toast({ title: '需求删除成功' });
            }
        } catch (error) {
            toast({ title: '需求删除失败', description: error.message });
        }
    };

    const handleRequirementStatusChange = async (requirementId, status) => {
        try {
            const response = await updateRequirementStatus(requirementId, status);
            if (response.code === 200) {
                setRequirements(requirements.map((req) => (req.id === requirementId ? { ...req, status } : req)));
                toast({ title: '状态更新成功' });
            }
        } catch (error) {
            toast({ title: '状态更新失败', description: error.message });
        }
    };

    // 缺陷相关处理函数
    const handleCreateDefect = async (defectData) => {
        try {
            const response = await createDefect(defectData);
            if (response.code === 200) {
                setBugs([...bugs, response.data]);
                toast({ title: '缺陷创建成功' });
                return true;
            }
            return false;
        } catch (error) {
            toast({ title: '缺陷创建失败', description: error.message });
            return false;
        }
    };

    const handleUpdateDefect = async (defectData) => {
        try {
            // 检查defectData是否为数组
            if (Array.isArray(defectData)) {
                // 如果是数组，直接更新状态
                setBugs(defectData);
                toast({ title: '缺陷列表更新成功' });
                return true;
            } else {
                // 如果是单个对象，调用API更新
                const response = await updateDefect(defectData.id, defectData);
                if (response.code === 200) {
                    setBugs(bugs.map((bug) => (bug.id === response.data.id ? response.data : bug)));
                    toast({ title: '缺陷更新成功' });
                    return true;
                }
            }
            return false;
        } catch (error) {
            toast({ title: '缺陷更新失败', description: error.message });
            return false;
        }
    };

    const handleDeleteDefect = async (defectId) => {
        try {
            const response = await deleteDefect(defectId);
            if (response.code === 200) {
                setBugs(bugs.filter((bug) => bug.id !== defectId));
                toast({ title: '缺陷删除成功' });
            }
        } catch (error) {
            toast({ title: '缺陷删除失败', description: error.message });
        }
    };

    const handleDefectStatusChange = async (defectId, status) => {
        try {
            const response = await updateDefectStatus(defectId, status);
            if (response.code === 200) {
                setBugs(bugs.map((bug) => (bug.id === defectId ? { ...bug, status } : bug)));
                toast({ title: '状态更新成功' });
            }
        } catch (error) {
            toast({ title: '状态更新失败', description: error.message });
        }
    };

    const handleAssignRequirement = async (requirementId, assigneeId) => {
        try {
            if (!requirementId) {
                console.error('需求ID不能为空');
                toast({
                    title: '指派失败',
                    description: '需求ID不能为空',
                    variant: 'destructive',
                });
                return;
            }

            const response = await assignRequirement(requirementId, assigneeId);
            if (response.code === 200) {
                // 更新本地需求数据
                const updatedRequirements = requirements.map((requirement) => {
                    if (requirement.id === requirementId) {
                        // 找到要指派的成员对象
                        const assignedMember = assigneeId ? members.find((m) => m.id === assigneeId) : null;

                        return {
                            ...requirement,
                            assigneeId: assigneeId,
                            assignee: assignedMember, // 确保设置了assignee对象
                            assignedAt: assigneeId ? new Date().toISOString() : null,
                        };
                    }
                    return requirement;
                });

                setRequirements(updatedRequirements);

                const updatedMyRequirements = updatedRequirements.filter((req) => req.assigneeId === currentUser.id);

                toast({
                    title: '指派成功',
                    description: assigneeId ? '已成功指派需求' : '已取消指派',
                });
            }
        } catch (error) {
            console.error('指派需求失败:', error);
            toast({
                title: '指派失败',
                description: error.message,
                variant: 'destructive',
            });
        }
    };

    const handleAssignDefect = async (defectId, assigneeId) => {
        try {
            if (!defectId) {
                console.error('缺陷ID不能为空');
                toast({
                    title: '指派失败',
                    description: '缺陷ID不能为空',
                    variant: 'destructive',
                });
                return;
            }

            const response = await assignDefect(defectId, assigneeId);
            if (response.code === 200) {
                // 更新本地缺陷数据
                const updatedDefects = bugs.map((defect) => {
                    if (defect.id === defectId) {
                        // 找到要指派的成员对象
                        const assignedMember = assigneeId ? members.find((m) => m.id === assigneeId) : null;

                        return {
                            ...defect,
                            assigneeId: assigneeId,
                            assignee: assignedMember, // 确保设置了assignee对象
                            assignedAt: assigneeId ? new Date().toISOString() : null,
                        };
                    }
                    return defect;
                });

                setBugs(updatedDefects);

                const updatedMyDefects = updatedDefects.filter((bug) => bug.assigneeId === currentUser.id);

                toast({
                    title: '指派成功',
                    description: assigneeId ? '已成功指派缺陷' : '已取消指派',
                });
            }
        } catch (error) {
            console.error('指派缺陷失败:', error);
            toast({
                title: '指派失败',
                description: error.message,
                variant: 'destructive',
            });
        }
    };

    if (loading) return <div className="p-6">加载中...</div>;
    if (!version) return <div className="p-6">版本不存在</div>;

    // 筛选出当前用户负责的需求和缺陷
    const myRequirements = requirements.filter((req) => req.assigneeId === currentUser.id);
    const myDefects = bugs.filter((bug) => bug.assigneeId === currentUser.id);

    return (
        <div className="flex h-full">
            <div className="w-64 border-r bg-white dark:bg-neutral-900">
                <div className="p-4">
                    <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => navigate(`/project/detail/${projectId}`)}
                    >
                        <IconChevronLeft className="mr-2 h-4 w-4" />
                        返回项目
                    </Button>
                </div>
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">{version.versionNumber}</h2>
                    <div className="space-y-1">
                        <Button
                            variant={activeSection === 'info' ? 'secondary' : 'ghost'}
                            className="w-full justify-start"
                            onClick={() => setActiveSection('info')}
                        >
                            <IconInfoCircle className="mr-2 h-4 w-4" />
                            版本信息
                        </Button>
                        <Button
                            variant={activeSection === 'requirements' ? 'secondary' : 'ghost'}
                            className="w-full justify-start"
                            onClick={() => setActiveSection('requirements')}
                        >
                            <IconFileDescription className="mr-2 h-4 w-4" />
                            需求管理
                        </Button>
                        <Button
                            variant={activeSection === 'bugs' ? 'secondary' : 'ghost'}
                            className="w-full justify-start"
                            onClick={() => setActiveSection('bugs')}
                        >
                            <IconBug className="mr-2 h-4 w-4" />
                            缺陷管理
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex-1 bg-[#fafafa] p-6 overflow-auto">
                {activeSection === 'info' && (
                    <div className="space-y-6">
                        <VersionInfo version={version} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <MyRequirements requirements={requirements} currentUserId={currentUser.id} />
                            <MyDefects defects={bugs} currentUserId={currentUser.id} />
                        </div>
                    </div>
                )}

                {activeSection === 'requirements' && (
                    <div className="space-y-6">
                        {myRequirements.length > 0 && (
                            <MyTasksList
                                type="requirement"
                                items={myRequirements}
                                members={members}
                                onStatusChange={handleRequirementStatusChange}
                                onDelete={handleDeleteRequirement}
                                onUpdate={handleUpdateRequirement}
                                onAssign={handleAssignRequirement}
                            />
                        )}

                        <RequirementList
                            requirements={requirements}
                            onStatusChange={handleRequirementStatusChange}
                            onDelete={handleDeleteRequirement}
                            onCreate={handleCreateRequirement}
                            onUpdate={handleUpdateRequirement}
                            versionId={versionId}
                            projectId={projectId}
                        />
                    </div>
                )}

                {activeSection === 'bugs' && (
                    <div className="space-y-6">
                        {myDefects.length > 0 && (
                            <MyTasksList
                                type="defect"
                                items={myDefects}
                                members={members}
                                onStatusChange={handleDefectStatusChange}
                                onDelete={handleDeleteDefect}
                                onUpdate={handleUpdateDefect}
                                onAssign={handleAssignDefect}
                            />
                        )}

                        <DefectList
                            defects={bugs}
                            onStatusChange={handleDefectStatusChange}
                            onDelete={handleDeleteDefect}
                            onCreate={handleCreateDefect}
                            onUpdate={handleUpdateDefect}
                            versionId={versionId}
                            projectId={projectId}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default VersionDetail;
