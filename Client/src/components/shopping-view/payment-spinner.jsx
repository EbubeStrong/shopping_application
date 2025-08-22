// import { useState, useEffect } from "react"
// import { Loader2, CheckCircle2 } from "lucide-react"
// import { Dialog, DialogContent } from "@/components/ui/dialog"
// import { motion, AnimatePresence } from "framer-motion"

// export function PaymentProcessingDialog() {
//   const [step, setStep] = useState(0)
//   const [open, setOpen] = useState(true) // ✅ start open immediately

//   useEffect(() => {
//     const timer1 = setTimeout(() => setStep(1), 2000)
//     const timer2 = setTimeout(() => setStep(2), 4000)
//     const timer3 = setTimeout(() => setOpen(false), 6000)

//     return () => {
//       clearTimeout(timer1)
//       clearTimeout(timer2)
//       clearTimeout(timer3)
//     }
//   }, []) // ✅ empty dependency = run once on mount

//   const messages = [
//     {
//       text: "Processing payment...",
//       icon: <Loader2 className="h-10 w-10 animate-spin text-primary" />,
//     },
//     {
//       text: "Verifying transaction...",
//       icon: <Loader2 className="h-10 w-10 animate-spin text-primary" />,
//     },
//     {
//       text: "Payment successful!",
//       icon: <CheckCircle2 className="h-10 w-10 text-green-600" />,
//     },
//   ]

//   return (
//     <Dialog open={open}>
//       <DialogContent className="flex flex-col items-center justify-center space-y-4 py-8 bg-white">
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={step}
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             transition={{ duration: 0.4 }}
//             className="flex flex-col items-center space-y-3"
//           >
//             {messages[step].icon}
//             <p className="text-lg font-medium">{messages[step].text}</p>
//             {step < 2 && (
//               <p className="text-sm text-muted-foreground">Please wait</p>
//             )}
//           </motion.div>
//         </AnimatePresence>
//       </DialogContent>
//     </Dialog>
//   )
// }




import { useState, useEffect } from "react"
import { Loader2, CheckCircle2 } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"

export function PaymentProcessingDialog({ forceOpen = false }) {
  const [step, setStep] = useState(0)
  const [open, setOpen] = useState(forceOpen) // start from prop if forced

  useEffect(() => {
    console.log("🔎 Checking spinner logic...")

    // If parent forces dialog, show immediately with timers
    if (forceOpen) {
      setOpen(true)
      const t1 = setTimeout(() => setStep(1), 600)
      const t2 = setTimeout(() => setStep(2), 1200)
      // Do not auto-close here; parent will navigate away
      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
      }
    }

    const currentUrl = window.location.href
    const lastShownUrl = sessionStorage.getItem("lastSpinnerUrl")

    console.log("➡️ currentUrl:", currentUrl)
    console.log("➡️ lastShownUrl:", lastShownUrl)

    const isPaypalReturn = currentUrl.includes("paypal-return")

    if (isPaypalReturn && lastShownUrl !== currentUrl) {
      console.log("✅ New PayPal redirect detected. Showing spinner...")

      setOpen(true)
      sessionStorage.setItem("lastSpinnerUrl", currentUrl)

      const timer1 = setTimeout(() => {
        console.log("⏱ step -> 1 (Verifying transaction...)")
        setStep(1)
      }, 3000)

      const timer2 = setTimeout(() => {
        console.log("⏱ step -> 2 (Payment successful!)")
        setStep(2)
      }, 4500)

      const timer3 = setTimeout(() => {
        console.log("⏹ Closing spinner after success")
        setOpen(false)
      }, 6500)

      return () => {
        console.log("🧹 Cleaning up timers...")
        clearTimeout(timer1)
        clearTimeout(timer2)
        clearTimeout(timer3)
      }
    } else {
      console.log("🚫 Spinner not shown (either not paypal-return or already shown for this URL).")
    }
  }, [forceOpen])

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
