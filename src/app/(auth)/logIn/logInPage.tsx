"use client"

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { LogInData } from "@/lib/validator";
import { LogInSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LogInApi } from "./action";
import { toast } from "sonner";
import Link from "next/link";
import Loader from "@/lib/loader/loader";
import { GoogleUrl } from "../action.tsx/oauthContextUrl";

export default function LogInPageUi() {

    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | undefined>()
    const router = useRouter()

    const form = useForm<LogInData>({
        resolver: zodResolver(LogInSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    async function onSubmit(values: z.infer<typeof LogInSchema>) {
        setError(undefined)
        startTransition(async () => {
            try {
                const result = await LogInApi(values);
                if (result?.error) {
                    setError(result.error);
                    toast.error(result.error);
                } else {
                    toast.success("LogIn successfully!");
                    router.push("/")

                }
            } catch (err) {
                toast.error("Something went wrong. Please try again.");
            }
        });
    }

    async function handleSubmit() {
        setError(undefined)
        startTransition(async () => {
            try {
                const result = await GoogleUrl();
                if (result?.error) {
                    setError(result.error);
                    toast.error(result.error);
                } else {
                    if (result.url) {
                        window.location.href = result.url
                        toast.success("User login sucessfully ");
                        // console.log("redires0", result.url)
                    }
                }
            } catch (err) {
                toast.error("Something went wrong. Please try again.");
            }
        });
    }



    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email <span className="text-red-600">*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password <span className="text-red-600">*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div>
                        <Link href="/email">ForgotPassword
                        </Link>
                    </div>
                    <div className="flex flex-col gap-4">
                        <Button type="submit" className="w-full">{isPending ? "loading ... " : "Submit"}</Button>
                        <Button type="button" className="w-full" onClick={handleSubmit}>Login With Gmail</Button>
                    </div>

                    <Loader show={isPending} />

                </form>
            </Form>
        </>
    );
}