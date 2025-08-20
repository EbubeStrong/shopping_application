import { useState, useEffect } from "react"
import { Loader2, CheckCircle2 } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"

export function PaymentProcessingDialog() {
  const [step, setStep] = useState(0)
  const [open, setOpen] = useState(false) // start closed

  useEffect(() => {
    // Check if spinner has already been shown in this session
    const hasShown = sessionStorage.getItem("spinnerShown")

    if (!hasShown) {
      setOpen(true) // show spinner
      sessionStorage.setItem("spinnerShown", "true") // mark as shown

      const timer1 = setTimeout(() => setStep(1), 2000)
      const timer2 = setTimeout(() => setStep(2), 4000)
      const timer3 = setTimeout(() => setOpen(false), 6000)

      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
        clearTimeout(timer3)
      }
    }
  }, [])

  const messages = [
    {
      text: "Processing payment...",
      icon: <Loader2 className="h-10 w-10 animate-spin text-primary" />,
    },
    {
      text: "Verifying transaction...",
      icon: <Loader2 className="h-10 w-10 animate-spin text-primary" />,
    },
    {
      text: "Payment successful!",
      icon: <CheckCircle2 className="h-10 w-10 text-green-600" />,
    },
  ]

  return (
    <Dialog open={open}>
      <DialogContent className="flex flex-col items-center justify-center space-y-4 py-8 bg-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center space-y-3"
          >
            {messages[step].icon}
            <p className="text-lg font-medium">{messages[step].text}</p>
            {step < 2 && (
              <p className="text-sm text-muted-foreground">Please wait</p>
            )}
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
