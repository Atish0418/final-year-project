export interface ResumeData {
  personalDetails: {
    fullName: string
    email: string
    phone: string
    location: string
    website: string
    linkedin: string
  }
  summary: string
  experience: Array<{
    id: string
    company: string
    position: string
    startDate: string
    endDate: string
    current: boolean
    description: string
  }>
  education: Array<{
    id: string
    institution: string
    degree: string
    field: string
    startDate: string
    endDate: string
    gpa?: string
  }>
  skills: Array<{
    id: string
    category: string
    items: string[]
  }>
}
