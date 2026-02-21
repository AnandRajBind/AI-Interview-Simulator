import api from './api';

export const interviewService = {
  startInterview: async (domain, difficulty) => {
    const response = await api.post('/interviews/start', { domain, difficulty });
    return response.data;
  },

  submitInterview: async (interviewId, answers) => {
    const response = await api.post('/interviews/submit', { interviewId, answers });
    return response.data;
  },

  getInterviewHistory: async () => {
    const response = await api.get('/interviews/history');
    return response.data;
  }
};
