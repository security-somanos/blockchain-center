export type PodcastEpisode = {
  id: string;
  title: string;
  description: string;
  category: "speakers" | "conferences" | "academy";
  thumbnail: string;
  date: string; // ISO date string
  duration: string; // e.g., "45 min 30 seg"
  youtubeId?: string; // YouTube video ID if available (deprecated, use videoUrl)
  videoUrl?: string; // Direct video URL
  podcastName: string;
  rating?: number;
  ratingCount?: number;
  genre?: string;
  progress?: number; // 0-100 for played episodes
  isTrailer?: boolean;
};

export type Lesson = {
  id: string;
  courseId: string;
  title: string;
  description: string;
  thumbnail: string;
  date: string; // ISO date string
  duration: string; // e.g., "45 min 30 seg"
  youtubeId?: string; // YouTube video ID if available (deprecated, use videoUrl)
  videoUrl?: string; // Direct video URL (for video lessons)
  audioUrl?: string; // Direct audio URL (for podcast/audio lessons)
  rating?: number;
  ratingCount?: number;
  order: number; // Lesson order within course
};

export type Course = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  lessons: Lesson[];
  rating?: number;
  ratingCount?: number;
  genre?: string;
  date: string; // ISO date string
};

export type CategoryInfo = {
  id: "speakers" | "conferences" | "academy";
  title: string;
  description: string;
  thumbnail: string;
  episodeCount: number;
  genre: string;
  rating?: number;
  ratingCount?: number;
};

