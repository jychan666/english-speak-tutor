import type { MockExam, PartAPassage, PartBScenario, PartCStory } from '@/types/exam'

// ============================================================
// Part A — 模仿朗读 (8 篇, 每篇 ~70 词)
// 难度 1=3篇, 2=3篇, 3=2篇
// ============================================================

export const partAPassages: PartAPassage[] = [
  // ── 难度 1 ──────────────────────────────────────────────
  {
    id: 'pa-campus-morning',
    type: 'partA',
    title: '校园晨读',
    passage:
      'Reading aloud in the morning is a good habit. Every day, our class spends fifteen minutes reading English passages together. The teacher says this practice helps us improve pronunciation and build confidence. At first, I felt shy and spoke very softly. But after a few weeks, my voice became clearer and stronger. Now I enjoy morning reading because it wakes up my brain and prepares me for the whole day.',
    wordCount: 72,
    difficulty: 1,
    topic: '校园生活',
    focusPhonemes: ['/v/', '/w/', '/th/'],
    relatedLearnArticles: ['qa-part-a-30sec', 'pr-vw', 'pr-th-sound'],
  },
  {
    id: 'pa-community-garden',
    type: 'partA',
    title: '校园小菜园',
    passage:
      'Last spring, our school started a small garden in the corner of the playground. Students from each class take turns watering the plants and pulling out weeds. We grow tomatoes, flowers, and some green vegetables. Working in the garden teaches us patience and teamwork. When the first tomatoes turned red, everyone felt excited and proud. The garden also attracts birds and butterflies, making our campus more beautiful than before.',
    wordCount: 72,
    difficulty: 1,
    topic: '校园活动',
    focusPhonemes: ['/s/', '/z/', '/g/'],
    relatedLearnArticles: ['pr-linking', 'vo-environment', 'vo-campus'],
  },
  {
    id: 'pa-healthy-sleep',
    type: 'partA',
    title: '充足睡眠的重要性',
    passage:
      'Getting enough sleep is important for teenagers. Doctors say high school students need about eight hours of sleep every night. However, many students stay up late doing homework or playing on their phones. Lack of sleep makes it hard to focus in class the next day. It can also affect your mood and memory. If you want to learn well, start by going to bed on time. A regular sleep schedule helps your body and mind work at their best.',
    wordCount: 76,
    difficulty: 1,
    topic: '健康生活',
    focusPhonemes: ['/b/', '/p/', '/sl/'],
    relatedLearnArticles: ['vo-medical', 'tp-time-management', 'qa-last-48h'],
  },

  // ── 难度 2 ──────────────────────────────────────────────
  {
    id: 'pa-recycling-art',
    type: 'partA',
    title: '变废为宝的美术课',
    passage:
      'In art class last week, our teacher challenged us to create something from old newspapers and used bottles. My group decided to build a model of our city using these waste materials. Although it took us three days to finish, the result amazed everyone. Our model city had tall buildings, bridges, and even a small park made of green paper. The project taught us that creativity does not require expensive materials. With imagination, even rubbish can be turned into art.',
    wordCount: 78,
    difficulty: 2,
    topic: '环保创意',
    focusPhonemes: ['/tr/', '/dr/', '/ch/'],
    relatedLearnArticles: ['vo-environment', 'gr-connectors', 'tp-prep-minute'],
  },
  {
    id: 'pa-online-safety',
    type: 'partA',
    title: '网络安全意识',
    passage:
      'The Internet makes our lives easier, but it also brings risks that young people should be aware of. Never share your passwords or personal information with strangers online. If someone sends you an unkind message, do not reply. Instead, tell a parent or a teacher right away. Remember that not everything you read online is true, so always check facts from different sources. Using the Internet wisely is a skill that we all need to learn for the future.',
    wordCount: 77,
    difficulty: 2,
    topic: '网络安全',
    focusPhonemes: ['/r/', '/l/', '/ai/'],
    relatedLearnArticles: ['pr-intonation', 'gr-chinglish-fix', 'tp-cant-hear'],
  },
  {
    id: 'pa-sports-meeting',
    type: 'partA',
    title: '难忘的运动会',
    passage:
      'Our school sports meeting was held on a sunny Friday last month. Students competed in running, jumping, and ball games. I joined the four-hundred-meter relay race. Before the race, I felt nervous because I was the last runner on our team. When I took the baton, I heard my classmates cheering loudly from the sides. I ran as fast as I could and we won third place. The sports meeting reminded me that effort matters more than medals.',
    wordCount: 79,
    difficulty: 2,
    topic: '校园活动',
    focusPhonemes: ['/sp/', '/st/', '/r/'],
    relatedLearnArticles: ['vo-campus', 'tm-part-c-transition', 'pr-linking'],
  },

  // ── 难度 3 ──────────────────────────────────────────────
  {
    id: 'pa-space-dream',
    type: 'partA',
    title: '逐梦航天',
    passage:
      "China's space program has made remarkable progress in recent years. The successful launch of new satellites and the construction of the space station have inspired many young people. My physics teacher often encourages us to follow space news and think about the questions scientists are exploring. I dream of becoming an aerospace engineer one day. Though the journey is long and the study is demanding, I believe hard work and curiosity can help me reach the stars.",
    wordCount: 75,
    difficulty: 3,
    topic: '科技梦想',
    focusPhonemes: ['/sp/', '/sk/', '/dʒ/'],
    relatedLearnArticles: ['pr-intonation', 'gr-chinglish-fix', 'qa-exam-day-checklist'],
  },
  {
    id: 'pa-cultural-exchange',
    type: 'partA',
    title: '跨文化交流',
    passage:
      'Last month, a group of international students visited our school for a cultural exchange program. They introduced their traditional festivals, music, and food. We performed Chinese calligraphy and paper cutting for them. Although we spoke different languages, we communicated through smiles and hand gestures. The experience showed me that culture is a bridge connecting people from different backgrounds. I felt grateful for the opportunity to make new friends across borders.',
    wordCount: 73,
    difficulty: 3,
    topic: '文化交流',
    focusPhonemes: ['/kl/', '/gl/', '/dz/'],
    relatedLearnArticles: ['vo-campus', 'tm-part-c-opening', 'tp-stuck-rescue'],
  },
]

// ============================================================
// Part B — 角色扮演 (8 个场景)
// 每个含: dialogue (~100词对话原文) + computerAnswers (3段)
// 五答中第 3-5 题答案必须来自 computerAnswers
// ============================================================

