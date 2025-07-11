import { toast as sonnerToast } from "sonner";
import { X, CircleCheck, XCircle, CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export const toast = Object.assign(sonnerToast, {
  success: (message: string) => {
    sonnerToast.custom((t) => (
      <div className="flex items-center justify-between gap-4 w-full max-w-sm p-3 rounded-xl shadow-xl bg-zinc-900 border border-zinc-800">
        <div className="flex items-center justify-center gap-3">
          <div
            className="bg-green-600 flex items-center justify-center rounded-full p-1.5"
            style={{
              boxShadow: '0 0 10px 3px rgba(34, 197, 94, 0.6), 0 0 30px 5px rgba(34, 197, 94, 0.3)',
            }}
          >
            <CircleCheck className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm text-white">{message}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-zinc-400 hover:text-zinc-400 hover:bg-transparent cursor-pointer transition-transform duration-200 ease-out hover:scale-110"
          onClick={() => toast.dismiss(t)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    ));
  },
  warning: (message: string) => {
    sonnerToast.custom((t) => (
      <div className="flex items-center justify-between gap-4 w-full max-w-sm p-3 rounded-xl shadow-xl bg-zinc-900 border border-zinc-800">
        <div className="flex items-center justify-center gap-3">
          <div
            className="bg-yellow-500 flex items-center justify-center rounded-full p-1.5"
            style={{
              boxShadow:
                "0 0 10px 3px rgba(234, 179, 8, 0.6), 0 0 30px 5px rgba(234, 179, 8, 0.3)",
            }}
          >
            <CircleAlert className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm text-white">{message}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-zinc-400 hover:text-zinc-400 hover:bg-transparent cursor-pointer transition-transform duration-200 ease-out hover:scale-110"
          onClick={() => toast.dismiss(t)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    ));
  },
  error: (message: string) => {
    sonnerToast.custom((t) => (
      <div className="flex items-center justify-between gap-4 w-full max-w-sm p-3 rounded-xl shadow-xl bg-zinc-900 border border-zinc-800">
        <div className="flex items-center justify-center gap-3">
          <div
            className="bg-red-600 flex items-center justify-center rounded-full p-1.5"
            style={{
              boxShadow:
                "0 0 10px 3px rgba(220, 38, 38, 0.6), 0 0 30px 5px rgba(220, 38, 38, 0.3)",
            }}
          >
            <XCircle className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm text-white">{message}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-zinc-400 hover:text-zinc-400 hover:bg-transparent cursor-pointer transition-transform duration-200 ease-out hover:scale-110"
          onClick={() => toast.dismiss(t)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    ));
  },
});


