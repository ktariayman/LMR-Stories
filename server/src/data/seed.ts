import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import { AppDataSource } from '../config/data-source';
import { Story } from '../entities/Story';
import { StoryTranslation } from '../entities/StoryTranslation';
import { QuizQuestion } from '../entities/QuizQuestion';
import { Achievement } from '../entities/Achievement';
import { fetchFairytales, SeedStory } from './fetchFairytales';
import { translateStory } from '../services/ai';

// ─── Static fallback stories (EN + FR + AR) ───────────────────────────────────
const fallbackStories: SeedStory[] = [
  {
    slug: 'kind-rabbit', difficulty: 'easy', ageGroup: '5-7', theme: 'kindness', themeEmoji: '🐰',
    translations: [
      {
        language: 'en', title: 'The Kind Rabbit', summary: 'Small acts of kindness brighten the world.',
        content: `Once upon a time, in a green meadow, lived a little rabbit named Benny with the softest fur and the biggest heart.\n\nOne rainy morning, Benny found a baby bird with a hurt wing near the bushes. The bird was cold and scared.\n\n"Don't worry," said Benny. "I will help you." He carried the bird to his warm burrow, gave it berries and water, and wrapped its wing with a leaf.\n\nEvery day Benny sang songs and told funny stories. After many days, the bird's wing healed. It flew up into the sky and chirped, "Thank you, Benny!"\n\nFrom then on, the bird visited every morning and sang the most beautiful songs just for him.\n\nBenny learned that when you help others, something wonderful always comes back to you.`
      },
      {
        language: 'fr', title: 'Le Lapin Gentil', summary: 'Les petits gestes de gentillesse illuminent le monde.',
        content: `Il était une fois, dans un pré vert, un petit lapin nommé Benny au plus grand cœur de la forêt.\n\nUn matin pluvieux, il trouva un bébé oiseau avec une aile blessée près des buissons.\n\n« Ne t'inquiète pas, je vais t'aider. » Il le porta dans son terrier chaud et soigna son aile.\n\nChaque jour Benny chantait pour l'oiseau. Après plusieurs jours, l'oiseau s'envola. « Merci Benny ! »\n\nDepuis ce jour, l'oiseau visitait Benny chaque matin et chantait les plus belles mélodies.\n\nBenny apprit que quand on aide les autres, quelque chose de merveilleux revient toujours.`
      },
      { language: 'ar', title: 'الأرنب الطيب', summary: 'الأعمال الطيبة تنير العالم.', content: `في يوم من الأيام، في مرج أخضر، عاش أرنب صغير اسمه بيني بأكبر قلب في الغابة.\n\nفي صباح ماطر، وجد بيني عصفوراً صغيراً بجناح مكسور.\n\nقال بيني بلطف: "لا تقلق، سأساعدك." حمله إلى جحره الدافئ وعالج جناحه.\n\nكل يوم كان بيني يغني للعصفور. بعد أيام، طار العصفور وغرّد: "شكراً يا بيني!"\n\nمنذ ذلك اليوم، كان العصفور يزور بيني كل صباح.\n\nتعلم بيني أن مساعدة الآخرين تجلب الجميل دائماً.` },
    ],
    quiz: [
      {
        language: 'en', questions: [
          { question: 'What did Benny find near the bushes?', options: ['A lost toy', 'A baby bird with a hurt wing', 'A shiny stone'], correct_answer: 'A baby bird with a hurt wing' },
          { question: 'How did Benny help the bird?', options: ['He called a doctor', 'He carried it to his burrow and cared for it', 'He left it alone'], correct_answer: 'He carried it to his burrow and cared for it' },
          { question: 'What did the bird do after it got better?', options: ['It flew away forever', 'It visited Benny every morning', 'It forgot about Benny'], correct_answer: 'It visited Benny every morning' },
        ]
      },
      {
        language: 'fr', questions: [
          { question: "Qu'a trouvé Benny près des buissons?", options: ['Un jouet perdu', 'Un bébé oiseau blessé', 'Une pierre brillante'], correct_answer: 'Un bébé oiseau blessé' },
          { question: "Comment Benny a-t-il aidé l'oiseau?", options: ['Il a appelé un docteur', "Il l'a porté dans son terrier", "Il l'a laissé seul"], correct_answer: "Il l'a porté dans son terrier" },
          { question: "Que fait l'oiseau après sa guérison?", options: ['Il est parti pour toujours', 'Il visite Benny chaque matin', 'Il a oublié Benny'], correct_answer: 'Il visite Benny chaque matin' },
        ]
      },
      {
        language: 'ar', questions: [
          { question: 'ماذا وجد بيني بالقرب من الشجيرات؟', options: ['لعبة ضائعة', 'عصفوراً بجناح مكسور', 'حجراً لامعاً'], correct_answer: 'عصفوراً بجناح مكسور' },
          { question: 'كيف ساعد بيني العصفور؟', options: ['اتصل بالطبيب', 'حمله إلى جحره واعتنى به', 'تركه وحيداً'], correct_answer: 'حمله إلى جحره واعتنى به' },
          { question: 'ماذا فعل العصفور بعد أن تعافى؟', options: ['طار بعيداً للأبد', 'زار بيني كل صباح', 'نسي بيني'], correct_answer: 'زار بيني كل صباح' },
        ]
      },
    ],
  },
  {
    slug: 'brave-lion', difficulty: 'easy', ageGroup: '5-7', theme: 'courage', themeEmoji: '🦁',
    translations: [
      {
        language: 'en', title: 'Leo the Brave Lion', summary: 'Being brave means doing the right thing even when scared.',
        content: `Leo was a lion cub afraid of the dark. Every night he hid under his mother's paw.\n\nOne evening his friend Zara the zebra called, "Leo! I'm lost near the river and it's dark!"\n\nLeo's heart beat fast — the path went through the darkest jungle. But Zara needed him.\n\nHe stepped into the darkness and discovered magic: hundreds of fireflies dancing like tiny stars.\n\nHe found Zara and guided her home. "Weren't you scared?" she asked.\n\n"A little," Leo said. "But helping you was more important."\n\nThat night Leo learned: being brave doesn't mean never being afraid — it means doing the right thing anyway.`
      },
      {
        language: 'fr', title: 'Léo le Lion Courageux', summary: "Être courageux, c'est faire ce qui est juste même quand on a peur.",
        content: `Léo était un lionceau qui avait peur du noir. Chaque soir il se cachait sous la patte de sa maman.\n\nUn soir son amie Zara cria: « Léo! Je suis perdue près de la rivière! »\n\nLe cœur de Léo battait vite. Mais son amie avait besoin de lui.\n\nIl s'avança dans l'obscurité et découvrit les lucioles qui dansaient comme des étoiles.\n\nIl trouva Zara et la ramena chez elle. « Tu n'avais pas peur? » demanda-t-elle.\n\n« Un peu, » dit Léo. « Mais t'aider était plus important. »\n\nLéo apprit que le courage, c'est faire ce qui est juste même quand on a peur.`
      },
      {
        language: 'ar', title: 'ليو الأسد الشجاع', summary: 'الشجاعة تعني فعل الصواب حتى عندما تكون خائفاً.',
        content: `كان ليو شبل أسد يخاف من الظلام.\n\nذات مساء صرخت صديقته زارا: "ليو! أنا ضائعة بالقرب من النهر!"\n\nخاف ليو لكنه خطا في الظلام. اكتشف اليراعات تضيء الطريق.\n\nوجد زارا وأعادها للمنزل. "ألم تكن خائفاً؟" سألت.\n\n"قليلاً، لكن مساعدتك كانت أهم."\n\nتعلم ليو أن الشجاعة تعني فعل الصواب حتى عندما تخاف.`
      },
    ],
    quiz: [
      {
        language: 'en', questions: [
          { question: 'What was Leo afraid of?', options: ['Water', 'The dark', 'Other animals'], correct_answer: 'The dark' },
          { question: 'Who needed Leo\'s help?', options: ['His mother', 'Zara the zebra', 'A lost bird'], correct_answer: 'Zara the zebra' },
          { question: 'What magical thing did Leo see in the dark?', options: ['Stars', 'Fireflies', 'A torch'], correct_answer: 'Fireflies' },
        ]
      },
      {
        language: 'fr', questions: [
          { question: 'De quoi Léo avait-il peur?', options: ["De l'eau", 'Du noir', 'Des autres animaux'], correct_answer: 'Du noir' },
          { question: "Qui avait besoin de l'aide de Léo?", options: ['Sa maman', 'Zara le zèbre', 'Un oiseau perdu'], correct_answer: 'Zara le zèbre' },
          { question: "Qu'a vu Léo dans le noir?", options: ['Des étoiles', 'Des lucioles', 'Une lampe'], correct_answer: 'Des lucioles' },
        ]
      },
      {
        language: 'ar', questions: [
          { question: 'مم كان ليو يخاف؟', options: ['الماء', 'الظلام', 'الحيوانات الأخرى'], correct_answer: 'الظلام' },
          { question: 'من احتاج مساعدة ليو؟', options: ['أمه', 'زارا الحمار الوحشي', 'طائر ضائع'], correct_answer: 'زارا الحمار الوحشي' },
          { question: 'ماذا رأى ليو في الظلام؟', options: ['النجوم', 'اليراعات', 'مصباح'], correct_answer: 'اليراعات' },
        ]
      },
    ],
  },
  {
    slug: 'friendship-bridge', difficulty: 'easy', ageGroup: '5-7', theme: 'friendship', themeEmoji: '🌉',
    translations: [
      {
        language: 'en', title: 'The Friendship Bridge', summary: 'True friendship builds bridges between differences.',
        content: `On one side of a river lived a fox named Felix. On the other side lived a bear named Bruno.\n\nFor years they waved at each other across the water but never talked because they couldn't cross.\n\nOne day Felix had an idea. He began collecting long sticks. Bruno saw him and started gathering big stones.\n\nSlowly, carefully, they each built from their own side. Day by day the bridge grew longer.\n\nWhen the last piece connected, Felix and Bruno ran to the middle and shook hands for the first time.\n\n"I've waited so long to meet you," said Felix.\n"Me too," smiled Bruno.\n\nEvery day after that, they crossed the bridge to visit each other. All the forest animals came to see the bridge two friends built together.`
      },
      {
        language: 'fr', title: 'Le Pont de l\'Amitié', summary: "La vraie amitié construit des ponts par-dessus les différences.",
        content: `D'un côté d'une rivière vivait un renard nommé Félix. De l'autre côté vivait un ours nommé Bruno.\n\nPendant des années, ils se faisaient signe mais ne pouvaient pas se parler.\n\nUn jour Félix eut une idée. Il commença à collecter de longues branches. Bruno le vit et ramassa de grosses pierres.\n\nLentement, ils construisirent chacun depuis leur côté. De jour en jour le pont grandissait.\n\nQuand la dernière pièce fut posée, Félix et Bruno coururent au milieu et se serrèrent la main.\n\n« J'attendais si longtemps de te rencontrer, » dit Félix.\n\nChaque jour après cela, ils traversaient le pont pour se rendre visite.`
      },
      {
        language: 'ar', title: 'جسر الصداقة', summary: 'الصداقة الحقيقية تبني جسوراً فوق الاختلافات.',
        content: `على جانب من النهر عاش ثعلب اسمه فيليكس. على الجانب الآخر عاش دب اسمه برونو.\n\nلسنوات كانا يتلوحان لبعضهما لكنهما لا يستطيعان العبور.\n\nيوماً ما فكر فيليكس في فكرة. بدأ يجمع أعواداً طويلة. رأه برونو فبدأ يجمع أحجاراً كبيرة.\n\nببطء وبعناية، بنى كل منهما من جانبه. يوماً بعد يوم امتد الجسر.\n\nعندما اتصل الجسران، جرى فيليكس وبرونو إلى المنتصف وتصافحا لأول مرة.\n\nقال فيليكس: "انتظرت طويلاً للقائك." ابتسم برونو: "أنا أيضاً."`
      },
    ],
    quiz: [
      {
        language: 'en', questions: [
          { question: 'Why couldn\'t Felix and Bruno meet before?', options: ['They were enemies', 'There was a river between them', 'They were too busy'], correct_answer: 'There was a river between them' },
          { question: 'What did Felix collect to build the bridge?', options: ['Long sticks', 'Big stones', 'Leaves'], correct_answer: 'Long sticks' },
          { question: 'What did they do when the bridge was finished?', options: ['Had a party', 'Ran to the middle and shook hands', 'Called all animals'], correct_answer: 'Ran to the middle and shook hands' },
        ]
      },
      {
        language: 'fr', questions: [
          { question: "Pourquoi Félix et Bruno ne pouvaient-ils pas se rencontrer?", options: ["Ils étaient ennemis", "Il y avait une rivière entre eux", "Ils étaient trop occupés"], correct_answer: "Il y avait une rivière entre eux" },
          { question: "Que collecta Félix?", options: ['De longues branches', 'De grosses pierres', 'Des feuilles'], correct_answer: 'De longues branches' },
          { question: "Que firent-ils quand le pont fut terminé?", options: ['Ils firent une fête', 'Ils coururent au milieu et se serrèrent la main', "Ils appelèrent tous les animaux"], correct_answer: 'Ils coururent au milieu et se serrèrent la main' },
        ]
      },
      {
        language: 'ar', questions: [
          { question: 'لماذا لم يستطع فيليكس وبرونو الالتقاء؟', options: ['كانا عدوّين', 'كان هناك نهر بينهما', 'كانا مشغولَين'], correct_answer: 'كان هناك نهر بينهما' },
          { question: 'ماذا جمع فيليكس؟', options: ['أعواداً طويلة', 'أحجاراً كبيرة', 'أوراق شجر'], correct_answer: 'أعواداً طويلة' },
          { question: 'ماذا فعلا عندما اكتمل الجسر؟', options: ['أقاما حفلة', 'جريا إلى المنتصف وتصافحا', 'نادَيا جميع الحيوانات'], correct_answer: 'جريا إلى المنتصف وتصافحا' },
        ]
      },
    ],
  },
  {
    slug: 'magic-seeds', difficulty: 'medium', ageGroup: '5-7', theme: 'kindness', themeEmoji: '🌱',
    translations: [
      {
        language: 'en', title: 'Mia and the Magic Seeds', summary: 'Kindness and patience make beautiful things grow.',
        content: `Mia was a girl who loved her little garden. One spring morning, an old woman knocked at her gate holding a small bag.\n\n"These are magic seeds," the woman said. "But they only grow for someone with a kind heart."\n\nMia planted the seeds carefully and watered them every day. Weeks passed and nothing grew. The other children laughed. "Your magic seeds are fake!"\n\nBut Mia kept caring for the soil, talking to it, singing to it.\n\nThen one morning, she woke to find her garden overflowing — roses, sunflowers, and herbs filled every corner, more beautiful than anything she had ever seen.\n\nThe old woman appeared smiling. "The seeds grow slowly for kind hearts — but they grow the most beautiful of all."\n\nMia shared the flowers with all her neighbors, and her garden became the most loved spot in the village.`
      },
      {
        language: 'fr', title: 'Mia et les Graines Magiques', summary: 'La gentillesse et la patience font grandir les plus belles choses.',
        content: `Mia aimait son petit jardin. Un matin de printemps, une vieille femme frappa à sa porte avec un petit sac.\n\n« Ce sont des graines magiques. Mais elles ne poussent que pour quelqu'un avec un cœur gentil. »\n\nMia planta les graines soigneusement. Des semaines passèrent sans rien voir. Les autres enfants se moquèrent.\n\nMais Mia continua de soigner la terre, lui parlant et chantant.\n\nUn matin, elle se réveilla et son jardin débordait de roses, tournesols et herbes aromatiques.\n\nLa vieille femme apparut en souriant. « Les graines poussent lentement pour les cœurs gentils — mais elles poussent les plus belles. »`
      },
      {
        language: 'ar', title: 'ميا والبذور السحرية', summary: 'الطيبة والصبر تجعل الأشياء الجميلة تنمو.',
        content: `أحبت ميا حديقتها الصغيرة. في صباح ربيعي، طرقت امرأة عجوز بابها ومعها كيس صغير.\n\n"هذه بذور سحرية. لكنها تنمو فقط لمن يملك قلباً طيباً."\n\nزرعت ميا البذور بعناية وسقتها كل يوم. مرّت أسابيع ولم ينمُ شيء. سخر منها الأطفال الآخرون.\n\nلكن ميا واصلت رعاية التربة.\n\nفي صباح أحد الأيام، استيقظت لتجد حديقتها مليئة بالورود وعباد الشمس والأعشاب.\n\nابتسمت العجوز: "البذور تنمو ببطء للقلوب الطيبة، لكنها تنمو الأجمل."`
      },
    ],
    quiz: [
      {
        language: 'en', questions: [
          { question: 'What did the old woman give Mia?', options: ['A watering can', 'Magic seeds', 'A flower bouquet'], correct_answer: 'Magic seeds' },
          { question: 'What did Mia do while waiting for the seeds to grow?', options: ['Gave up', 'Kept caring, talking and singing to the soil', 'Asked for different seeds'], correct_answer: 'Kept caring, talking and singing to the soil' },
          { question: 'What appeared in Mia\'s garden?', options: ['Only grass', 'Roses, sunflowers and herbs', 'Vegetables only'], correct_answer: 'Roses, sunflowers and herbs' },
        ]
      },
      {
        language: 'fr', questions: [
          { question: "Qu'est-ce que la vieille femme donna à Mia?", options: ["Un arrosoir", "Des graines magiques", "Un bouquet de fleurs"], correct_answer: "Des graines magiques" },
          { question: "Que fit Mia en attendant?", options: ["Elle abandonna", "Elle continua de soigner, parler et chanter", "Elle demanda d'autres graines"], correct_answer: "Elle continua de soigner, parler et chanter" },
          { question: "Qu'est-ce qui poussa dans le jardin de Mia?", options: ["Seulement de l'herbe", "Des roses, tournesols et herbes", "Seulement des légumes"], correct_answer: "Des roses, tournesols et herbes" },
        ]
      },
      {
        language: 'ar', questions: [
          { question: 'ماذا أعطت العجوز لميا؟', options: ['مرشة ماء', 'بذوراً سحرية', 'باقة ورود'], correct_answer: 'بذوراً سحرية' },
          { question: 'ماذا فعلت ميا أثناء انتظار نمو البذور؟', options: ['استسلمت', 'واصلت الرعاية والغناء والحديث للتربة', 'طلبت بذوراً أخرى'], correct_answer: 'واصلت الرعاية والغناء والحديث للتربة' },
          { question: 'ماذا نما في حديقة ميا؟', options: ['عشب فقط', 'ورود وعباد شمس وأعشاب', 'خضروات فقط'], correct_answer: 'ورود وعباد شمس وأعشاب' },
        ]
      },
    ],
  },
  {
    slug: 'lost-star', difficulty: 'medium', ageGroup: '8-10', theme: 'adventure', themeEmoji: '⭐',
    translations: [
      {
        language: 'en', title: 'The Lost Star', summary: 'Helping others find their way can help you find your own.',
        content: `High above the clouds, in the vast night sky, lived hundreds of stars. Each star had a special place and a special job: to guide travelers home.\n\nOne night, a young star named Stella wandered too far and got lost. She had never been so far from the sky village before.\n\n"Hello?" she called, but only silence answered.\n\nStella tried to remember what her teacher had said: "If you're lost, look for those who need guiding."\n\nBelow, she spotted a sailor on a stormy sea, his ship lost in the waves. Stella gathered all her courage and shone as brightly as she could.\n\nThe sailor looked up. "A star! Follow the star!" He steered his ship safely to harbor.\n\nAs Stella watched the ship dock safely, she realized — she could see her way home now too. The act of lighting the way for someone else had lit her own path.\n\n"Home," she whispered, and floated back to her spot in the sky, brighter than ever.`
      },
      {
        language: 'fr', title: 'L\'Étoile Perdue', summary: 'Aider les autres à trouver leur chemin peut vous aider à trouver le vôtre.',
        content: `Haut au-dessus des nuages, dans le vaste ciel nocturne, vivaient des centaines d'étoiles. Chacune avait un travail: guider les voyageurs.\n\nUne nuit, une jeune étoile nommée Stella s'aventura trop loin et se perdit.\n\n« Allô? » appela-t-elle, mais seul le silence répondit.\n\nElle se souvint des paroles de son professeur: « Si tu te perds, cherche ceux qui ont besoin d'être guidés. »\n\nEn bas, elle aperçut un marin sur une mer agitée. Stella rassembla tout son courage et brilla de toutes ses forces.\n\nLe marin leva les yeux. « Une étoile! Suivons l'étoile! » Il guida son navire vers le port.\n\nEn regardant le navire arriver, Stella réalisa qu'elle voyait maintenant son propre chemin.\n\n« Maison, » chuchota-t-elle, et elle flotta vers sa place dans le ciel, plus brillante que jamais.`
      },
      {
        language: 'ar', title: 'النجمة الضائعة', summary: 'مساعدة الآخرين على إيجاد طريقهم يساعدك على إيجاد طريقك.',
        content: `في السماء المرصعة بالنجوم، عاشت نجمة صغيرة اسمها ستيلا. ذهبت بعيداً وضاعت.\n\n"مرحباً؟" نادت، لكن الصمت أجابها.\n\nتذكرت كلمات معلمها: "إذا ضعت، ابحث عمن يحتاج إلى إرشاد."\n\nرأت بحاراً في بحر عاصف. جمعت ستيلا شجاعتها وأضاءت بأقصى ما تستطيع.\n\nنظر البحار للأعلى. "نجمة! اتبعوا النجمة!" وقاد سفينته إلى الميناء.\n\nبينما كانت ستيلا تشاهد السفينة ترسو بأمان، أدركت أنها تستطيع الآن رؤية طريقها للمنزل.\n\nهمست: "المنزل"، وعادت إلى مكانها في السماء أكثر إشراقاً من أي وقت مضى.`
      },
    ],
    quiz: [
      {
        language: 'en', questions: [
          { question: 'What is the job of stars in this story?', options: ['To look pretty', 'To guide travelers home', 'To light up storms'], correct_answer: 'To guide travelers home' },
          { question: 'How did Stella help herself find the way home?', options: ['She asked other stars', 'She helped a sailor first', 'She followed the wind'], correct_answer: 'She helped a sailor first' },
          { question: 'What did Stella\'s teacher say to do when lost?', options: ['Stay still and wait', 'Look for those who need guiding', 'Shine as bright as possible'], correct_answer: 'Look for those who need guiding' },
        ]
      },
      {
        language: 'fr', questions: [
          { question: 'Quel est le travail des étoiles dans cette histoire?', options: ['Être belles', 'Guider les voyageurs', 'Éclairer les tempêtes'], correct_answer: 'Guider les voyageurs' },
          { question: 'Comment Stella trouva-t-elle son chemin?', options: ["Elle demanda à d'autres étoiles", 'Elle aida un marin d\'abord', 'Elle suivit le vent'], correct_answer: "Elle aida un marin d'abord" },
          { question: "Que dit le professeur de Stella quand on se perd?", options: ['Rester immobile', 'Chercher ceux qui ont besoin d\'être guidés', 'Briller le plus possible'], correct_answer: "Chercher ceux qui ont besoin d'être guidés" },
        ]
      },
      {
        language: 'ar', questions: [
          { question: 'ما هي وظيفة النجوم في هذه القصة؟', options: ['أن تكون جميلة', 'إرشاد المسافرين للمنزل', 'إضاءة العواصف'], correct_answer: 'إرشاد المسافرين للمنزل' },
          { question: 'كيف وجدت ستيلا طريقها للمنزل؟', options: ['سألت نجوماً أخرى', 'ساعدت بحاراً أولاً', 'تتبعت الريح'], correct_answer: 'ساعدت بحاراً أولاً' },
          { question: 'ماذا قال معلم ستيلا عند الضياع؟', options: ['ابقَ ساكناً وانتظر', 'ابحث عمن يحتاج إرشاداً', 'أضئ بأقصى قوتك'], correct_answer: 'ابحث عمن يحتاج إرشاداً' },
        ]
      },
    ],
  },
];

