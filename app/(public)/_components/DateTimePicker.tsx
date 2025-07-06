"use client"

import React, { useState } from "react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { ScrollArea } from "@/components/ui/scroll-area"

interface DateTimePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
}

export function DateTimePicker({ value, onChange }: DateTimePickerProps) {
  const today = new Date()
  const [date, setDate] = useState<Date>(value || today)
  const [time, setTime] = useState<string | null>(() => {
    if (value) {
      const hours = value.getHours().toString().padStart(2, '0')
      const minutes = value.getMinutes().toString().padStart(2, '0')
      return `${hours}:${minutes}`
    }
    return null
  })

  React.useEffect(() => {
    if (value) {
      setDate(value)
      const hours = value.getHours().toString().padStart(2, '0')
      const minutes = value.getMinutes().toString().padStart(2, '0')
      setTime(`${hours}:${minutes}`)
    }
  }, [value])

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate)
      setTime(null)

      if (time) {
        const [hours, minutes] = time.split(':').map(Number)
        const combinedDate = new Date(newDate)
        combinedDate.setHours(hours, minutes, 0, 0)
        onChange?.(combinedDate)
      } else {
        onChange?.(newDate)
      }
    }
  }

  const handleTimeSelect = (selectedTime: string) => {
    setTime(selectedTime)
    const [hours, minutes] = selectedTime.split(':').map(Number)
    const combinedDate = new Date(date)
    combinedDate.setHours(hours, minutes, 0, 0)
    onChange?.(combinedDate)
  }

  // Check if a time slot should be available
  const isTimeSlotAvailable = (timeSlot: string) => {
    const isToday = date.toDateString() === today.toDateString()

    if (!isToday) {
      return true // All times are available for future dates
    }

    const [hours, minutes] = timeSlot.split(':').map(Number)
    const slotTime = new Date(today)
    slotTime.setHours(hours, minutes, 0, 0)

    // Add 15 minutes buffer to current time to allow for some flexibility
    const bufferTime = new Date(today.getTime() + 15 * 60 * 1000)

    return slotTime >= bufferTime
  }

  const timeSlots = [
    "00:00", "00:15", "00:30", "00:45",
    "01:00", "01:15", "01:30", "01:45",
    "02:00", "02:15", "02:30", "02:45",
    "03:00", "03:15", "03:30", "03:45",
    "04:00", "04:15", "04:30", "04:45",
    "05:00", "05:15", "05:30", "05:45",
    "06:00", "06:15", "06:30", "06:45",
    "07:00", "07:15", "07:30", "07:45",
    "08:00", "08:15", "08:30", "08:45",
    "09:00", "09:15", "09:30", "09:45",
    "10:00", "10:15", "10:30", "10:45",
    "11:00", "11:15", "11:30", "11:45",
    "12:00", "12:15", "12:30", "12:45",
    "13:00", "13:15", "13:30", "13:45",
    "14:00", "14:15", "14:30", "14:45",
    "15:00", "15:15", "15:30", "15:45",
    "16:00", "16:15", "16:30", "16:45",
    "17:00", "17:15", "17:30", "17:45",
    "18:00", "18:15", "18:30", "18:45",
    "19:00", "19:15", "19:30", "19:45",
    "20:00", "20:15", "20:30", "20:45",
    "21:00", "21:15", "21:30", "21:45",
    "22:00", "22:15", "22:30", "22:45",
    "23:00", "23:15", "23:30", "23:45",
  ]

  return (
    <div className="w-fit">
      <div className="rounded-md border">
        <div className="flex max-sm:flex-col">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            className="p-2 sm:pe-5"
            disabled={[
              { before: today }
            ]}
          />
          <div className="relative w-full max-sm:h-48 sm:w-40">
            <div className="absolute inset-0 py-4 max-sm:border-t">
              <ScrollArea className="h-full sm:border-s">
                <div className="space-y-3">
                  <div className="flex h-5 shrink-0 items-center px-5">
                    <p className="text-sm font-medium">
                      {format(date, "EEEE, d")}
                    </p>
                  </div>
                  <div className="grid gap-1.5 px-5 max-sm:grid-cols-2">
                    {timeSlots.map((timeSlot) => {
                      const available = isTimeSlotAvailable(timeSlot)
                      return (
                        <Button
                          key={timeSlot}
                          variant={time === timeSlot ? "default" : "outline"}
                          size="sm"
                          className="min-w-0"
                          onClick={() => handleTimeSelect(timeSlot)}
                          disabled={!available}
                          type="button"
                        >
                          {timeSlot}
                        </Button>
                      )
                    })}
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
