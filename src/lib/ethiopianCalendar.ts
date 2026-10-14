export interface EthiopianDate {
  year: number
  month: number
  day: number
  monthName: string
  monthNameEn: string
  geezDay: string
  geezYear: string
  formatted: string
  weekdayNameAm?: string
  weekdayNameEn?: string
  weekdayShortAm?: string
  weekdayShortEn?: string
}

export interface EthiopianMonthInfo {
  id: number
  nameAm: string
  nameEn: string
  totalDays: (year: number) => number
}

export interface DayChipInfo {
  year: number
  month: number
  day: number
  geezDay: string
  dayNameAm: string
  dayNameEn: string
  dayShortAm: string
  dayShortEn: string
  monthNameAm: string
  monthNameEn: string
  isToday: boolean
  isSelected: boolean
}

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

export const ETHIOPIAN_WEEKDAYS = [
  { id: 0, nameAm: 'እሑድ', shortAm: 'እሑድ', nameEn: 'Sunday', shortEn: 'Sun' },
  { id: 1, nameAm: 'ሰኞ', shortAm: 'ሰኞ', nameEn: 'Monday', shortEn: 'Mon' },
  { id: 2, nameAm: 'ማክሰኞ', shortAm: 'ማክሰ', nameEn: 'Tuesday', shortEn: 'Tue' },
  { id: 3, nameAm: 'ረቡዕ', shortAm: 'ረቡዕ', nameEn: 'Wednesday', shortEn: 'Wed' },
  { id: 4, nameAm: 'ሐሙስ', shortAm: 'ሐሙስ', nameEn: 'Thursday', shortEn: 'Thu' },
  { id: 5, nameAm: 'ዓርብ', shortAm: 'ዓርብ', nameEn: 'Friday', shortEn: 'Fri' },
  { id: 6, nameAm: 'ቅዳሜ', shortAm: 'ቅዳሜ', nameEn: 'Saturday', shortEn: 'Sat' },
]

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

  if (num < 10) return ones[num]
  if (num < 100) {
    const t = Math.floor(num / 10) * 10
    const o = num % 10
    return (tens[t] || '') + (o > 0 ? ones[o] : '')
  }

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

function gregorianToJDN(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12)
  const y = year + 4800 - a
  const m = month + 12 * a - 3
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045
}

export function jdnToGregorian(jdn: number): { year: number; month: number; day: number } {
  const a = jdn + 32044
  const b = Math.floor((4 * a + 3) / 146097)
  const c = a - Math.floor((146097 * b) / 4)
  const d = Math.floor((4 * c + 3) / 1461)
  const e = c - Math.floor((1461 * d) / 4)
  const m = Math.floor((5 * e + 2) / 153)
  const day = e - Math.floor((153 * m + 2) / 5) + 1
  const month = m + 3 - 12 * Math.floor(m / 10)
  const year = 100 * b + d - 4800 + Math.floor(m / 10)
  return { year, month, day }
}

export function jdnToEthiopian(jdn: number): { 
  year: number; 
  month: number; 
  day: number; 
  monthNameAm: string; 
  monthNameEn: string;
} {
  const r = (jdn - 1723856) % 1461
  const n = (r % 365) + 365 * Math.floor(r / 1460)
  const year = 4 * Math.floor((jdn - 1723856) / 1461) + Math.floor(r / 365) - Math.floor(r / 1460)
  const month = Math.floor(n / 30) + 1
  const day = (n % 30) + 1
  const monthInfo = ETHIOPIAN_MONTHS[month - 1] || ETHIOPIAN_MONTHS[0]
  return { 
    year, 
    month, 
    day, 
    monthNameAm: monthInfo.nameAm, 
    monthNameEn: monthInfo.nameEn 
  }
}

export function ethiopianToJDN(year: number, month: number, day: number): number {
  return 1723856 + 365 * year + Math.floor(year / 4) + 30 * (month - 1) + day - 1
}

export function getWeekdayFromJDN(jdn: number) {
  const dayIndex = (jdn + 1) % 7
  return ETHIOPIAN_WEEKDAYS[dayIndex] || ETHIOPIAN_WEEKDAYS[0]
}

export function gregorianToEthiopian(date: Date = new Date()): EthiopianDate {
  const gYear = date.getFullYear()
  const gMonth = date.getMonth() + 1
  const gDay = date.getDate()

  const jdn = gregorianToJDN(gYear, gMonth, gDay)
  const { year, month, day } = jdnToEthiopian(jdn)
  const weekday = getWeekdayFromJDN(jdn)

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
    formatted: `${monthInfo.nameAm} ${geezDay} (${day}) ቀን ${year} ዓ.ም`,
    weekdayNameAm: weekday.nameAm,
    weekdayNameEn: weekday.nameEn,
    weekdayShortAm: weekday.shortAm,
    weekdayShortEn: weekday.shortEn
  }
}

export function getTodayEthiopian(): EthiopianDate {
  return gregorianToEthiopian(new Date())
}

export function getSurroundingDays(
  currentYear: number,
  currentMonth: number,
  currentDay: number,
  offsetRange: number = 3
): DayChipInfo[] {
  const currentJDN = ethiopianToJDN(currentYear, currentMonth, currentDay)
  const today = getTodayEthiopian()
  const todayJDN = ethiopianToJDN(today.year, today.month, today.day)

  const chips: DayChipInfo[] = []
  for (let offset = -offsetRange; offset <= offsetRange; offset++) {
    const targetJDN = currentJDN + offset
    const { year, month, day } = jdnToEthiopian(targetJDN)
    const weekday = getWeekdayFromJDN(targetJDN)
    const monthInfo = ETHIOPIAN_MONTHS[month - 1] || ETHIOPIAN_MONTHS[0]

    chips.push({
      year,
      month,
      day,
      geezDay: numberToGeez(day),
      dayNameAm: weekday.nameAm,
      dayNameEn: weekday.nameEn,
      dayShortAm: weekday.shortAm,
      dayShortEn: weekday.shortEn,
      monthNameAm: monthInfo.nameAm,
      monthNameEn: monthInfo.nameEn,
      isToday: targetJDN === todayJDN,
      isSelected: offset === 0
    })
  }

  return chips
}