// ─── Achievements ─────────────────────────────────────────────────────────────
const achievementsSeed = [
  { slug: 'first-story', title: 'First Story', description: 'Read your first story', emoji: '📖', requirementType: 'stories_completed', requirementValue: 1 },
  { slug: 'bookworm', title: 'Bookworm', description: 'Read 5 stories', emoji: '🐛', requirementType: 'stories_completed', requirementValue: 5 },
  { slug: 'story-master', title: 'Story Master', description: 'Read 10 stories', emoji: '👑', requirementType: 'stories_completed', requirementValue: 10 },
  { slug: 'avid-reader', title: 'Avid Reader', description: 'Read 25 stories', emoji: '📚', requirementType: 'stories_completed', requirementValue: 25 },
  { slug: 'perfect-score', title: 'Perfect Score', description: 'Get a perfect quiz score', emoji: '💯', requirementType: 'perfect_quizzes', requirementValue: 1 },
  { slug: 'quiz-champion', title: 'Quiz Champion', description: 'Get 5 perfect scores', emoji: '🏆', requirementType: 'perfect_quizzes', requirementValue: 5 },
  { slug: 'bilingual', title: 'Bilingual Reader', description: 'Read in 2 languages', emoji: '🌍', requirementType: 'languages_used', requirementValue: 2 },
  { slug: 'polyglot', title: 'Polyglot', description: 'Read in 3 languages', emoji: '🗺️', requirementType: 'languages_used', requirementValue: 3 },
];

