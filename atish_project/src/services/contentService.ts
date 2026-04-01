import { streams } from "../data/streams";
import { departments } from "../data/departments";
import { jobs } from "../data/jobs";
import { courseComparisons } from "../data/courseComparisons";
import { quizQuestions } from "../data/quizQuestions";

export const contentService = {
  getStreams: async () => streams,
  getDepartments: async () => departments,
  getDepartmentById: async (id: string) => departments.find((d) => d.id === id),
  getFutureJobs: async () => jobs,
  getCourseComparisons: async () => courseComparisons,
  getQuizQuestions: async () => quizQuestions,
};
