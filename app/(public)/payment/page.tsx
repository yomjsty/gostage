'use client'

import { notFound, useSearchParams } from 'next/navigation'
import { PaymentSuccess } from "./_components/PaymentSuccess"
import { PaymentFailed } from "./_components/PaymentFailed"
import { Suspense } from "react"

export default function PaymentRoute() {
    return (
        <Suspense>
            <PaymentPage />
        </Suspense>
    )
}

function PaymentPage() {
    const searchParams = useSearchParams()
    const result = searchParams.get('result')

    return (
        <div>
            {result === 'success' && (
                <PaymentSuccess />
            )}
            {result === 'failed' && (
                <PaymentFailed />
            )}
            {!result && notFound()}
        </div>
    )
}