// ─── Seed function ─────────────────────────────────────────────────────────────
async function seedAchievements() {
  const repo = AppDataSource.getRepository(Achievement);
  for (const a of achievementsSeed) {
    const existing = await repo.findOne({ where: { slug: a.slug } });
    if (!existing) {
      await repo.save(repo.create(a));
      console.log(`  ✓ Achievement: ${a.title}`);
    }
  }
}

async function seedStory(story: SeedStory) {
  const storyRepo = AppDataSource.getRepository(Story);
  const transRepo = AppDataSource.getRepository(StoryTranslation);
  const quizRepo = AppDataSource.getRepository(QuizQuestion);

  const existing = await storyRepo.findOne({ where: { slug: story.slug } });
  if (existing) return; // Idempotent — skip if exists


  const saved = await storyRepo.save(storyRepo.create({
    slug: story.slug,
    difficulty: story.difficulty,
    ageGroup: story.ageGroup,
    theme: story.theme,
    themeEmoji: story.themeEmoji,
    storyType: 'official',
    isPublic: true,
    isAiGenerated: false,
  }));

  for (const t of story.translations) {
    await transRepo.save(transRepo.create({
      storyId: saved.id,
      language: t.language,
      title: t.title,
      content: t.content,
      summary: t.summary,
    }));
  }

  for (const langQuiz of story.quiz) {
    for (let i = 0; i < langQuiz.questions.length; i++) {
      const q = langQuiz.questions[i];
      await quizRepo.save(quizRepo.create({
        storyId: saved.id,
        language: langQuiz.language,
        question: q.question,
        options: q.options,
        correctAnswer: q.correct_answer,
        sortOrder: i,
      }));
    }
  }

  return saved;
}

