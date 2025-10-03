"use client"

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Register } from "@/lib/validator";
import { SignInSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { SignUp } from "./action";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Loader from "@/lib/loader/loader";

export default function Register() {

    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | undefined>()
    const router = useRouter()

    const form = useForm<Register>({
        resolver: zodResolver(SignInSchema),
        defaultValues: {
            username: "",
            email: "",
            password: ""
        },
    })

    async function onSubmit(values: z.infer<typeof SignInSchema>) {
        setError(undefined)
        startTransition(async () => {
            try {
                const result = await SignUp(values);
                if (result?.error) {
                    setError(result.error);
                    toast.error(result.error);
                } else {
                    toast.success("Account created successfully!");
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
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username <span className="text-red-600">*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="Username" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                    <Loader show={isPending} />

                </form>
            </Form>
        </>
    );
}