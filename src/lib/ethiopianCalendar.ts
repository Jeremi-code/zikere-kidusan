/**
 * Ethiopian Calendar (የኢትዮጵያ ዘመን አቆጣጠር) Utility
 * 
 * Provides conversion between Gregorian and Ethiopian calendars,
 * Ethiopian month names, Ge'ez numerals, and today's date calculation.
 */

export interface EthiopianDate {
  year: number
  month: number // 1 to 13
  day: number   // 1 to 30 (or 1 to 5/6 for Pagumen)
  monthName: string
  monthNameEn: string
  geezDay: string
  geezYear: string
  formatted: string
}

export interface EthiopianMonthInfo {
  id: number
  nameAm: string
  nameEn: string
  totalDays: (year: number) => number
}

// The 13 Ethiopian Months
export const ETHIOPIAN_MONTHS: EthiopianMonthInfo[] = [
  { id: 1,  nameAm: 'መስከረም', nameEn: 'Meskerem', totalDays: () => 30 },
  { id: 2,  nameAm: 'ጥቅምት',  nameEn: 'Tikimt',   totalDays: () => 30 },
  { id: 3,  nameAm: 'ኅዳር',   nameEn: 'Hidar',    totalDays: () => 30 },
  { id: 4,  nameAm: 'ታኅሣሥ',  nameEn: 'Tahsas',   totalDays: () => 30 },
  { id: 5,  nameAm: 'ጥር',    nameEn: 'Tir',      totalDays: () => 30 },
  { id: 6,  nameAm: 'የካቲት',  nameEn: 'Yekatit',  totalDays: () => 30 },
  { id: 7,  nameAm: 'መጋቢት',  nameEn: 'Megabit',  totalDays: () => 30 },
  { id: 8,  nameAm: 'ሚያዝያ',  nameEn: 'Miyazya',  totalDays: () => 30 },
  { id: 9,  nameAm: 'ግንቦት',  nameEn: 'Ginbot',   totalDays: () => 30 },
  { id: 10, nameAm: 'ሰኔ',    nameEn: 'Sene',     totalDays: () => 30 },
  { id: 11, nameAm: 'ሐምሌ',   nameEn: 'Hamle',    totalDays: () => 30 },
  { id: 12, nameAm: 'ነሐሴ',   nameEn: 'Nehase',   totalDays: () => 30 },
  { id: 13, nameAm: 'ጳጉሜን',  nameEn: 'Pagumen',  totalDays: (year) => (year % 4 === 3 ? 6 : 5) },
]

/**
 * Converts an integer into Ge'ez numerals (የግዕዝ ቁጥሮች)
 * e.g., 1 -> ፩, 23 -> ፳፫, 2019 -> ፳፻፲፱
 */
export function numberToGeez(num: number): string {
  if (num <= 0) return num.toString()

  const ones: { [key: number]: string } = {
    1: '፩', 2: '፪', 3: '፫', 4: '፬', 5: '፭',
    6: '፮', 7: '፯', 8: '፰', 9: '፱'
  }
  const tens: { [key: number]: string } = {
    10: '፲', 20: '፳', 30: '፴', 40: '፵', 50: '፶',
    60: '፷', 70: '፸', 80: '፹', 90: '፺'
  }

  // Handle numbers 1 - 99
  if (num < 10) return ones[num]
  if (num < 100) {
    const t = Math.floor(num / 10) * 10
    const o = num % 10
    return (tens[t] || '') + (o > 0 ? ones[o] : '')
  }

  // Handle numbers 100 - 9999
  const hundred = '፻'
  const tenThousand = '፼'

  if (num < 10000) {
    const h = Math.floor(num / 100)
    const rem = num % 100
    const prefix = h === 1 ? '' : numberToGeez(h)
    const suffix = rem > 0 ? numberToGeez(rem) : ''
    return prefix + hundred + suffix
  }

  const tt = Math.floor(num / 10000)
  const rem = num % 10000
  const prefix = numberToGeez(tt) + tenThousand
  const suffix = rem > 0 ? numberToGeez(rem) : ''
  return prefix + suffix
}

/**
 * Calculates Julian Day Number (JDN) from Gregorian date.
 */
function gregorianToJDN(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12)
  const y = year + 4800 - a
  const m = month + 12 * a - 3
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045
}

/**
 * Converts Julian Day Number to Ethiopian date.
 */
function jdnToEthiopian(jdn: number): { year: number; month: number; day: number } {
  const r = (jdn - 1723856) % 1461
  const n = (r % 365) + 365 * Math.floor(r / 1460)
  const year = 4 * Math.floor((jdn - 1723856) / 1461) + Math.floor(r / 365) - Math.floor(r / 1460)
  const month = Math.floor(n / 30) + 1
  const day = (n % 30) + 1
  return { year, month, day }
}

/**
 * Converts a JS Date object (Gregorian) to EthiopianDate.
 */
export function gregorianToEthiopian(date: Date = new Date()): EthiopianDate {
  const gYear = date.getFullYear()
  const gMonth = date.getMonth() + 1
  const gDay = date.getDate()

  const jdn = gregorianToJDN(gYear, gMonth, gDay)
  const { year, month, day } = jdnToEthiopian(jdn)

  const monthInfo = ETHIOPIAN_MONTHS[month - 1] || ETHIOPIAN_MONTHS[0]
  const geezDay = numberToGeez(day)
  const geezYear = numberToGeez(year)

  return {
    year,
    month,
    day,
    monthName: monthInfo.nameAm,
    monthNameEn: monthInfo.nameEn,
    geezDay,
    geezYear,
    formatted: `${monthInfo.nameAm} ${geezDay} (${day}) ቀን ${year} ዓ.ም`
  }
}

/**
 * Gets today's date in the Ethiopian Calendar.
 */
export function getTodayEthiopian(): EthiopianDate {
  return gregorianToEthiopian(new Date())
}