function slugify(input: string): string {
  return (input || "")
    .toLowerCase()
    .replace(/&/g, "-and-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "episode";
}

export function getCategoryInfo(): CategoryInfo[] {
  return [
    {
      id: "speakers",
      title: "Speakers",
      description: "Insights and interviews with leading blockchain experts, thought leaders, and innovators from around the world. Learn from the best minds in the industry.",
      thumbnail: "/blockchain-center-logo.svg",
      episodeCount: 12,
      genre: "Interviews",
      rating: 4.8,
      ratingCount: 1250,
    },
    {
      id: "conferences",
      title: "Conferences",
      description: "Keynotes, panels, and highlights from major blockchain conferences and events. Stay up to date with the latest trends and discussions.",
      thumbnail: "/blockchain-center-logo.svg",
      episodeCount: 24,
      genre: "Conference Highlights",
      rating: 4.9,
      ratingCount: 890,
    },
    {
      id: "academy",
      title: "Academy",
      description: "Educational content covering blockchain fundamentals, advanced topics, and practical applications. Your gateway to blockchain knowledge.",
      thumbnail: "/blockchain-center-logo.svg",
      episodeCount: 18,
      genre: "Education",
      rating: 4.7,
      ratingCount: 2100,
    },
  ];
}

export function getEpisodesByCategory(category: "speakers" | "conferences" | "academy"): PodcastEpisode[] {
  const episodes: PodcastEpisode[] = [];

  if (category === "speakers") {
    episodes.push(
      {
        id: "speaker-1",
        title: "T1E1: Understanding Blockchain Fundamentals",
        description: "Join us as we dive deep into the core concepts of blockchain technology with industry expert Dr. Sarah Chen. Learn about distributed ledgers, consensus mechanisms, and the future of decentralized systems.",
        category: "speakers",
        thumbnail: "/blockchain-center-logo.svg",
        date: "2024-01-15",
        duration: "45 min 30 seg",
        youtubeId: "dQw4w9WgXcQ",
        podcastName: "Speakers",
        rating: 4.8,
        ratingCount: 125,
        genre: "Interviews",
      },
      {
        id: "speaker-2",
        title: "T1E2: The Future of DeFi",
        description: "Exploring decentralized finance with renowned economist and blockchain researcher Mark Thompson. We discuss DeFi protocols, yield farming, and the evolving landscape of financial services.",
        category: "speakers",
        thumbnail: "/blockchain-center-logo.svg",
        date: "2024-01-22",
        duration: "52 min 15 seg",
        youtubeId: "dQw4w9WgXcQ",
        podcastName: "Speakers",
        rating: 4.9,
        ratingCount: 98,
        genre: "Interviews",
      },
      {
        id: "speaker-3",
        title: "T1E3: NFT Market Evolution",
        description: "An in-depth conversation with digital artist and NFT pioneer Lisa Rodriguez about the evolution of non-fungible tokens, their impact on the art world, and what's next for the market.",
        category: "speakers",
        thumbnail: "/blockchain-center-logo.svg",
        date: "2024-01-29",
        duration: "38 min 45 seg",
        podcastName: "Speakers",
        rating: 4.7,
        ratingCount: 156,
        genre: "Interviews",
      },
      {
        id: "speaker-trailer",
        title: "Trailer - Speakers: Expert Insights",
        description: "Welcome to Speakers, where we bring you conversations with the brightest minds in blockchain technology.",
        category: "speakers",
        thumbnail: "/blockchain-center-logo.svg",
        date: "2024-01-01",
        duration: "2 min 30 seg",
        youtubeId: "dQw4w9WgXcQ",
        podcastName: "Speakers",
        genre: "Interviews",
        isTrailer: true,
      }
    );
  } else if (category === "conferences") {
    episodes.push(
      {
        id: "conference-1",
        title: "Keynote: Blockchain Adoption in 2024",
        description: "A comprehensive overview of blockchain adoption trends from the Blockchain Summit 2024. Industry leaders share their insights on regulatory developments, enterprise adoption, and emerging use cases.",
        category: "conferences",
        thumbnail: "/blockchain-center-logo.svg",
        date: "2024-02-10",
        duration: "1 hr 15 min",
        youtubeId: "dQw4w9WgXcQ",
        podcastName: "Conferences",
        rating: 4.9,
        ratingCount: 234,
        genre: "Conference Highlights",
      },
      {
        id: "conference-2",
        title: "Panel Discussion: Layer 2 Solutions",
        description: "Expert panel discussion from DevCon exploring Layer 2 scaling solutions, their trade-offs, and implementation strategies. Featuring developers from Ethereum, Polygon, and Arbitrum.",
        category: "conferences",
        thumbnail: "/blockchain-center-logo.svg",
        date: "2024-02-17",
        duration: "58 min 20 seg",
        youtubeId: "dQw4w9WgXcQ",
        podcastName: "Conferences",
        rating: 4.8,
        ratingCount: 189,
        genre: "Conference Highlights",
      },
      {
        id: "conference-3",
        title: "Workshop: Smart Contract Security",
        description: "Hands-on workshop covering smart contract security best practices, common vulnerabilities, and auditing techniques. Recorded live from Blockchain Security Week 2024.",
        category: "conferences",
        thumbnail: "/blockchain-center-logo.svg",
        date: "2024-02-24",
        duration: "1 hr 32 min",
        podcastName: "Conferences",
        rating: 4.9,
        ratingCount: 312,
        genre: "Conference Highlights",
      },
      {
        id: "conference-trailer",
        title: "Trailer - Conferences: Event Highlights",
        description: "Experience the best moments from blockchain conferences worldwide. Keynotes, panels, and exclusive insights.",
        category: "conferences",
        thumbnail: "/blockchain-center-logo.svg",
        date: "2024-02-01",
        duration: "2 min 15 seg",
        youtubeId: "dQw4w9WgXcQ",
        podcastName: "Conferences",
        genre: "Conference Highlights",
        isTrailer: true,
      }
    );
  } else if (category === "academy") {
    // Academy category now uses courses, so return empty for backward compatibility
    // The courses are handled separately
  }

  return episodes;
}

export function getEpisodeById(category: "speakers" | "conferences" | "academy", slug: string): PodcastEpisode | null {
  const episodes = getEpisodesByCategory(category);
  return episodes.find((ep) => ep.id === slug || slugify(ep.title) === slug) || null;
}

export function getPreviewEpisodes(category: "speakers" | "conferences" | "academy", limit: number = 3): PodcastEpisode[] {
  const episodes = getEpisodesByCategory(category);
  return episodes.filter((ep) => !ep.isTrailer).slice(0, limit);
}

export function getPreviewCourses(limit: number = 3): Course[] {
  const courses = getAllCourses();
  return courses.slice(0, limit);
}

// Courses and Lessons functions
export function getAllCourses(): Course[] {
  return [
    {
      id: "blockchain-fundamentals",
      title: "Blockchain Fundamentals",
      description: "A comprehensive introduction to blockchain technology. Learn the core concepts, history, and fundamental principles that power decentralized systems. Perfect for beginners who want to understand what blockchain is and why it matters.",
      thumbnail: "/blockchain-center-logo.svg",
      date: "2024-03-01",
      rating: 4.7,
      ratingCount: 1234,
      genre: "Fundamentals",
      lessons: [
        {
          id: "lesson-1",
          courseId: "blockchain-fundamentals",
          title: "Introduction to Blockchain",
          description: "Start your blockchain journey with this comprehensive introduction. Learn about the history of blockchain, key concepts, and why it matters. Perfect for beginners.",
          thumbnail: "/blockchain-center-logo.svg",
          date: "2024-03-05",
          duration: "42 min 10 seg",
          audioUrl: "/videos/video.mp4", // Using video file as audio for now
          rating: 4.7,
          ratingCount: 445,
          order: 1,
        },
        {
          id: "lesson-2",
          courseId: "blockchain-fundamentals",
          title: "Cryptography Basics",
          description: "Understanding the cryptographic foundations of blockchain technology. We cover hash functions, digital signatures, and public-key cryptography in an accessible way.",
          thumbnail: "/blockchain-center-logo.svg",
          date: "2024-03-12",
          duration: "48 min 25 seg",
          audioUrl: "/videos/video.mp4", // Using video file as audio for now
          rating: 4.8,
          ratingCount: 389,
          order: 2,
        },
        {
          id: "lesson-3",
          courseId: "blockchain-fundamentals",
          title: "Consensus Mechanisms Explained",
          description: "Deep dive into consensus mechanisms: Proof of Work, Proof of Stake, and beyond. Learn how different blockchains achieve agreement and maintain security.",
          thumbnail: "/blockchain-center-logo.svg",
          date: "2024-03-19",
          duration: "55 min 40 seg",
          audioUrl: "/videos/video.mp4", // Using video file as audio for now
          rating: 4.9,
          ratingCount: 521,
          order: 3,
        },
        {
          id: "lesson-4",
          courseId: "blockchain-fundamentals",
          title: "Distributed Ledger Technology",
          description: "Explore how distributed ledgers work, their advantages over traditional databases, and real-world applications of DLT beyond cryptocurrencies.",
          thumbnail: "/blockchain-center-logo.svg",
          date: "2024-03-26",
          duration: "50 min 15 seg",
          audioUrl: "/videos/video.mp4", // Using video file as audio for now
          rating: 4.8,
          ratingCount: 398,
          order: 4,
        },
      ],
    },
    {
      id: "smart-contracts-development",
      title: "Smart Contracts Development",
      description: "Learn to build and deploy smart contracts on Ethereum and other blockchain platforms. Cover Solidity programming, testing, security best practices, and deployment strategies.",
      thumbnail: "/blockchain-center-logo.svg",
      date: "2024-04-01",
      rating: 4.9,
      ratingCount: 892,
      genre: "Development",
      lessons: [
        {
          id: "sc-lesson-1",
          courseId: "smart-contracts-development",
          title: "Introduction to Smart Contracts",
          description: "Understanding what smart contracts are, how they work, and their potential applications. Get familiar with the Solidity programming language and development environment setup.",
          thumbnail: "/blockchain-center-logo.svg",
          date: "2024-04-05",
          duration: "45 min 30 seg",
          audioUrl: "/videos/video.mp4", // Using video file as audio for now
          rating: 4.8,
          ratingCount: 523,
          order: 1,
        },
        {
          id: "sc-lesson-2",
          courseId: "smart-contracts-development",
          title: "Solidity Basics",
          description: "Learn the fundamentals of Solidity syntax, data types, functions, and control structures. Write your first smart contract and understand the compilation process.",
          thumbnail: "/blockchain-center-logo.svg",
          date: "2024-04-12",
          duration: "52 min 20 seg",
          audioUrl: "/videos/video.mp4", // Using video file as audio for now
          rating: 4.9,
          ratingCount: 456,
          order: 2,
        },
        {
          id: "sc-lesson-3",
          courseId: "smart-contracts-development",
          title: "Smart Contract Security",
          description: "Learn about common vulnerabilities in smart contracts, security best practices, and how to audit your code. Understand reentrancy attacks, overflow issues, and more.",
          thumbnail: "/blockchain-center-logo.svg",
          date: "2024-04-19",
          duration: "58 min 45 seg",
          audioUrl: "/videos/video.mp4", // Using video file as audio for now
          rating: 4.9,
          ratingCount: 612,
          order: 3,
        },
      ],
    },
    {
      id: "defi-fundamentals",
      title: "DeFi Fundamentals",
      description: "Master the world of Decentralized Finance. Learn about DeFi protocols, liquidity pools, yield farming, lending platforms, and how to interact with DeFi applications safely.",
      thumbnail: "/blockchain-center-logo.svg",
      date: "2024-05-01",
      rating: 4.8,
      ratingCount: 756,
      genre: "Finance",
      lessons: [
        {
          id: "defi-lesson-1",
          courseId: "defi-fundamentals",
          title: "What is DeFi?",
          description: "Introduction to Decentralized Finance and how it differs from traditional finance. Explore the DeFi ecosystem and its key components.",
          thumbnail: "/blockchain-center-logo.svg",
          date: "2024-05-05",
          duration: "40 min 15 seg",
          audioUrl: "/videos/video.mp4", // Using video file as audio for now
          rating: 4.7,
          ratingCount: 445,
          order: 1,
        },
        {
          id: "defi-lesson-2",
          courseId: "defi-fundamentals",
          title: "Liquidity Pools and AMMs",
          description: "Understand how Automated Market Makers work, liquidity provision, impermanent loss, and how to participate in liquidity pools.",
          thumbnail: "/blockchain-center-logo.svg",
          date: "2024-05-12",
          duration: "55 min 30 seg",
          audioUrl: "/videos/video.mp4", // Using video file as audio for now
          rating: 4.8,
          ratingCount: 389,
          order: 2,
        },
      ],
    },
  ];
}

export function getCourseById(courseId: string): Course | null {
  const courses = getAllCourses();
  return courses.find((c) => c.id === courseId) || null;
}

export function getLessonById(courseId: string, lessonId: string): Lesson | null {
  const course = getCourseById(courseId);
  if (!course) return null;
  return course.lessons.find((l) => l.id === lessonId) || null;
}

export type Comment = {
  id: string;
  lessonId?: string; // For lessons
  episodeId?: string; // For episodes
  author: string;
  content: string;
  date: string; // ISO date string
  rating?: number; // 1-5 stars
};

export function getCommentsByLessonId(lessonId: string): Comment[] {
  // Static comments for demo
  return [
    {
      id: `lesson-comment-1-${lessonId}`,
      lessonId: lessonId,
      author: "Alex Johnson",
      content: "Great introduction! Really helped me understand the basics. Looking forward to the next lesson.",
      date: "2024-03-06",
      rating: 5,
    },
    {
      id: `lesson-comment-2-${lessonId}`,
      lessonId: lessonId,
      author: "Sarah Chen",
      content: "Very clear explanations. The examples were particularly helpful. Would love to see more advanced topics covered.",
      date: "2024-03-07",
      rating: 4,
    },
    {
      id: `lesson-comment-3-${lessonId}`,
      lessonId: lessonId,
      author: "Mike Davis",
      content: "Excellent content. The video quality was great and the pacing was perfect for beginners.",
      date: "2024-03-08",
      rating: 5,
    },
  ];
}

export function getCommentsByEpisodeId(episodeId: string, category: "speakers" | "conferences"): Comment[] {
  // Static comments for demo - different comments based on category
  const baseComments: Comment[] = [
    {
      id: `episode-comment-1-${episodeId}`,
      episodeId: episodeId,
      author: "Emma Wilson",
      content: category === "speakers" 
        ? "Amazing insights from this expert! The discussion really opened my eyes to new perspectives on blockchain technology."
        : "This was a fantastic keynote. Really enjoyed the depth of analysis and practical examples.",
      date: "2024-01-16",
      rating: 5,
    },
    {
      id: `episode-comment-2-${episodeId}`,
      episodeId: episodeId,
      author: "David Martinez",
      content: category === "speakers"
        ? "Great interview! The speaker's expertise really shines through. Would love to hear more from them."
        : "Excellent panel discussion. The different viewpoints made this very engaging and informative.",
      date: "2024-01-17",
      rating: 4,
    },
    {
      id: `episode-comment-3-${episodeId}`,
      episodeId: episodeId,
      author: "Jessica Brown",
      content: category === "speakers"
        ? "Very informative episode. The explanations were clear and accessible, even for someone new to the topic."
        : "One of the best conference highlights I've watched. The quality of the content is outstanding.",
      date: "2024-01-18",
      rating: 5,
    },
    {
      id: `episode-comment-4-${episodeId}`,
      episodeId: episodeId,
      author: "Robert Taylor",
      content: category === "speakers"
        ? "The speaker did a great job breaking down complex concepts. This is exactly the kind of content I need!"
        : "Really appreciate the practical insights shared in this session. Very actionable takeaways.",
      date: "2024-01-19",
      rating: 4,
    },
  ];

  return baseComments;
}

