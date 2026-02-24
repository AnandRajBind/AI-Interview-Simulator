/**
 * Mock AI Service for Development/Testing
 * Use when you don't have OpenAI credits
 */

const mockQuestions = {
  'JavaScript': {
    easy: [
      "What is the difference between let, const, and var?",
      "Explain JavaScript closures with an example.",
      "What is the event loop in JavaScript?",
      "How does 'this' keyword work in JavaScript?",
      "What are arrow functions and how are they different from regular functions?"
    ],
    medium: [
      "Explain the prototype chain in JavaScript.",
      "What is the difference between call, apply, and bind?",
      "How do you implement debouncing in JavaScript?",
      "Explain promises and async/await.",
      "What are JavaScript generators and when would you use them?"
    ],
    hard: [
      "Implement a deep clone function for nested objects.",
      "Explain JavaScript's memory management and garbage collection.",
      "How would you implement your own Promise from scratch?",
      "Describe the module pattern and its variations.",
      "Implement a function to flatten a deeply nested array."
    ]
  },
  'React': {
    easy: [
      "What is JSX and how does it work?",
      "Explain the difference between state and props.",
      "What are React Hooks? Name a few common ones.",
      "How do you handle events in React?",
      "What is the virtual DOM?"
    ],
    medium: [
      "Explain useEffect hook and its cleanup function.",
      "What is prop drilling and how can you avoid it?",
      "How does React's reconciliation algorithm work?",
      "Explain the difference between controlled and uncontrolled components.",
      "What are higher-order components (HOCs)?"
    ],
    hard: [
      "How would you optimize a React application's performance?",
      "Explain React's fiber architecture.",
      "Implement a custom Hook for data fetching with caching.",
      "How does React's concurrent mode work?",
      "Explain the differences between class and functional components lifecycle."
    ]
  },
  'Node.js': {
    easy: [
      "What is Node.js and why is it popular?",
      "Explain the difference between Node.js and browser JavaScript.",
      "What is NPM and what does it do?",
      "How do you import modules in Node.js?",
      "What is the purpose of package.json?"
    ],
    medium: [
      "Explain the event loop in Node.js.",
      "What are streams in Node.js and when would you use them?",
      "How does Node.js handle asynchronous operations?",
      "What is middleware in Express.js?",
      "Explain error handling in Node.js."
    ],
    hard: [
      "How would you scale a Node.js application?",
      "Explain clustering in Node.js.",
      "How do you handle memory leaks in Node.js?",
      "Describe best practices for Node.js security.",
      "How would you implement authentication in a Node.js API?"
    ]
  },
  'Python': {
    easy: [
      "What are Python decorators?",
      "Explain list comprehensions in Python.",
      "What is the difference between list and tuple?",
      "How do you handle exceptions in Python?",
      "What are Python's built-in data types?"
    ],
    medium: [
      "Explain generators and iterators in Python.",
      "What is the GIL (Global Interpreter Lock)?",
      "How does Python's garbage collection work?",
      "What are context managers and the 'with' statement?",
      "Explain the difference between @staticmethod and @classmethod."
    ],
    hard: [
      "How would you optimize Python code for performance?",
      "Explain metaclasses in Python.",
      "How do you implement multithreading vs multiprocessing?",
      "What are Python's memory management strategies?",
      "Describe advanced patterns for async programming in Python."
    ]
  },
  'Database': {
    easy: [
      "What is the difference between SQL and NoSQL databases?",
      "Explain what a primary key is.",
      "What is database normalization?",
      "What are CRUD operations?",
      "Explain the concept of a foreign key."
    ],
    medium: [
      "What are database indexes and how do they work?",
      "Explain ACID properties in databases.",
      "What is the difference between INNER JOIN and OUTER JOIN?",
      "How do you optimize database queries?",
      "What is database sharding?"
    ],
    hard: [
      "Design a schema for a social media application.",
      "Explain database replication and consistency models.",
      "How would you handle database migrations in production?",
      "What are the trade-offs between different database types?",
      "Describe strategies for handling high-traffic database scenarios."
    ]
  },
  'System Design': {
    easy: [
      "What is scalability in system design?",
      "Explain the client-server architecture.",
      "What is a load balancer?",
      "What is caching and why is it important?",
      "Explain the concept of microservices."
    ],
    medium: [
      "How would you design a URL shortening service?",
      "Explain the CAP theorem.",
      "What is the difference between horizontal and vertical scaling?",
      "How do you design for high availability?",
      "What are message queues and when would you use them?"
    ],
    hard: [
      "Design a distributed file storage system like Dropbox.",
      "How would you design a real-time chat application?",
      "Explain strategies for handling millions of concurrent users.",
      "Design a recommendation system for an e-commerce platform.",
      "How would you architect a globally distributed application?"
    ]
  }
};

// Add more domains with default questions
const defaultQuestions = {
  easy: [
    "Explain the basic concepts of this technology.",
    "What are the main features and benefits?",
    "How do you get started with this technology?",
    "What are common use cases?",
    "Describe the ecosystem and community."
  ],
  medium: [
    "How do you handle errors and edge cases?",
    "Explain the architecture and design patterns.",
    "What are best practices for this technology?",
    "How do you optimize performance?",
    "Compare this with similar technologies."
  ],
  hard: [
    "How would you design a scalable system using this?",
    "Explain advanced concepts and internals.",
    "How do you debug complex issues?",
    "Describe security considerations.",
    "How would you migrate a large project to this technology?"
  ]
};

const generateQuestionsMock = async (domain, difficulty) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Get questions for the domain, or use default
  const domainQuestions = mockQuestions[domain] || defaultQuestions;
  const questions = domainQuestions[difficulty.toLowerCase()] || domainQuestions.easy;

  return {
    success: true,
    questions
  };
};

const evaluateAnswersMock = async (questions, answers) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const scores = answers.map((answer) => {
    if (!answer || answer.trim().length === 0) {
      return 0;
    }
    
    // Simple scoring based on answer length and keywords
    const wordCount = answer.trim().split(/\s+/).length;
    let score = 0;

    if (wordCount < 10) {
      score = Math.random() * 30 + 20; // 20-50
    } else if (wordCount < 30) {
      score = Math.random() * 30 + 50; // 50-80
    } else {
      score = Math.random() * 20 + 70; // 70-90
    }

    return Math.round(score);
  });

  const overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

  let feedback = '';
  if (overallScore >= 80) {
    feedback = 'Excellent performance! You demonstrated strong understanding of the concepts. Your answers were comprehensive and well-articulated. Keep up the great work!';
  } else if (overallScore >= 60) {
    feedback = 'Good effort! You showed decent understanding of the topics. Some answers could be more detailed. Consider studying the areas where you scored lower to improve further.';
  } else if (overallScore >= 40) {
    feedback = 'Fair attempt. You have basic understanding but need to study more. Focus on understanding core concepts in depth. Practice explaining concepts clearly and concisely.';
  } else {
    feedback = 'Needs improvement. Your answers were too brief or lacked technical depth. Spend more time studying the fundamentals and practice articulating your knowledge better.';
  }

  return {
    success: true,
    scores,
    overallScore,
    feedback
  };
};

module.exports = {
  generateQuestions: generateQuestionsMock,
  evaluateAnswers: evaluateAnswersMock
};
