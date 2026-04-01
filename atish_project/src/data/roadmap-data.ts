import { Cpu } from "lucide-react";

export const dummyRoadmap = {
  id: "frontend-developer",
  title: "Frontend Developer",
  description: "A comprehensive roadmap to become a frontend developer.",
  icon: Cpu,
  difficulty: "Intermediate",
  duration: "3 months",
  progress: 33,
  color: "bg-blue-500",
  students: 12345,
  steps: [
    {
      id: 1,
      title: "HTML & CSS",
      description: "Master the fundamentals of web structure and styling.",
      completed: true,
      duration: "2 weeks",
    },
    {
      id: 2,
      title: "JavaScript",
      description: "Learn the core language of the web.",
      completed: true,
      duration: "4 weeks",
    },
    {
      id: 3,
      title: "React.js",
      description: "Build dynamic user interfaces with this popular library.",
      completed: false,
      duration: "6 weeks",
    },
    {
      id: 4,
      title: "Next.js",
      description: "Explore server-side rendering and more with this React framework.",
      completed: false,
      duration: "3 weeks",
    },
  ],
};