export const partBScenarios: PartBScenario[] = [
  // ── 场景 1: 校园采访 ────────────────────────────────────
  {
    id: 'pb-campus-interview',
    type: 'partB',
    scenario: '你是校报记者，正在采访一位在学校摄影比赛中获奖的同学。',
    role: '校报记者',
    dialogue:
      "Reporter: Congratulations on winning the photography contest! Your photo was amazing.\nStudent: Thanks! I still can't believe I won first place.\nReporter: I heard you only started taking photos two years ago. Is that true?\nStudent: Yes, my uncle gave me a camera for my birthday and I fell in love with it immediately.\nReporter: The winning photo was taken in the old part of our city, right?\nStudent: That's right. I went there last winter and saw an elderly couple feeding birds in the snow. It was such a peaceful moment.",
    computerAnswers: [
      'I started learning photography about two years ago when my uncle gave me a camera for my fifteenth birthday.',
      'My uncle invited me to join a summer photography workshop, and that was when I first entered the contest.',
      'My photo is special because it captures a warm human moment in a cold winter setting — an elderly couple feeding birds in the snow.',
    ],
    questionsToAsk: [
      {
        id: 'ask-1',
        chinesePrompt: '你什么时候开始学摄影的？',
        englishReference: 'When did you start learning photography?',
        keywords: ['when', 'start', 'photography'],
      },
      {
        id: 'ask-2',
        chinesePrompt: '谁邀请你参加比赛的？',
        englishReference: 'Who invited you to join the contest?',
        keywords: ['who', 'invited', 'contest'],
      },
      {
        id: 'ask-3',
        chinesePrompt: '你的作品有什么特别之处？',
        englishReference: 'What is special about your work?',
        keywords: ['what', 'special', 'work'],
      },
    ],
    questionsToAnswer: [
      {
        id: 'answer-1',
        englishQuestion: 'Why does the reporter interview this student?',
        referenceAnswer: 'Because he won first prize in the school photography contest.',
        keywords: ['won', 'photography', 'contest'],
      },
      {
        id: 'answer-2',
        englishQuestion: 'Did the student expect to win?',
        referenceAnswer: 'No, he said he still could not believe he won first place.',
        keywords: ['could not believe', 'first place'],
      },
      {
        id: 'answer-3',
        englishQuestion: 'When did he start learning photography?',
        referenceAnswer: 'He started about two years ago when his uncle gave him a camera.',
        keywords: ['two years ago', 'uncle', 'camera'],
      },
      {
        id: 'answer-4',
        englishQuestion: 'Who invited him to join the contest?',
        referenceAnswer: 'His uncle invited him to join a summer photography workshop.',
        keywords: ['uncle', 'summer', 'workshop'],
      },
      {
        id: 'answer-5',
        englishQuestion: 'What makes his photo special?',
        referenceAnswer: 'It captures an elderly couple feeding birds in the snow.',
        keywords: ['elderly couple', 'birds', 'snow'],
      },
    ],
    grammarFocus: ['wh-questions', 'past tense'],
    relatedLearnArticles: ['tm-part-b-ask', 'tm-part-b-answer', 'gr-question-order'],
  },

  // ── 场景 2: 校医室看病 ──────────────────────────────────
  {
    id: 'pb-clinic-visit',
    type: 'partB',
    scenario: '你感冒了去校医室看病，向医生描述症状并听取建议。',
    role: '学生',
    dialogue:
      "Doctor: Good morning. What seems to be the problem?\nStudent: I've been feeling unwell since yesterday. My throat hurts and I keep coughing.\nDoctor: Let me check your temperature. You have a slight fever, about thirty-eight degrees.\nStudent: Is it serious?\nDoctor: It's just a common cold, but you need to rest properly. I'll prescribe some medicine for the fever and cough.\nStudent: Do I need to miss class today?\nDoctor: Yes, you should go home and sleep. Drink plenty of warm water and avoid cold drinks for a few days.",
    computerAnswers: [
      'You should take the medicine three times a day after meals, and finish the full three-day course.',
      'You will probably feel better in about three or four days with enough rest and plenty of warm water.',
      'No, you should not do any sports until your fever is completely gone, or your cold might get worse.',
    ],
    questionsToAsk: [
      {
        id: 'ask-1',
        chinesePrompt: '这药一天吃几次？',
        englishReference: 'How many times a day should I take this medicine?',
        keywords: ['how many', 'take', 'medicine'],
      },
      {
        id: 'ask-2',
        chinesePrompt: '我大概多久能好？',
        englishReference: 'How long will it take to recover?',
        keywords: ['how long', 'recover'],
      },
      {
        id: 'ask-3',
        chinesePrompt: '我还能去上体育课吗？',
        englishReference: 'Can I still go to PE class?',
        keywords: ['can', 'PE class'],
      },
    ],
    questionsToAnswer: [
      {
        id: 'answer-1',
        englishQuestion: 'What symptoms does the student have?',
        referenceAnswer: 'He has a sore throat, a cough, and a slight fever of about thirty-eight degrees.',
        keywords: ['sore throat', 'cough', 'fever'],
      },
      {
        id: 'answer-2',
        englishQuestion: 'What did the doctor say the problem was?',
        referenceAnswer: 'The doctor said it was just a common cold.',
        keywords: ['common cold'],
      },
      {
        id: 'answer-3',
        englishQuestion: 'How should the student take the medicine?',
        referenceAnswer: 'He should take it three times a day after meals and finish the full three-day course.',
        keywords: ['three times', 'after meals', 'three-day'],
      },
      {
        id: 'answer-4',
        englishQuestion: 'How long will it take to recover?',
        referenceAnswer: 'He will probably feel better in three or four days with rest and warm water.',
        keywords: ['three or four days', 'rest', 'warm water'],
      },
      {
        id: 'answer-5',
        englishQuestion: 'Can the student do sports while sick?',
        referenceAnswer: 'No, he should not do any sports until his fever is completely gone.',
        keywords: ['no', 'sports', 'fever'],
      },
    ],
    grammarFocus: ['present perfect', 'health vocabulary'],
    relatedLearnArticles: ['vo-medical', 'gr-tense-safe', 'tp-cant-hear'],
  },

  // ── 场景 3: 书店购书 ────────────────────────────────────
  {
    id: 'pb-bookstore',
    type: 'partB',
    scenario: '你去书店买英语口语参考书，向店员咨询版本和价格。',
    role: '顾客',
    dialogue:
      "Student: Excuse me, I'm looking for a book to help with my English speaking exam.\nShop assistant: Sure! We have a few new titles on the second floor. The most popular one is called 'Speak with Confidence'.\nStudent: What does that book cover?\nShop assistant: It covers all three parts of the speaking test, with sample answers and practice tips. Many high school students buy it.\nStudent: That sounds exactly like what I need. How much is it?\nShop assistant: It's fifty-eight yuan. We also have a matching vocabulary booklet for thirty-five yuan if you buy them together.",
    computerAnswers: [
      'The book is fifty-eight yuan, but if you show your student card you can get ten percent off.',
      'I think the paper book is better because you can write notes directly on the pages when you practice.',
      'Yes, we accept both WeChat Pay and Alipay, whichever is more convenient for you.',
    ],
    questionsToAsk: [
      {
        id: 'ask-1',
        chinesePrompt: '这本书有折扣吗？',
        englishReference: 'Does this book have any discount?',
        keywords: ['discount', 'book'],
      },
      {
        id: 'ask-2',
        chinesePrompt: '你觉得纸质书好还是电子书好？',
        englishReference: 'Do you think a paper book or an e-book is better?',
        keywords: ['paper', 'e-book', 'better'],
      },
      {
        id: 'ask-3',
        chinesePrompt: '可以手机支付吗？',
        englishReference: 'Can I pay by mobile phone?',
        keywords: ['pay', 'mobile'],
      },
    ],
    questionsToAnswer: [
      {
        id: 'answer-1',
        englishQuestion: 'What book is the student looking for?',
        referenceAnswer: 'He is looking for a book for his English speaking exam.',
        keywords: ['English speaking exam', 'book'],
      },
      {
        id: 'answer-2',
        englishQuestion: 'How much does the book cost?',
        referenceAnswer: 'The book costs fifty-eight yuan.',
        keywords: ['fifty-eight', 'yuan'],
      },
      {
        id: 'answer-3',
        englishQuestion: 'What discount can the student get?',
        referenceAnswer: 'He can get ten percent off with a student card.',
        keywords: ['ten percent', 'student card'],
      },
      {
        id: 'answer-4',
        englishQuestion: 'Why does the assistant recommend a paper book?',
        referenceAnswer: 'Because the student can write notes directly on the pages.',
        keywords: ['write notes', 'paper', 'pages'],
      },
      {
        id: 'answer-5',
        englishQuestion: 'What payment methods are accepted?',
        referenceAnswer: 'They accept both WeChat Pay and Alipay.',
        keywords: ['WeChat', 'Alipay'],
      },
    ],
    grammarFocus: ['polite requests', 'conditional sentences'],
    relatedLearnArticles: ['vo-shopping', 'tm-part-b-ask', 'gr-question-order'],
  },

  // ── 场景 4: 旅游咨询 ────────────────────────────────────
  {
    id: 'pb-travel-consult',
    type: 'partB',
    scenario: '你去旅行社咨询暑假北京研学旅行，向工作人员了解行程细节。',
    role: '学生',
    dialogue:
      "Student: Hello, I'm interested in the summer study tour to Beijing. Could you tell me more about it?\nAgent: Of course! It's a seven-day program in July. You'll visit top universities, historical sites, and attend a short English workshop there.\nStudent: That sounds interesting. How many students will be in the group?\nAgent: Usually around twenty-five students, with two teachers and a local guide who speaks both Chinese and English.\nStudent: What about accommodation and meals?\nAgent: You'll stay in a student hotel near the university campus. Three meals a day are included, and the rooms are shared by two students.",
    computerAnswers: [
      'The total cost is four thousand eight hundred yuan per person, including round-trip train tickets from Guangzhou.',
      'You need to bring your ID card, some summer clothes, a notebook, and any medicine you regularly take.',
      'The deadline for signing up is June fifteenth, and you need to pay a deposit of one thousand yuan to reserve your spot.',
    ],
    questionsToAsk: [
      {
        id: 'ask-1',
        chinesePrompt: '这次旅行一共要花多少钱？',
        englishReference: 'How much does the trip cost in total?',
        keywords: ['how much', 'cost', 'trip'],
      },
      {
        id: 'ask-2',
        chinesePrompt: '我需要带什么东西？',
        englishReference: 'What should I bring with me?',
        keywords: ['what', 'bring'],
      },
      {
        id: 'ask-3',
        chinesePrompt: '什么时候截止报名？',
        englishReference: 'When is the deadline to sign up?',
        keywords: ['when', 'deadline', 'sign up'],
      },
    ],
    questionsToAnswer: [
      {
        id: 'answer-1',
        englishQuestion: 'Where does this study tour go?',
        referenceAnswer: 'It goes to Beijing for a seven-day summer program in July.',
        keywords: ['Beijing', 'seven-day', 'July'],
      },
      {
        id: 'answer-2',
        englishQuestion: 'How many students will be in the group?',
        referenceAnswer: 'About twenty-five students, with two teachers and a bilingual local guide.',
        keywords: ['twenty-five', 'teachers', 'guide'],
      },
      {
        id: 'answer-3',
        englishQuestion: 'How much does the trip cost?',
        referenceAnswer: 'It costs four thousand eight hundred yuan per person including round-trip train tickets.',
        keywords: ['four thousand eight hundred', 'train tickets'],
      },
      {
        id: 'answer-4',
        englishQuestion: 'What should the student bring?',
        referenceAnswer: 'He should bring an ID card, summer clothes, a notebook, and regular medicine.',
        keywords: ['ID card', 'clothes', 'notebook', 'medicine'],
      },
      {
        id: 'answer-5',
        englishQuestion: 'When is the registration deadline?',
        referenceAnswer: 'June fifteenth, with a deposit of one thousand yuan to reserve a spot.',
        keywords: ['June fifteenth', 'deposit', 'one thousand'],
      },
    ],
    grammarFocus: ['future plans', 'wh-questions'],
    relatedLearnArticles: ['vo-travel', 'qa-part-b-time', 'tm-part-b-answer'],
  },

  // ── 场景 5: 英语学习请教 ────────────────────────────────
  {
    id: 'pb-study-method',
    type: 'partB',
    scenario: '你的英语成绩不理想，向英语老师请教如何改进学习方法。',
    role: '学生',
    dialogue:
      "Student: Ms. Wang, could I talk to you for a moment? My English grades haven't been very good lately.\nTeacher: Of course. What part do you find most difficult?\nStudent: I think speaking is the hardest. I know the words in my head, but when I open my mouth, everything gets messy.\nTeacher: That's very common. The key is daily practice, even if it's just ten minutes. Have you tried recording yourself?\nStudent: No, I haven't. Would that help?\nTeacher: Definitely. When you listen to your own recording, you'll notice mistakes you didn't realize you were making. Also, try shadowing practice — repeat after English audio and copy the speaker's tone and rhythm.",
    computerAnswers: [
      "I recommend spending at least twenty minutes every day on speaking practice. You can break it into two ten-minute sessions, one in the morning and one at night.",
      "I suggest you start with short news podcasts like 'BBC Minute' or storytelling apps — they use simple language and are quite engaging for learners.",
      'Your goal should be reaching eighty points in the speaking exam by the end of this term. But remember, progress takes time and small daily improvements add up.',
    ],
    questionsToAsk: [
      {
        id: 'ask-1',
        chinesePrompt: '我每天应该练习多长时间口语？',
        englishReference: 'How much time should I spend on speaking practice every day?',
        keywords: ['how much', 'time', 'speaking practice'],
      },
      {
        id: 'ask-2',
        chinesePrompt: '您有什么推荐的听力材料吗？',
        englishReference: 'Do you have any recommended listening materials?',
        keywords: ['recommended', 'listening', 'materials'],
      },
      {
        id: 'ask-3',
        chinesePrompt: '我的口语目标分数应该定多少？',
        englishReference: 'What score should I set as my speaking goal?',
        keywords: ['what', 'score', 'goal'],
      },
    ],
    questionsToAnswer: [
      {
        id: 'answer-1',
        englishQuestion: 'What problem does the student have with English?',
        referenceAnswer: 'His speaking is messy even though he knows the words in his head.',
        keywords: ['speaking', 'knows words', 'messy'],
      },
      {
        id: 'answer-2',
        englishQuestion: 'What practice method did the teacher suggest besides recording?',
        referenceAnswer: 'Shadowing practice — repeating after English audio and copying the tone and rhythm.',
        keywords: ['shadowing', 'repeat', 'tone', 'rhythm'],
      },
      {
        id: 'answer-3',
        englishQuestion: 'How long should the student practice speaking each day?',
        referenceAnswer: 'At least twenty minutes, broken into two ten-minute sessions.',
        keywords: ['twenty minutes', 'two', 'ten-minute'],
      },
      {
        id: 'answer-4',
        englishQuestion: 'What listening materials did the teacher recommend?',
        referenceAnswer: "Short news podcasts like 'BBC Minute' or storytelling apps with simple language.",
        keywords: ['podcasts', 'BBC Minute', 'storytelling'],
      },
      {
        id: 'answer-5',
        englishQuestion: 'What score goal did the teacher set?',
        referenceAnswer: 'Eighty points by the end of this term, with small daily improvements.',
        keywords: ['eighty points', 'this term', 'daily improvements'],
      },
    ],
    grammarFocus: ['giving advice', 'study habits vocabulary'],
    relatedLearnArticles: ['qa-part-a-30sec', 'tp-prep-minute', 'gr-chinglish-fix'],
  },

  // ── 场景 6: 环保活动策划 ────────────────────────────────
  {
    id: 'pb-green-campaign',
    type: 'partB',
    scenario: '你是环保社社长，正在和指导老师讨论校园减塑宣传活动方案。',
    role: '环保社社长',
    dialogue:
      'Student: Teacher Li, our club wants to run an anti-plastic campaign next month. Could you give us some advice?\nTeacher: That is a great idea. What activities do you have in mind?\nStudent: We are planning to set up a display in the school hall showing how plastic waste harms ocean animals. We also want to hold a reusable bottle design competition.\nTeacher: Both sound good. Have you thought about how to get more students involved?\nStudent: We could invite each class to send a representative to join the planning, so the campaign feels like a whole-school effort.',
    computerAnswers: [
      "You can hold the event on the school playground after class next Friday afternoon. I'll help you get the permission form from the head teacher.",
      'The school can provide two large display boards and a table for your competition. But you need to prepare all the posters and materials yourselves.',
      'Yes, you should describe your plan and submit a written application to the school office at least one week before the event.',
    ],
    questionsToAsk: [
      {
        id: 'ask-1',
        chinesePrompt: '活动可以在操场上举行吗？',
        englishReference: 'Can we hold the event on the playground?',
        keywords: ['hold', 'event', 'playground'],
      },
      {
        id: 'ask-2',
        chinesePrompt: '学校能提供宣传板吗？',
        englishReference: 'Could the school provide display boards?',
        keywords: ['school', 'provide', 'display boards'],
      },
      {
        id: 'ask-3',
        chinesePrompt: '我们需要提前写申请吗？',
        englishReference: 'Do we need to write an application in advance?',
        keywords: ['write', 'application', 'advance'],
      },
    ],
    questionsToAnswer: [
      {
        id: 'answer-1',
        englishQuestion: 'What is the campaign about?',
        referenceAnswer: 'It is about reducing plastic waste on campus.',
        keywords: ['plastic waste', 'campus'],
      },
      {
        id: 'answer-2',
        englishQuestion: 'What activities does the club plan to do?',
        referenceAnswer: 'They plan an educational display about ocean animals and a reusable bottle design competition.',
        keywords: ['display', 'ocean', 'competition'],
      },
      {
        id: 'answer-3',
        englishQuestion: 'Where can the event be held?',
        referenceAnswer: 'On the school playground after class next Friday afternoon.',
        keywords: ['playground', 'Friday afternoon'],
      },
      {
        id: 'answer-4',
        englishQuestion: 'What will the school provide?',
        referenceAnswer: 'Two large display boards and a table for the competition.',
        keywords: ['display boards', 'table'],
      },
      {
        id: 'answer-5',
        englishQuestion: 'Is a written application required?',
        referenceAnswer: 'Yes, they must submit a written application to the school office at least one week before.',
        keywords: ['written', 'school office', 'one week'],
      },
    ],
    grammarFocus: ['future tense', 'permission requests'],
    relatedLearnArticles: ['vo-environment', 'gr-connectors', 'tp-time-management'],
  },

  // ── 场景 7: 假期出游计划 ────────────────────────────────
  {
    id: 'pb-holiday-plan',
    type: 'partB',
    scenario: '你和好朋友正在讨论暑假安排，商量一起去哪里旅行。',
    role: '学生',
    dialogue:
      "Friend A: The summer holiday is coming soon! Have you made any plans yet?\nFriend B: Not really. I was thinking we could go somewhere together. Any ideas?\nFriend A: I'd love to visit the mountains in Guilin. The scenery is supposed to be breathtaking there.\nFriend B: Hmm, Guilin might be too hot in July. What about going to Yunnan instead? The weather is cooler and there are many interesting ethnic villages to explore.\nFriend A: That's a good point. How long do you think we should go for?\nFriend B: Maybe five days? We can spend two days in Kunming and three days around Dali.",
    computerAnswers: [
      "I suggest we take the high-speed train. It's about six hours, and you can enjoy the changing scenery along the way. A ticket costs around five hundred yuan one way.",
      'You get a twenty-percent discount on train tickets and half price at most tourist attractions with a valid student card.',
      'I suggest a daily budget of around three hundred yuan. That should cover meals, local transport, and one or two small entrance fees. We can share costs to save more.',
    ],
    questionsToAsk: [
      {
        id: 'ask-1',
        chinesePrompt: '我们坐什么交通工具去？',
        englishReference: 'What transport should we take to get there?',
        keywords: ['what', 'transport', 'get there'],
      },
      {
        id: 'ask-2',
        chinesePrompt: '学生证能打折吗？',
        englishReference: 'Can we get discounts with student cards?',
        keywords: ['discounts', 'student cards'],
      },
      {
        id: 'ask-3',
        chinesePrompt: '每天预算大概要多少？',
        englishReference: 'What is the daily budget?',
        keywords: ['what', 'daily', 'budget'],
      },
    ],
    questionsToAnswer: [
      {
        id: 'answer-1',
        englishQuestion: 'Where does Friend A want to go first?',
        referenceAnswer: 'Friend A wants to visit Guilin for its mountain scenery.',
        keywords: ['Guilin', 'mountain', 'scenery'],
      },
      {
        id: 'answer-2',
        englishQuestion: 'Why does Friend B prefer Yunnan?',
        referenceAnswer: 'Because the weather is cooler and there are ethnic villages to explore.',
        keywords: ['cooler', 'Yunnan', 'villages'],
      },
      {
        id: 'answer-3',
        englishQuestion: 'What transport is suggested?',
        referenceAnswer: 'The high-speed train, which takes about six hours.',
        keywords: ['high-speed train', 'six hours'],
      },
      {
        id: 'answer-4',
        englishQuestion: 'What discounts do student cards offer?',
        referenceAnswer: 'Twenty percent off train tickets and half price at most attractions.',
        keywords: ['twenty percent', 'half price', 'attractions'],
      },
      {
        id: 'answer-5',
        englishQuestion: 'What is the suggested daily budget?',
        referenceAnswer: 'About three hundred yuan for meals, local transport, and small entrance fees.',
        keywords: ['three hundred', 'meals', 'transport'],
      },
    ],
    grammarFocus: ['future plans', 'preference expression'],
    relatedLearnArticles: ['vo-travel', 'qa-part-b-time', 'tm-part-b-answer'],
  },

  // ── 场景 8: 社团面试 ────────────────────────────────────
  {
    id: 'pb-club-interview',
    type: 'partB',
    scenario: '你正在参加学校英语辩论社的面试，回答社长的各种提问。',
    role: '面试者',
    dialogue:
      "Club president: Welcome to the English Debate Club interview. Tell me why you want to join us.\nStudent: I've always enjoyed expressing my ideas, and I think debating will help me think faster in English.\nClub president: That's a good reason. Have you watched any debates before?\nStudent: Yes, I watched the national high school debate final online last year. The way the speakers built their arguments really impressed me.\nClub president: Which topic would you be most passionate about debating?\nStudent: Probably topics about technology and education. I believe technology should play a bigger role in classrooms, and I have some strong arguments ready.",
    computerAnswers: [
      'We meet twice a week — Wednesday afternoons from four thirty to six, and Saturday mornings from nine to eleven. The Saturday session is for practice debates.',
      "No, you don't need previous experience. We'll pair you with a senior member for your first month who will teach you the basic rules and techniques.",
      'You just need to fill out this form with your name, class, and phone number. The club fee is thirty yuan for the whole term to cover printed materials.',
    ],
    questionsToAsk: [
      {
        id: 'ask-1',
        chinesePrompt: '社团每周活动几次？',
        englishReference: 'How many times does the club meet each week?',
        keywords: ['how many', 'club', 'meet', 'week'],
      },
      {
        id: 'ask-2',
        chinesePrompt: '没有经验可以加入吗？',
        englishReference: 'Can I join without previous experience?',
        keywords: ['can', 'join', 'without', 'experience'],
      },
      {
        id: 'ask-3',
        chinesePrompt: '我还需要交什么材料吗？',
        englishReference: 'Do I need to submit any documents?',
        keywords: ['submit', 'documents'],
      },
    ],
    questionsToAnswer: [
      {
        id: 'answer-1',
        englishQuestion: 'Why does the student want to join the debate club?',
        referenceAnswer: 'Because he enjoys expressing ideas and wants to think faster in English.',
        keywords: ['expressing ideas', 'think faster', 'English'],
      },
      {
        id: 'answer-2',
        englishQuestion: 'What debate topic is the student passionate about?',
        referenceAnswer: 'Technology and education, because he believes tech should play a bigger role in classrooms.',
        keywords: ['technology', 'education', 'classrooms'],
      },
      {
        id: 'answer-3',
        englishQuestion: 'When does the club meet?',
        referenceAnswer: 'Twice a week — Wednesday afternoons and Saturday mornings.',
        keywords: ['twice a week', 'Wednesday', 'Saturday'],
      },
      {
        id: 'answer-4',
        englishQuestion: 'Will new members get any help?',
        referenceAnswer: 'Yes, a senior member will teach them basic rules and techniques for the first month.',
        keywords: ['senior member', 'first month', 'rules'],
      },
      {
        id: 'answer-5',
        englishQuestion: 'What does the student need to do to register?',
        referenceAnswer: 'He needs to fill out a form with his name, class, and phone number, and pay thirty yuan.',
        keywords: ['form', 'name', 'class', 'thirty yuan'],
      },
    ],
    grammarFocus: ['modal verbs', 'present perfect'],
    relatedLearnArticles: ['vo-campus', 'tm-part-b-answer', 'gr-tense-safe'],
  },
]

