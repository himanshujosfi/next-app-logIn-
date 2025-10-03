"use client";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ChangePasswordData, ChangePasswordSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ResetPassword } from "../action.tsx/resetPassword";
import { useSearchParams, useRouter } from "next/navigation";
import { z } from "zod";
import Loader from "@/lib/loader/loader";

export default function ResetPasswordUi() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>();
    const searchParams = useSearchParams();
    const router = useRouter();

    const token = searchParams.get("token");

    const form = useForm<ChangePasswordData>({
        resolver: zodResolver(ChangePasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(values: z.infer<typeof ChangePasswordSchema>) {
        setError(undefined);

        if (values.password !== values.confirmPassword) {
            setError("Passwords do not match");
            toast.error("Passwords do not match");
            return;
        }
        if (!token) {
            setError("Invalid or missing token.");
            toast.error("Invalid or missing token.");
            return;
        }
        startTransition(async () => {
            try {
                const result = await ResetPassword(token, values.password);

                if (result?.error) {
                    setError(result.error);
                    toast.error(result.error);
                } else {
                    toast.success("Password reset successfully!");
                    router.push("/login");
                }
            } catch (err) {
                toast.error("Something went wrong. Please try again.");
            }
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                New Password <span className="text-red-600">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="New password" {...field} />
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
                            <FormLabel>
                                Confirm Password <span className="text-red-600">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="Confirm password"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isPending}>
                    {isPending ? "Loading..." : "Submit"}
                </Button>
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <Loader show={isPending} />

            </form>
        </Form>
    );
}
