"use client"

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ChangePasswordData, ChangePasswordSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function VerifyEmailUi() {

    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | undefined>()
    const router = useRouter()

    const form = useForm<ChangePasswordData>({
        resolver: zodResolver(ChangePasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: ""
        },
    })

    async function onSubmit(values: z.infer<typeof ChangePasswordSchema>) {
        setError(undefined)
        startTransition(async () => {
            try {
                // const result = await LogInApi(values);
                // if (result?.error) {
                //     setError(result.error);
                //     toast.error(result.error);
                // } else {
                //     toast.success("LogIn successfully!");
                //     router.push("/")

                // }
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
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password <span className="text-red-600">*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="password"  {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password
                                    <span className="text-red-600">*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="confirmPassword" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem >
                        )
                        }
                    />
                    < Button type="submit" > {isPending ? "loading ... " : "Submit"}</Button >
                </form >
            </Form >
        </>
    );
}