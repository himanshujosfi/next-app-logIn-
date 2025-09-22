"use client"

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { ForgotData } from "@/lib/validator";
import { ForgotSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ForgotPageUi() {

    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | undefined>()
    const router = useRouter()

    const form = useForm<ForgotData>({
        resolver: zodResolver(ForgotSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    })

    async function onSubmit(values: z.infer<typeof ForgotSchema>) {
        setError(undefined)
        startTransition(async () => {
            try {
                const result = (values);
                // if (result?.error) {
                //     setError(result.error);
                //     toast.error(result.error);
                // } else {
                //     toast.success("Account created successfully!");
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
                                    <Input placeholder="Password" {...field} />
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
                                <FormLabel>confirmPassword <span className="text-red-600">*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="confirmPassword" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" >{isPending ? "loading ... " : "Submit"}</Button>
                </form>
            </Form>
        </>
    );
}