const ALL_LANGS = ['en', 'fr', 'ar'];

async function fillMissingTranslations(storyId: string, story: SeedStory) {
  const existingLangs = story.translations.map((t) => t.language);
  const missingLangs = ALL_LANGS.filter((l) => !existingLangs.includes(l));
  if (missingLangs.length === 0) return;

  if (!process.env.GROQ_API_KEY && !process.env.OLLAMA_URL) {
    console.warn(`  ⚠ No AI provider — skipping translation for ${missingLangs.join(', ')}`);
    return;
  }

  const transRepo = AppDataSource.getRepository(StoryTranslation);
  const quizRepo = AppDataSource.getRepository(QuizQuestion);

  // Use EN as source, fall back to first available
  const source = story.translations.find((t) => t.language === 'en') || story.translations[0];
  const sourceQuiz = story.quiz.find((q) => q.language === source.language);

  // Truncate long stories to stay within Groq free tier limits (~3000 words)
  const MAX_WORDS = 2500;
  let content = source.content;
  const words = content.split(/\s+/);
  if (words.length > MAX_WORDS) {
    content = words.slice(0, MAX_WORDS).join(' ') + '...';
  }

  for (const targetLang of missingLangs) {
    try {
      const translated = await translateStory({
        title: source.title,
        content,
        summary: source.summary,
        quiz: (sourceQuiz?.questions || []).map((q) => ({
          question: q.question,
          options: q.options,
          correct_answer: q.correct_answer,
        })),
        source_language: source.language,
        target_language: targetLang,
      });

      await transRepo.save(transRepo.create({
        storyId,
        language: targetLang,
        title: translated.title,
        content: translated.content,
        summary: translated.summary,
      }));

      for (let i = 0; i < translated.quiz.length; i++) {
        await quizRepo.save(quizRepo.create({
          storyId,
          language: targetLang,
          question: translated.quiz[i].question,
          options: translated.quiz[i].options,
          correctAnswer: translated.quiz[i].correct_answer,
          sortOrder: i,
        }));
      }

      process.stdout.write(`[${targetLang}]`);
      // Small delay between translations to avoid TPM rate limits
      await new Promise((r) => setTimeout(r, 3000));
    } catch (err: any) {
      console.warn(`\n  ✗ translate→${targetLang} failed: ${err.message}`);
    }
  }
}