// ============================================================
// Part C — 故事复述 (6 篇, 每篇 200-280 词)
// 全部记叙文, 各 10 个信息点
// ============================================================

export const partCStories: PartCStory[] = [
  // ── 故事 1: 赶考路上 (难度 1) ──────────────────────────
  {
    id: 'pc-tom-exam',
    type: 'partC',
    title: '赶考路上的意外援手',
    chineseOutline: 'Tom 赶考路上遭遇车祸，警察及时相助使他准时到达考场，最终考出好成绩。',
    keywords: [
      { en: 'admission card', zh: '准考证' },
      { en: 'lorry', zh: '货车' },
      { en: 'crash', zh: '碰撞' },
      { en: 'police officer', zh: '警官' },
      { en: 'on time', zh: '准时' },
    ],
    storyText:
      'Tom was a hardworking high school student who had been preparing for an important English exam for months. The exam was scheduled for a Saturday morning at a test center in the city center. On that day, Tom woke up early, checked his bag three times to make sure he had his admission card and ID, and left home feeling a mix of excitement and nervousness.\n\nHis father was driving him to the test center when suddenly a large lorry in front of them stopped without warning. Their car crashed into the back of the lorry. Luckily no one was hurt, but the car was damaged and could not move. Tom looked at his watch and panicked — the exam would start in forty minutes.\n\nJust then, a police officer on patrol noticed the accident and stopped. Tom rushed to the officer and explained his situation. The officer understood immediately and said, "Don\'t worry. I\'ll take you there." He put Tom on his police motorcycle and drove carefully through the busy streets. Along the way, the officer encouraged Tom to stay calm and take deep breaths.\n\nThey arrived at the test center five minutes before the exam began. Tom thanked the officer gratefully and ran inside. He sat down, took a deep breath, and began the exam with a calm mind. Several weeks later, Tom received a high score on the exam and wrote a heartfelt letter to the police station to express his thanks. He learned that help can come from unexpected places when you need it most.',
    keyPoints: [
      'Tom had been preparing for an important English exam for months',
      'The exam was on a Saturday morning at a city center test center',
      'Tom checked his bag three times and left home nervous but excited',
      'His father was driving when a large lorry suddenly stopped',
      'Their car crashed but no one was hurt, only the car was damaged',
      'Tom panicked because the exam would start in forty minutes',
      'A police officer on patrol noticed the accident and stopped to help',
      'The officer took Tom to the test center on his police motorcycle',
      'They arrived at the test center five minutes before the exam began',
      'Tom scored high and wrote a letter to thank the police station',
    ],
    wordCount: 245,
    difficulty: 1,
    frameworkHint: '起因 → 意外 → 求助 → 援助 → 结果与感悟',
    relatedLearnArticles: ['tm-part-c-opening', 'tm-part-c-transition', 'gr-connectors'],
  },

  // ── 故事 2: 救助流浪狗 (难度 1) ────────────────────────
  {
    id: 'pc-lost-dog',
    type: 'partC',
    title: '寒夜里的温暖救助',
    chineseOutline: 'Lily 放学路上发现一只受伤的流浪狗，她和妈妈一起帮它找到了主人。',
    keywords: [
      { en: 'shivering', zh: '颤抖' },
      { en: 'scarf', zh: '围巾' },
      { en: 'vet', zh: '兽医' },
      { en: 'poster', zh: '海报' },
      { en: 'reunite', zh: '团聚' },
    ],
    storyText:
      'One cold winter evening after school, Lily was walking home through a small park near her neighborhood. As she passed by a bench, she heard a soft crying sound coming from behind some bushes. Curious and concerned, she walked closer and found a small dog shivering under a pile of dry leaves.\n\nThe dog looked thin and dirty. Its right front leg seemed injured because it was not stepping on it properly. Lily felt heartbroken. She took off her scarf and gently wrapped it around the dog to keep it warm. Then she carefully picked it up and hurried home.\n\nAt home, Lily\'s mother helped her clean the dog and fed it some warm milk and bread. They called a local vet and took the dog there for a checkup. The vet examined the leg and said the injury was not serious. He gave them some medicine and told them how to apply it. Lily also put up posters around the neighborhood and shared photos on social media, hoping to find the owner.\n\nAfter three days of waiting, an elderly woman called. She had been searching everywhere for her dog, whose name was Bean. When she arrived at Lily\'s house, Bean ran to her immediately and wagged its tail excitedly. The woman thanked Lily over and over with tears in her eyes. Lily felt a deep warmth inside knowing she had helped reunite a family. From that day on, she decided to volunteer at the local animal shelter every weekend.',
    keyPoints: [
      'Lily was walking home through a park on a cold winter evening',
      'She heard crying and found a small dog shivering under dry leaves',
      'The dog looked thin, dirty, and had an injured right front leg',
      'Lily wrapped her scarf around the dog and carried it home',
      'Her mother helped clean the dog and they fed it warm milk and bread',
      'They took the dog to a vet who said the injury was not serious',
      'Lily put up posters and shared photos online to find the owner',
      'After three days an elderly woman called about her lost dog named Bean',
      'The dog ran to the woman excitedly and wagged its tail',
      'Lily felt warm inside and decided to volunteer at an animal shelter',
    ],
    wordCount: 233,
    difficulty: 1,
    frameworkHint: '发现 → 救助 → 治疗 → 寻找主人 → 团聚与感悟',
    relatedLearnArticles: ['tm-part-c-opening', 'gr-connectors', 'vo-environment'],
  },

  // ── 故事 3: 雨中长跑 (难度 2) ──────────────────────────
  {
    id: 'pc-rainy-race',
    type: 'partC',
    title: '雨中的坚持',
    chineseOutline: 'Li Wei 在运动会 1500 米比赛中冒雨坚持，摔倒后爬起，虽然没有获奖但赢得了更宝贵的东西。',
    keywords: [
      { en: 'relay race', zh: '接力赛' },
      { en: 'slippery', zh: '湿滑的' },
      { en: 'slipped', zh: '滑倒' },
      { en: 'overtake', zh: '超过' },
      { en: 'courage', zh: '勇气' },
    ],
    storyText:
      'The annual school sports meeting was one of the biggest events of the year at No. 7 High School. This year, Li Wei decided to challenge himself by signing up for the 1500-meter race, the longest running event of the day. He trained every morning for two weeks before the competition.\n\nOn the day of the race, the weather forecast predicted cloudy skies. However, just thirty minutes before the race was about to begin, the sky suddenly turned dark and heavy rain poured down. The running track quickly became wet and slippery. Some students suggested canceling the event, but the sports teacher checked the conditions and announced that the race would continue.\n\nWhen the starting whistle blew, Li Wei ran comfortably with the leading group for the first two laps. But on the third lap, disaster struck. He slipped on a wet patch and fell hard on his knee. Pain shot through his leg, and for a moment he considered giving up. As he sat on the wet track, he heard his classmates shouting his name from the stands: "Li Wei, you can do it! Get up!"\n\nTheir voices gave him strength. He pushed himself up, ignored the throbbing pain, and continued running. Though he had fallen far behind, he kept a steady pace. On the final lap, he summoned every bit of energy and overtook two runners ahead of him. He crossed the finish line in fifth place with blood running down his knee, but a smile spread across his face.\n\nHis classmates rushed to congratulate him, and even the teachers applauded his determination. Li Wei did not win a medal that day, but he won something far more valuable — the knowledge that courage is not about never falling. It is about getting up every single time you fall.',
    keyPoints: [
      'Li Wei signed up for the 1500-meter race, the longest event of the sports meeting',
      'He trained every morning for two weeks before the competition',
      'Heavy rain poured down thirty minutes before the race, making the track wet and slippery',
      'The sports teacher checked conditions and announced the race would continue',
      'On the third lap Li Wei slipped and fell hard, hurting his knee badly',
      'His classmates shouted encouragement and his name from the stands',
      'Li Wei pushed himself up and continued running despite the pain',
      'He overtook two runners on the final lap with his remaining energy',
      'He finished in fifth place with a bleeding knee but a proud smile',
      'He learned that courage is about getting up every time you fall',
    ],
    wordCount: 268,
    difficulty: 2,
    frameworkHint: '开端 → 困难出现 → 摔倒 → 鼓励 → 坚持 → 终点与感悟',
    relatedLearnArticles: ['tp-time-management', 'tm-part-c-opening', 'vo-campus'],
  },

  // ── 故事 4: 教奶奶用手机 (难度 2) ──────────────────────
  {
    id: 'pc-grandma-phone',
    type: 'partC',
    title: '帮奶奶跨越数字鸿沟',
    chineseOutline: '张悦寒假教奶奶用智能手机，用图卡做笔记帮老人一步步学会视频通话。',
    keywords: [
      { en: 'smartphone', zh: '智能手机' },
      { en: 'unlock', zh: '解锁' },
      { en: 'picture card', zh: '图卡' },
      { en: 'video call', zh: '视频通话' },
      { en: 'patience', zh: '耐心' },
    ],
    storyText:
      'During the winter holiday, Zhang Yue spent a lot of time at her grandmother\'s house. One afternoon, she noticed her grandmother staring at a new smartphone lying on the table. "Your uncle bought it for me last week, but I don\'t know how to use it," her grandmother said with a sigh. "I wanted to see your photos, but I cannot even unlock the screen."\n\nZhang Yue felt a lump in her throat. Her grandmother had always been there for her when she was little, teaching her to write and telling her bedtime stories. Now it was her turn to help. She decided to teach her grandmother one simple skill each evening after dinner.\n\nOn the first day, she taught her how to unlock the phone and open the photo album. Her grandmother was excited to see family pictures but forgot the steps by the next morning. Instead of feeling frustrated, Zhang Yue had an idea. She drew a small picture card with colorful arrows and simple labels for each step. She stuck the card on the fridge so her grandmother could check it anytime.\n\nDay by day, they moved on to making phone calls and sending voice messages. One week later, Zhang Yue was doing homework in her room when her phone suddenly buzzed. It was a video call — from her grandmother! The old woman\'s face appeared on the screen, smiling brightly. "I did it all by myself!" she said proudly. "The picture card on the fridge really helped me remember."\n\nZhang Yue\'s eyes filled with happy tears. She realized that patience and love can turn something scary into something joyful. Technology means nothing without the people who teach us how to use it with care.',
    keyPoints: [
      'Zhang Yue spent the winter holiday at her grandmother\'s house',
      'She noticed her grandmother could not use the new smartphone from her uncle',
      'Her grandmother sighed because she could not even unlock the screen',
      'Zhang Yue decided to teach her grandmother one skill each evening after dinner',
      'On the first day she taught her to unlock the phone and open photos',
      'The grandmother forgot the steps by the next morning',
      'Zhang Yue drew picture cards with arrows and labels and stuck them on the fridge',
      'They moved on to phone calls and voice messages over the following days',
      'One week later the grandmother made her first successful video call by herself',
      'Zhang Yue realized patience and love can turn scary technology into something joyful',
    ],
    wordCount: 248,
    difficulty: 2,
    frameworkHint: '问题发现 → 角色互换 → 教学受挫 → 创意方法 → 成功与感悟',
    relatedLearnArticles: ['vo-campus', 'gr-connectors', 'tp-stuck-rescue'],
  },

  // ── 故事 5: 科学展风波 (难度 3) ────────────────────────
  {
    id: 'pc-science-fair',
    type: 'partC',
    title: '科学展前的最后一搏',
    chineseOutline: 'Liu Yang 团队做的智能灌溉系统在科学展前一天出故障，他们冷静排查修复后拿下第一名。',
    keywords: [
      { en: 'irrigation', zh: '灌溉' },
      { en: 'moisture', zh: '湿度' },
      { en: 'pump', zh: '水泵' },
      { en: 'loose wire', zh: '松动的电线' },
      { en: 'trophy', zh: '奖杯' },
    ],
    storyText:
      'Liu Yang and his team of three classmates had been working on their science fair project for over a month. They were building a smart irrigation system that could water plants automatically by sensing the moisture level in the soil. The project combined programming, electronics, and environmental science, and the team felt proud of what they had created.\n\nThe science fair was scheduled for Friday morning. On Thursday afternoon, the team gathered in the school lab to run a final test before the big day. Everything worked perfectly at first. The moisture sensor detected the dry soil, the tiny water pump began to run, and the display screen showed all readings correctly. But then, without any warning, the pump suddenly stopped responding. The sensor readings froze on the screen. Panic spread across every team member\'s face.\n\n"We have less than twenty hours," Wang Lin said anxiously. "Maybe we should give up and show something simpler." Some team members nodded in agreement. But Liu Yang shook his head firmly. "We didn\'t work this hard for a whole month just to quit now," he said. "Let\'s check every single part step by step."\n\nThey divided the work systematically: one member reviewed the code line by line, another examined all the wiring connections, and Liu Yang tested the pump separately with a spare battery. After two intense hours of searching, they finally discovered the problem — a tiny loose wire inside the control box that had probably shaken free during transport. Liu Yang carefully reconnected it, held his breath, and pressed the start button. The system sprang back to life instantly. Everyone cheered and hugged each other.\n\nThe next morning, their smart irrigation system attracted the most attention at the fair. Judges asked detailed technical questions, and the team answered every one of them confidently. When the final results were announced, their project won first prize. As Liu Yang held the golden trophy, he looked at his teammates and said, "The real prize isn\'t this trophy. It\'s knowing that giving up is the only real failure."',
    keyPoints: [
      'The team built a smart irrigation system for the science fair over more than a month',
      'The project combined programming, electronics, and environmental science',
      'The science fair was on Friday, and they ran a final test on Thursday afternoon',
      'The pump suddenly stopped responding and sensor readings froze without warning',
      'Some team members panicked and wanted to give up and show something simpler',
      'Liu Yang insisted they check every part step by step instead of quitting',
      'They found a tiny loose wire inside the control box after two hours of searching',
      'Liu Yang reconnected it and the system started working again',
      'Their project attracted the most attention and won first prize at the fair',
      'Liu Yang said giving up is the only real failure, not losing a competition',
    ],
    wordCount: 277,
    difficulty: 3,
    frameworkHint: '背景 → 事故 → 分歧 → 排查 → 修复 → 成功与感悟',
    relatedLearnArticles: ['tm-part-c-transition', 'tp-stuck-rescue', 'gr-connectors'],
  },

  // ── 故事 6: 山村支教 (难度 3) ──────────────────────────
  {
    id: 'pc-volunteer-trip',
    type: 'partC',
    title: '大山里的第一堂课',
    chineseOutline: 'Chen Mei 去山村小学教英语，孩子们的好学精神深深打动了她，她决定以后成为真正的老师。',
    keywords: [
      { en: 'volunteer', zh: '志愿者' },
      { en: 'rural', zh: '农村的' },
      { en: 'cracked', zh: '破裂的' },
      { en: 'melted her heart', zh: '融化了她的心' },
      { en: 'hunger for', zh: '渴望' },
    ],
    storyText:
      'Chen Mei signed up for a school volunteer program that sent high school students to teach English at a small village school deep in the mountains. She had never been to a rural area before, and the journey itself felt like an adventure. After a four-hour bus ride along winding mountain roads and another hour of walking on a dusty dirt path, they finally arrived at the village.\n\nThe school was much smaller than she had imagined — just two classrooms made of old grey bricks, with worn wooden desks and a blackboard that was cracked down the middle. About thirty children, aged six to twelve, sat crowded together in one room, watching the visitors with wide, curious eyes. Chen Mei suddenly felt very nervous. She had prepared games and English songs, but standing in front of these children, she worried that her lesson would not be good enough for them.\n\nThen a little girl in the very front row slowly raised her hand. "Teacher," she said shyly in broken English, her voice barely above a whisper, "I want to learn. Will you teach me?" That one simple sentence completely melted Chen Mei\'s heart. She smiled warmly and began her lesson with a rush of new energy.\n\nOver the following three days, Chen Mei taught them cheerful English songs, played word games that filled the room with laughter, and helped them practice simple everyday conversations. The children absorbed every word like thirsty sponges and never wanted the lessons to end. On the last day, the same little girl handed Chen Mei a carefully folded piece of paper. Inside was a colorful drawing of a teacher standing beside her students, with the words "Thank you, teacher" written in bright, uneven letters.\n\nOn the long bus ride back home, Chen Mei held the drawing in her hands and made a quiet but firm decision. She would keep coming back to this village every single summer. And one day, she wanted to become a real teacher. The children had given her a gift too: they taught her that education is most powerful when it reaches those who hunger for it most.',
    keyPoints: [
      'Chen Mei signed up to teach English at a small village school deep in the mountains',
      'The journey took a four-hour bus ride plus another hour of walking on a dirt path',
      'The school had only two brick classrooms with worn wooden desks and a cracked blackboard',
      'About thirty children sat crowded in one room watching the visitors with curious eyes',
      'A little girl shyly asked in broken English if Chen Mei would teach her',
      'Chen Mei taught English songs, word games, and simple conversations over three days',
      'The children learned eagerly and never wanted the lessons to end',
      'On the last day the little girl gave Chen Mei a colorful drawing saying "Thank you"',
      'On the bus home Chen Mei decided to come back every summer from then on',
      'She decided to become a real teacher because the children showed her the power of education',
    ],
    wordCount: 280,
    difficulty: 3,
    frameworkHint: '出发动机 → 旅途 → 初见学校 → 克服紧张 → 教学互动 → 离别礼物 → 人生决定',
    relatedLearnArticles: ['tm-part-c-opening', 'tp-prep-minute', 'vo-campus'],
  },
]

