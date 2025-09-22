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
                    <Button type="submit" >{isPending ? "loading ... " : "Submit"}</Button>
                </form>
            </Form>
        </>
    );
}