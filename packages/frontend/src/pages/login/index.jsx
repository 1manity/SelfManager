import React, {useState} from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import {login} from "@/api/user/auth.js";
import {useToast} from "@/hooks/use-toast.js";
import {ToastAction} from "@/components/ui/toast.jsx";

export default function Login() {
    const navigate = useNavigate()
    const { toast } = useToast()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (event) => {
        event.preventDefault()
        // 在这里处理登录逻辑
        console.log("Login submitted")
        // 登录成功后导航到主页
        // navigate("/")
        try {
            const result = await login(username, password).then(res => {
                console.log(res)
                if (res.code === 200) {
                    navigate("/dashboard")
                    toast({
                        title: "登录成功😀",
                    })
                }
                // throw res
            })
        } catch (e) {
            console.log(e)
            if(e.code === 'ERR_BAD_REQUEST')
                toast({
                    title: '用户名或密码错误🤨',
                })
            else
                toast({
                    title: '未知错误🤨',
                })
        }

    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">登录</CardTitle>
                    <CardDescription className="text-center">
                        输入您的账号和密码登录
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2 flex justify-center items-center">
                            <Label htmlFor="username" className="w-20">用户名</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="请输入用户名"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2 flex justify-center items-center">
                            <Label htmlFor="password" className="w-20">密码</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="请输入密码"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Button type="submit" className={"w-full mt-4"}>
                                登录
                            </Button>

                        </div>

                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button variant="link" onClick={() => navigate("/forgot-password")}>
                        忘记密码？
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