// ============================================================
// Mock Exams — 4 套模拟卷, 难度递增
// ============================================================

export const mockExams: MockExam[] = [
  {
    id: 'mock-1',
    title: '模拟卷 1 —— 基础稳分',
    partA: partAPassages[0], // pa-campus-morning (难度 1)
    partB: partBScenarios[1], // pb-clinic-visit (看病场景)
    partC: partCStories[0],   // pc-tom-exam (难度 1)
  },
  {
    id: 'mock-2',
    title: '模拟卷 2 —— 校园生活',
    partA: partAPassages[5], // pa-sports-meeting (难度 2)
    partB: partBScenarios[0], // pb-campus-interview (采访场景)
    partC: partCStories[1],   // pc-lost-dog (难度 1)
  },
  {
    id: 'mock-3',
    title: '模拟卷 3 —— 综合提升',
    partA: partAPassages[4], // pa-online-safety (难度 2)
    partB: partBScenarios[3], // pb-travel-consult (研学咨询)
    partC: partCStories[2],   // pc-rainy-race (难度 2)
  },
  {
    id: 'mock-4',
    title: '模拟卷 4 —— 冲刺挑战',
    partA: partAPassages[7], // pa-cultural-exchange (难度 3)
    partB: partBScenarios[7], // pb-club-interview (社团面试)
    partC: partCStories[4],   // pc-science-fair (难度 3)
  },
]
