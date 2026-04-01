export interface Mentor {
  id: string
  name: string
  role: string
  company: string
  avatar: string
  expertise: string[]
  price: number
  rating: number
  bio: string
}

export const mentors: Mentor[] = [
  {
    id: "1",
    name: "Alex Johnson",
    role: "Senior Software Engineer",
    company: "Google",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    expertise: ["Web Development", "System Design", "Career Growth"],
    price: 50,
    rating: 4.9,
    bio: "Passionate about building scalable systems and helping early-career developers reach their full potential.",
  },
  {
    id: "2",
    name: "Sarah Chen",
    role: "Product Manager",
    company: "Meta",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    expertise: ["Product Strategy", "User Research", "Agile"],
    price: 65,
    rating: 4.8,
    bio: "Experienced PM with a background in engineering, dedicated to helping people break into product management.",
  },
  {
    id: "3",
    name: "Michael Smith",
    role: "UX Designer",
    company: "Airbnb",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    expertise: ["Visual Design", "Prototyping", "UX Strategy"],
    price: 45,
    rating: 5.0,
    bio: "Design leader focused on creating beautiful, intuitive interfaces. I'll help you build an outstanding portfolio.",
  },
]
