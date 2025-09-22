"use client"

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { VerifyEmailData } from "@/lib/validator";
import { VerifyEmailSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function VerifyEmailUi() {

    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | undefined>()
    const router = useRouter()

    const form = useForm<VerifyEmailData>({
        resolver: zodResolver(VerifyEmailSchema),
        defaultValues: {
            email: "",

        },
    })

    async function onSubmit(values: z.infer<typeof VerifyEmailSchema>) {
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
                    <Button type="submit" className="w-full" >{isPending ? "loading ... " : "Submit"}</Button>
                </form>
            </Form>
        </>
    );
}