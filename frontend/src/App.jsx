import React, { useState } from 'react'
import { DateRange } from 'react-date-range'
import { addDays, differenceInCalendarDays } from 'date-fns'
import { motion } from 'framer-motion'

const PRICE_PER_PET_PER_DAY = 15

export default function App() {
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    petType: 'Dog',
    petCount: 1,
    dailyTime: '',
    description: '',
    email: '',
    phone: ''
  })

  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: 'selection'
    }
  ])

  const days =
    differenceInCalendarDays(
      dateRange[0].endDate,
      dateRange[0].startDate
    ) + 1

  const estimatedCost =
    days > 0 ? days * form.petCount * PRICE_PER_PET_PER_DAY : 0

  const submit = async () => {
    await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        startDate: dateRange[0].startDate,
        endDate: dateRange[0].endDate,
        estimatedCost
      })
    })

    setSuccess(true)
  }

  /* ================= SUCCESS SCREEN ================= */
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 to-sky-100">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl p-12 shadow-xl text-center max-w-md"
        >
          <h1 className="text-3xl font-semibold mb-4">
            Booking received 🐾
          </h1>
          <p className="text-slate-600 mb-6">
            Thank you! We’ve received your request and will contact you
            shortly.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-xl bg-emerald-500 text-white hover:scale-105 transition"
          >
            Make another booking
          </button>
        </motion.div>
      </div>
    )
  }

  /* ================= MAIN UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-teal-100 to-sky-100">
      {/* Header */}
      <header className="flex items-center gap-4 px-10 py-6">
        <img
          src="kobi mei.png"
          alt="Logo"
          className="w-12 h-12 rounded-full"
        />
        <span className="text-xl font-semibold text-slate-700">
          Wee Care
        </span>
      </header>

      {/* Card */}
      <div className="flex justify-center px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl p-10 space-y-10"
        >
          <h1 className="text-3xl font-semibold text-slate-800">
            Book Pet Care 🐶🐱
          </h1>

          {/* Pet Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-2 gap-6"
          >
            <div>
              <label className="label">Pet type</label>
              <select
                className="input"
                value={form.petType}
                onChange={(e) =>
                  setForm({ ...form, petType: e.target.value })
                }
              >
                <option>Dog</option>
                <option>Cat</option>
              </select>
            </div>

            <div>
              <label className="label">Number of pets</label>
              <input
                type="number"
                min="1"
                className="input"
                value={form.petCount}
                onChange={(e) =>
                  setForm({ ...form, petCount: +e.target.value })
                }
              />
            </div>
          </motion.div>

          {/* Date Range Picker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <label className="label">Service duration</label>
            <div className="rounded-2xl overflow-hidden border border-slate-200">
              <DateRange
                ranges={dateRange}
                onChange={(item) =>
                  setDateRange([item.selection])
                }
                minDate={new Date()}
                rangeColors={['#10b981']}
              />
            </div>
            <p className="text-sm text-slate-500 mt-2">
              {days} day service selected
            </p>
          </motion.div>

          {/* Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <label className="label">Daily visit time</label>
            <input
              className="input"
              placeholder="e.g. 9:00 AM – 10:00 AM"
              onChange={(e) =>
                setForm({ ...form, dailyTime: e.target.value })
              }
            />
          </motion.div>

          {/* Notes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <label className="label">Additional notes</label>
            <textarea
              rows="4"
              className="input resize-none"
              placeholder="Feeding instructions, temperament, special care..."
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-2 gap-6"
          >
            <input
              className="input"
              placeholder="Email address"
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
            <input
              className="input"
              placeholder="Phone number"
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />
          </motion.div>

          {/* Cost */}
          <div className="flex items-center justify-between bg-emerald-50 rounded-2xl p-5">
            <span className="text-slate-700 font-medium">
              Estimated cost
            </span>
            <span className="text-2xl font-semibold text-emerald-600">
              ${estimatedCost}
            </span>
          </div>

          {/* Submit */}
          <button
            onClick={submit}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-lg font-medium
                       hover:scale-[1.02] active:scale-[0.98] transition"
          >
            Submit Order
          </button>
        </motion.div>
      </div>
    </div>
  )
}