async function main() {
  await AppDataSource.initialize();
  await AppDataSource.runMigrations();
  console.log('Migrations complete');

  // Try HuggingFace first, fall back to static stories
  let stories = await fetchFairytales();
  if (stories.length === 0) {
    console.log('Using fallback stories');
    stories = fallbackStories;
  } else {
    // Also add fallback stories (they have full EN/FR/AR)
    stories = [...stories, ...fallbackStories];
  }

  console.log(`\nSeeding ${stories.length} stories...`);
  let seeded = 0;
  for (const story of stories) {
    const result = await seedStory(story);
    if (result) {
      seeded++;
      process.stdout.write('.');
      // Auto-translate missing languages via AI
      await fillMissingTranslations(result.id, story);
    }
  }
  console.log(`\n✓ Seeded ${seeded} new stories (skipped duplicates)`);

  // Fill missing translations for ALL existing stories
  console.log('\nChecking existing stories for missing translations...');
  const allStories = await AppDataSource.getRepository(Story).find({ relations: ['translations'] });
  let filled = 0;
  for (const existing of allStories) {
    const existingLangs = existing.translations.map((t: any) => t.language);
    const missingLangs = ALL_LANGS.filter((l) => !existingLangs.includes(l));
    if (missingLangs.length === 0) continue;

    // Build a SeedStory-like object from the existing data
    const sourceTrans = existing.translations.find((t: any) => t.language === 'en') || existing.translations[0];
    if (!sourceTrans) continue;

    const existingQuiz = await AppDataSource.getRepository(QuizQuestion).find({
      where: { storyId: existing.id, language: sourceTrans.language },
      order: { sortOrder: 'ASC' },
    });

    const fakeStory: SeedStory = {
      slug: existing.slug,
      difficulty: existing.difficulty as any,
      ageGroup: existing.ageGroup as any,
      theme: existing.theme,
      themeEmoji: existing.themeEmoji,
      translations: existing.translations.map((t: any) => ({
        language: t.language, title: t.title, content: t.content, summary: t.summary,
      })),
      quiz: [{
        language: sourceTrans.language,
        questions: existingQuiz.map((q) => ({
          question: q.question, options: q.options, correct_answer: q.correctAnswer,
        })),
      }],
    };

    process.stdout.write(`\n  ${existing.slug} missing [${missingLangs.join(',')}] `);
    await fillMissingTranslations(existing.id, fakeStory);
    filled++;
  }
  console.log(`\n✓ Checked ${allStories.length} stories, filled translations for ${filled}`);

  await seedAchievements();
  console.log('\n✓ Seed complete!');

  await AppDataSource.destroy();
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
