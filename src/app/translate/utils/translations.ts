// Dummy translations data for Chinese and English - used as fallback
export const dummyTranslations = {
  english_to_chinese: {
    "How are you?": "你好吗？",
    "Hello": "你好",
    "Thank you": "谢谢",
    "Good morning": "早上好",
    "Good night": "晚安",
    "I love you": "我爱你",
    "What is your name?": "你叫什么名字？",
    "Where are you from?": "你从哪里来？",
    "I don't understand": "我不明白",
    "Please speak slowly": "请说慢一点",
  },
  chinese_to_english: {
    "你好吗？": "How are you?",
    "你好": "Hello",
    "谢谢": "Thank you",
    "早上好": "Good morning",
    "晚安": "Good night",
    "我爱你": "I love you",
    "你叫什么名字？": "What is your name?",
    "你从哪里来？": "Where are you from?",
    "我不明白": "I don't understand",
    "请说慢一点": "Please speak slowly",
  }
};

// Alternative translations with context
export const alternativeTranslations = {
  "How are you?": [
    { text: "你好吗？", translation: "How are you?" },
    { text: "你怎么样？", translation: "How are you? How do you do?" },
    { text: "你还好吗？", translation: "How are you? How are you doing?" },
    { text: "最近如何？", translation: "How are you getting on? How is it going?" },
    { text: "你过得怎么样？", translation: "What's up? How are things? How are you? How do you do?" },
  ],
  "Hello": [
    { text: "你好", translation: "Hello" },
    { text: "您好", translation: "Hello (formal)" },
    { text: "大家好", translation: "Hello everyone" },
  ],
  "Thank you": [
    { text: "谢谢", translation: "Thank you" },
    { text: "谢谢你", translation: "Thank you (to you specifically)" },
    { text: "非常感谢", translation: "Thank you very much" },
  ]
};

// Supported languages
export const supportedLanguages = [
  { code: "english", name: "English" },
  { code: "chinese", name: "Chinese" },
];

// Function to fetch translations from server API
export const fetchTranslations = async () => {
  try {
    const response = await fetch('/api/translations');
    
    if (!response.ok) {
      throw new Error('Failed to fetch translations');
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Unknown error occurred');
    }
    
    return {
      translations: data.translations,
      alternatives: data.alternatives || {}
    };
  } catch (error) {
    console.error('Error fetching translations:', error);
    // Return dummy translations as fallback
    return {
      translations: dummyTranslations,
      alternatives: alternativeTranslations
    };
  }
};
