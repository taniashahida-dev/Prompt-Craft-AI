const Template = require("../models/Template");

const demoTemplatesData = [
  {
    title: "Advanced SEO Blog Post Creator",
    category: "Blog Writing",
    description: "Generate a fully-structured, engaging, and SEO-optimised blog post with correct headings, keyword density, and meta details.",
    fullPrompt: "Act as a professional content writer. Write a comprehensive blog post about [Topic] targeting the keyword [Keyword]. Include a catchy H1 title, a compelling introduction, H2 and H3 subheadings with detailed body paragraphs, a conclusion section, and meta title/description details. Keep keyword density around 1.5%.",
    difficulty: "Intermediate",
    tags: ["seo", "blog", "writing", "content"],
    usages: 1420,
    imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "High-Converting Facebook Ad Copywriter",
    category: "Marketing",
    description: "Create highly persuasive, scroll-stopping ad copy for Facebook campaigns using the AIDA framework.",
    fullPrompt: "Act as an expert copywriter. Write a Facebook ad copy for [Product/Service] targeting [Target Audience]. Structure it using the AIDA framework: Attention, Interest, Desire, Action. Include a strong hook, benefits, a clear call-to-action (CTA), and relevant emojis.",
    difficulty: "Beginner",
    tags: ["ads", "marketing", "facebook", "copywriting"],
    usages: 985,
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "Keyword Strategy & Content Planner",
    category: "SEO",
    description: "Build a content plan and keyword group strategy based on a core seed topic.",
    fullPrompt: "Act as an SEO Specialist. Based on the seed keyword [Seed Keyword], generate a content plan consisting of 5 topical cluster keywords. For each keyword, provide search intent (informational, transactional, navigational), a suggested title, target word count, and key questions to answer.",
    difficulty: "Advanced",
    tags: ["seo", "keywords", "strategy", "planning"],
    usages: 870,
    imageUrl: "https://images.unsplash.com/photo-1571721795195-a2ca2d3370a9?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "Code Optimizer & Refactoring Assistant",
    category: "Programming",
    description: "Refactor and optimize any code snippet for improved performance, cleaner syntax, and better readability.",
    fullPrompt: "Act as a Principal Engineer. Review and optimize the following [Language] code snippet. Focus on performance optimization, code clean-up, adherence to best practices, and readability. Explain the changes you make in detail:\n\n[Code Snippet]",
    difficulty: "Advanced",
    tags: ["programming", "refactoring", "performance", "optimization"],
    usages: 2150,
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "Twitter/X Thread Generator",
    category: "Social Media",
    description: "Turn long articles or topics into viral Twitter threads that maximize engagement.",
    fullPrompt: "Act as a Social Media Manager. Convert [Topic/Content] into a highly engaging Twitter (X) thread of 5-7 tweets. The first tweet must have a powerful hook to get people clicking. End the thread with a call-to-action encouraging likes, retweets, and comments.",
    difficulty: "Beginner",
    tags: ["social", "twitter", "thread", "growth"],
    usages: 1310,
    imageUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "ATS-Friendly Resume Enhancer",
    category: "Resume Builder",
    description: "Rewrite bullet points on a resume to be highly impactful, metric-driven, and ATS-optimized.",
    fullPrompt: "Act as a Professional Resume Writer. Enhance the following resume bullet point to make it more impactful and metrics-driven: '[Bullet Point]'. Use the XYZ formula: Accomplished [X] as measured by [Y], by doing [Z]. Optimize it for ATS systems by using powerful action verbs.",
    difficulty: "Intermediate",
    tags: ["resume", "jobs", "careers", "ats"],
    usages: 1740,
    imageUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "Executive Summary & Pitch Deck Writer",
    category: "Business",
    description: "Create a concise, compelling pitch deck executive summary for venture capitalists.",
    fullPrompt: "Act as a Startup Mentor. Write a 1-page executive summary for a pitch deck based on the startup idea: [Idea]. Outline the Problem, the Solution, target Market Size, Business Model, Competitive Advantage, and the Team. Keep it professional and persuasive.",
    difficulty: "Advanced",
    tags: ["business", "pitch", "startup", "investors"],
    usages: 650,
    imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "Socratic Method Lesson Planner",
    category: "Education",
    description: "Design interactive, question-based lesson plans on complex academic topics.",
    fullPrompt: "Act as a Professor. Design a lesson plan using the Socratic Method on [Topic] for [Grade Level]. Include a series of 5 core guiding questions that lead the students to discover the concepts themselves, common student misconceptions to watch out for, and a brief follow-up assignment.",
    difficulty: "Intermediate",
    tags: ["education", "teaching", "lesson-plan", "learning"],
    usages: 480,
    imageUrl: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "Customer Conflict Resolution Guide",
    category: "Customer Support",
    description: "Write polite, clear, and reassuring email responses to resolve customer complaints.",
    fullPrompt: "Act as a Customer Success Manager. Write a response resolving this customer complaint: '[Complaint]'. Maintain a polite, empathetic, and professional tone. Acknowledge the issue, apologize for the inconvenience, offer a concrete solution, and detail how we will prevent it from happening again.",
    difficulty: "Beginner",
    tags: ["support", "customer", "resolution", "email"],
    usages: 920,
    imageUrl: "https://images.unsplash.com/photo-1521791136368-1a8832755544?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "Cold Email Outreach Wizard",
    category: "Email Writing",
    description: "Draft cold B2B outreach emails that secure high response rates from decision-makers.",
    fullPrompt: "Act as a Sales Copywriter. Write a B2B cold email to a [Job Title] at [Target Company] promoting [Product/Service]. Keep it under 150 words, include a personalized hook, focus on their pain points, suggest a clear value proposition, and end with a low-friction call-to-action.",
    difficulty: "Intermediate",
    tags: ["email", "sales", "outreach", "b2b"],
    usages: 1180,
    imageUrl: "https://images.unsplash.com/photo-1557200134-90327ee9fafa?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "Pareto Principle Task Planner",
    category: "Productivity",
    description: "Reorganize list of tasks based on the 80/20 rule to maximize daily output.",
    fullPrompt: "Act as a Productivity Coach. Analyze this list of daily tasks: [Task List]. Apply the Pareto Principle (80/20 rule) to identify the top 20% high-leverage tasks that will drive 80% of the results. Suggest a daily schedule prioritizing these tasks, and advise on which tasks to delegate or eliminate.",
    difficulty: "Beginner",
    tags: ["productivity", "time-management", "planning", "focus"],
    usages: 1230,
    imageUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "YouTube Script Hook & Outline Writer",
    category: "Content Creation",
    description: "Structure a highly engaging video outline and script intro with high viewer retention.",
    fullPrompt: "Act as a YouTube Content Strategist. Create a video script outline for the topic [Topic]. Write a strong 30-second opening hook that immediately grabs attention and states the value of the video. Then, provide a bulleted structural breakdown of the intro, body segments, and outro.",
    difficulty: "Intermediate",
    tags: ["video", "youtube", "content", "scriptwriting"],
    usages: 1600,
    imageUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "Interactive API Doc & Swagger Generator",
    category: "Programming",
    description: "Produce clear OpenAPI / Swagger documentation from raw code structures.",
    fullPrompt: "Act as a Technical Writer. Generate OpenAPI 3.0 documentation in YAML format for the following Express route and database handler code snippet. Describe all parameters, request bodies, success responses, and common error responses:\n\n[Code Snippet]",
    difficulty: "Intermediate",
    tags: ["programming", "documentation", "api", "swagger"],
    usages: 890,
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "Copywriting Competitor Analysis Planner",
    category: "Marketing",
    description: "Synthesize competitor taglines and copy strategies to define brand positioning.",
    fullPrompt: "Act as a Marketing Strategist. Analyze these 3 competitor landing page copy headlines: [Headlines]. Identify their positioning angles, call-to-actions, and main value drivers. Suggest a unique copywriting direction for our brand that differentiates us from all three.",
    difficulty: "Advanced",
    tags: ["marketing", "competitors", "analysis", "copywriting"],
    usages: 540,
    imageUrl: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "Brand Tone of Voice Guidelines Architect",
    category: "Business",
    description: "Define precise tone of voice rules (do's and don'ts) based on brand values.",
    fullPrompt: "Act as a Brand Director. Establish Tone of Voice Guidelines for a company that values [Brand Values]. Detail rules for 4 core characteristics (e.g. Helpful, Bold, etc.). For each, write 2 examples of 'What to Say' (Do) and 2 examples of 'What to Avoid' (Don't).",
    difficulty: "Advanced",
    tags: ["business", "branding", "guidelines", "tone"],
    usages: 710,
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop"
  }
];

const seedDemoTemplates = async (userId) => {
  try {
    const existingCount = await Template.countDocuments({ createdBy: userId });
    if (existingCount >= 15) {
      console.log(`Demo templates already present (${existingCount}). Skipping seed.`);
      return;
    }

    console.log(`Seeding ${demoTemplatesData.length} templates for demo user ${userId}...`);
    
    // We construct template objects with correct createdBy reference
    const templatesWithUser = demoTemplatesData.map(tpl => ({
      ...tpl,
      createdBy: userId
    }));

    await Template.insertMany(templatesWithUser);
    console.log("Demo templates seeded successfully.");
  } catch (error) {
    console.error("Error seeding demo templates:", error.message);
  }
};

module.exports = { seedDemoTemplates };
