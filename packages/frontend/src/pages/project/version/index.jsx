import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVersionById } from '@/api/version';
import { Button } from '@/components/ui/button';
import { IconArrowLeft, IconInfoCircle, IconBug, IconListCheck } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import {
    createRequirement,
    getRequirementsByVersionId,
    updateRequirement,
    deleteRequirement,
    updateRequirementStatus,
} from '@/api/requirement';
import { createDefect, getDefectsByVersionId, updateDefect, deleteDefect, updateDefectStatus } from '@/api/defect';
import { useToast } from '@/hooks/use-toast';

// 导入拆分的组件
import VersionInfo from './components/VersionInfo';
import RequirementList from './components/RequirementList';
import DefectList from './components/DefectList';

const VersionDetail = () => {
    const { projectId, versionId } = useParams();
    const navigate = useNavigate();
    const [version, setVersion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeSection, setActiveSection] = useState('info');
    const { toast } = useToast();
    const [requirements, setRequirements] = useState([]);
    const [bugs, setBugs] = useState([]);

    useEffect(() => {
        const fetchVersionData = async () => {
            if (!versionId) return;

            setLoading(true);
            try {
                const response = await getVersionById(versionId);
                if (response.code === 200) {
                    setVersion(response.data);
                } else {
                    setError(response.message);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVersionData();
    }, [versionId]);

    useEffect(() => {
        if (versionId) {
            fetchRequirementsAndBugs();
        }
    }, [versionId]);

    const fetchRequirementsAndBugs = async () => {
        try {
            const [reqResponse, defectResponse] = await Promise.all([
                getRequirementsByVersionId(versionId),
                getDefectsByVersionId(versionId),
            ]);

            if (reqResponse.code === 200) {
                setRequirements(reqResponse.data);
            }
            if (defectResponse.code === 200) {
                setBugs(defectResponse.data);
            }
        } catch (err) {
            console.error('获取需求和缺陷失败:', err);
            toast({ title: '获取数据失败', description: err.message });
        }
    };

    // 需求相关处理函数
    const handleCreateRequirement = async (requirementData) => {
        try {
            const response = await createRequirement(requirementData);
            if (response.code === 200) {
                setRequirements([...requirements, response.data]);
                toast({ title: '需求创建成功' });
            }
        } catch (error) {
            toast({ title: '需求创建失败', description: error.message });
        }
    };

    const handleUpdateRequirement = async (requirementData) => {
        try {
            const response = await updateRequirement(requirementData.id, requirementData);
            if (response.code === 200) {
                setRequirements(requirements.map((req) => (req.id === response.data.id ? response.data : req)));
                toast({ title: '需求更新成功' });
            }
        } catch (error) {
            toast({ title: '需求更新失败', description: error.message });
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
            }
        } catch (error) {
            toast({ title: '缺陷创建失败', description: error.message });
        }
    };

    const handleUpdateDefect = async (defectData) => {
        try {
            const response = await updateDefect(defectData.id, defectData);
            if (response.code === 200) {
                setBugs(bugs.map((bug) => (bug.id === response.data.id ? response.data : bug)));
                toast({ title: '缺陷更新成功' });
            }
        } catch (error) {
            toast({ title: '缺陷更新失败', description: error.message });
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

    const handleBack = () => {
        navigate(`/project/detail/${projectId}`);
    };

    const menuItems = [
        { id: 'info', icon: IconInfoCircle, label: '版本信息' },
        { id: 'requirements', icon: IconListCheck, label: '需求列表' },
        { id: 'bugs', icon: IconBug, label: '缺陷列表' },
    ];

    if (loading) return <div className="p-8">加载中...</div>;
    if (error) return <div className="p-8 text-red-500">{error}</div>;
    if (!version) return <div className="p-8">版本不存在</div>;

    return (
        <div className="flex h-screen">
            {/* 左侧导航栏 */}
            <div className="w-64 p-6 border-r">
                <div className="flex items-center space-x-2 mb-8">
                    <Button variant="ghost" size="icon" onClick={handleBack}>
                        <IconArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="scroll-m-20 text-xl font-semibold tracking-tight">{version?.versionNumber}</h1>
                </div>

                <nav className="space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={cn(
                                'w-full flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                                activeSection === item.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* 右侧内容区 */}
            <div className="flex-1 bg-[#fafafa] p-6 overflow-auto">
                {activeSection === 'info' && <VersionInfo version={version} />}

                {activeSection === 'requirements' && (
                    <RequirementList
                        requirements={requirements}
                        onStatusChange={handleRequirementStatusChange}
                        onDelete={handleDeleteRequirement}
                        onCreate={handleCreateRequirement}
                        onUpdate={handleUpdateRequirement}
                        versionId={versionId}
                        projectId={projectId}
                    />
                )}

                {activeSection === 'bugs' && (
                    <DefectList
                        defects={bugs}
                        onStatusChange={handleDefectStatusChange}
                        onDelete={handleDeleteDefect}
                        onCreate={handleCreateDefect}
                        onUpdate={handleUpdateDefect}
                        versionId={versionId}
                        projectId={projectId}
                    />
                )}
            </div>
        </div>
    );
};

export default VersionDetail;
