import { useToast, Toast, ToastTitle, ToastDescription } from "@/components/ui/toast";

export const FIRE_TOAST = (toast, action = "info", verient = "solid", title = "Notice", message = "This is a toast message") => {
    const newId = Math.random();

    toast.show({
        id: newId,
        placement: "top",
        duration: 3000,
        render: ({ id }) => {
            const uniqueToastId = "toast-" + id;
            return (
                <Toast nativeID={uniqueToastId} action={action} variant={verient}>
                    {title && <ToastTitle>{title}</ToastTitle>}
                    {message && <ToastDescription>{message}</ToastDescription>}
                </Toast>
            );
        },
    });
};
