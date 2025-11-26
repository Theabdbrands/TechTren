import { Toaster as SonnerToaster } from 'sonner'

export function Toaster() {

  return (
    <SonnerToaster
      position="bottom-center"
      closeButton={false}
      duration={3000}
      toastOptions={{
        classNames: {
          toast:
            'bg-white/10 glass !bg-white/40 group toast group-[.toaster]:bg-primary/90 group-[.toaster]:shadow-xl backdrop-blur-md px-6 !border-0',

          description: '!text-primary-foreground/80 glass',

          actionButton:
            '!bg-primary-foreground/10 glass group-[.toast]:text-primary-foreground hover:group-[.toast]:bg-primary-foreground/30',

          cancelButton: '!bg-muted/10 glass group-[.toast]:text-muted-foreground',

          success:
            '!bg-white/20 glass group-[.toaster]:text-primary-foreground',

          error:
            '!bg-red-200/10 glass group-[.toaster]:text-destructive-foreground',

          info: '!bg-blue-300/10 glass group-[.toaster]:text-white',

          warning:
            '!bg-amber-300/10 glass group-[.toaster]:text-white',
        },
      }}
    />
  )
}
