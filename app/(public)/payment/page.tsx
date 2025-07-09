'use client'

import { notFound, useSearchParams } from 'next/navigation'
import { PaymentSuccess } from "./_components/PaymentSuccess"
import { PaymentFailed } from "./_components/PaymentFailed"


export default function PaymentPage() {
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
