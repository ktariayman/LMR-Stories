import { SeedStory } from './fetchFairytales';

/**
 * Additional fallback stories to bring the library to 25+ stories.
 * Each story has EN translation with quiz. FR/AR translations are auto-generated
 * by the seed script via AI if a provider is configured.
 */
export const additionalStories: SeedStory[] = [
  {
    slug: 'clever-turtle', difficulty: 'easy', ageGroup: '5-7', theme: 'courage', themeEmoji: '🐢',
    translations: [{
      language: 'en', title: 'The Clever Turtle',
      summary: 'Being slow doesn\'t mean being weak — cleverness wins the day.',
      content: `In a sunny pond lived a small turtle named Tilly. She was the slowest animal in the forest, and some animals teased her about it.\n\nOne day, a sneaky fox trapped all the pond fish in a net. "Nobody can stop me!" he laughed.\n\nThe fast rabbit tried to grab the net but the fox was too quick. The strong bear tried to pull it but the fox had tied it to a big rock.\n\nTilly had an idea. She slowly crawled to the net and chewed through one tiny rope at a time. The fox didn't notice — who watches a slow turtle?\n\nBy sunset, the net fell apart and all the fish swam free!\n\n"How did you do that?" asked the rabbit.\n\n"Sometimes," Tilly smiled, "being slow and patient is the best superpower of all."`
    }],
    quiz: [{
      language: 'en', questions: [
        { question: 'What did the fox trap in his net?', options: ['Birds', 'Fish', 'Frogs'], correct_answer: 'Fish' },
        { question: 'How did Tilly free the fish?', options: ['She scared the fox', 'She chewed through the ropes slowly', 'She called for help'], correct_answer: 'She chewed through the ropes slowly' },
        { question: 'What is Tilly\'s superpower?', options: ['Speed', 'Strength', 'Patience'], correct_answer: 'Patience' },
      ]
    }],
  },
  {
    slug: 'rainbow-painter', difficulty: 'easy', ageGroup: '5-7', theme: 'kindness', themeEmoji: '🌈',
    translations: [{
      language: 'en', title: 'The Rainbow Painter',
      summary: 'Sharing your gifts with others makes the world more colorful.',
      content: `In a village where everything was gray, there lived a girl named Rosa who could paint with magical colors.\n\nRosa painted her own house in beautiful reds, blues, and yellows. It was the prettiest house in the village.\n\nHer neighbor, old Mr. Gray, looked at his plain house sadly. Rosa noticed and painted his door a cheerful orange.\n\nMr. Gray smiled for the first time in years! Soon Rosa was painting all the houses — purple roofs, green fences, pink walls.\n\nThe village became famous. People traveled from far away to see the Rainbow Village.\n\n"You could have kept the colors for yourself," said her friend.\n\n"Colors are meant to be shared," Rosa said. "The more you give away, the brighter everything becomes."`
    }],
    quiz: [{
      language: 'en', questions: [
        { question: 'What was special about the village at first?', options: ['It was very colorful', 'Everything was gray', 'It was underwater'], correct_answer: 'Everything was gray' },
        { question: 'What did Rosa paint on Mr. Gray\'s house?', options: ['A rainbow', 'A cheerful orange door', 'His name'], correct_answer: 'A cheerful orange door' },
        { question: 'What lesson did Rosa teach?', options: ['Keep special things to yourself', 'Colors are meant to be shared', 'Gray is beautiful too'], correct_answer: 'Colors are meant to be shared' },
      ]
    }],
  },
  {
    slug: 'night-owl-library', difficulty: 'medium', ageGroup: '8-10', theme: 'adventure', themeEmoji: '🦉',
    translations: [{
      language: 'en', title: 'The Night Owl\'s Library',
      summary: 'Books can take you on the greatest adventures without leaving home.',
      content: `Deep in an old oak tree lived Olivia the owl, who had the most wonderful secret: a library hidden in the hollow trunk.\n\nEvery night, forest animals would sneak to her tree. "Olivia, read us a story!" they'd whisper.\n\nOlivia would open a book and something magical happened — the words floated off the pages and became real! Pirates sailed across the branches, dragons breathed sparkly smoke, and princesses danced on leaves.\n\nOne stormy night, nobody came. Olivia felt lonely. She opened a book anyway and read aloud to the empty room.\n\nBut the story was about friendship, and as she read, the words drifted out through the rain, through windows and burrows, reaching every animal in the forest.\n\nThe next night, twice as many animals came. "We heard your story through the rain," they said. "It made us feel warm inside."\n\nOlivia learned that stories have a magic of their own — they always find the hearts that need them most.`
    }],
    quiz: [{
      language: 'en', questions: [
        { question: 'Where was Olivia\'s library hidden?', options: ['In a cave', 'In a hollow oak tree', 'Under a bridge'], correct_answer: 'In a hollow oak tree' },
        { question: 'What happened when Olivia read stories?', options: ['Everyone fell asleep', 'The words became real', 'The tree grew taller'], correct_answer: 'The words became real' },
        { question: 'How did the animals hear the story on the stormy night?', options: ['Through a phone', 'The words drifted through the rain', 'Olivia shouted loudly'], correct_answer: 'The words drifted through the rain' },
      ]
    }],
  },
  {
    slug: 'dancing-elephant', difficulty: 'easy', ageGroup: '5-7', theme: 'animals', themeEmoji: '🐘',
    translations: [{
      language: 'en', title: 'Ellie the Dancing Elephant',
      summary: 'It\'s okay to be different — your unique talents make you special.',
      content: `All elephants in the herd were big, strong, and serious. Except Ellie.\n\nEllie loved to dance. When the wind blew, she swayed. When birds sang, she twirled. When rain fell, she splashed and spun.\n\n"Elephants don't dance!" said her uncle. "We march! We stomp! We are serious!"\n\nEllie felt sad and tried to stop dancing. But her feet wouldn't listen.\n\nOne day, a group of scared baby elephants got stuck in mud. They were crying.\n\nEllie danced toward them, splashing and spinning. The babies stopped crying and started laughing! They wiggled and jiggled until the mud let them go.\n\n"How did you do that?" asked her uncle.\n\n"Dancing makes everything better," said Ellie.\n\nFrom that day on, Ellie was the most popular elephant. And her uncle? He secretly practiced dancing too.`
    }],
    quiz: [{
      language: 'en', questions: [
        { question: 'What did Ellie love to do?', options: ['March', 'Dance', 'Sleep'], correct_answer: 'Dance' },
        { question: 'What happened to the baby elephants?', options: ['They got lost', 'They got stuck in mud', 'They fell asleep'], correct_answer: 'They got stuck in mud' },
        { question: 'How did Ellie help the babies?', options: ['She pulled them out', 'She danced and made them laugh until they wiggled free', 'She called for help'], correct_answer: 'She danced and made them laugh until they wiggled free' },
      ]
    }],
  },
  {
    slug: 'whispering-wind', difficulty: 'medium', ageGroup: '8-10', theme: 'courage', themeEmoji: '🍃',
    translations: [{
      language: 'en', title: 'The Whispering Wind',
      summary: 'Listening to your inner voice takes courage, but it always leads you true.',
      content: `In a mountain village, a boy named Kai could hear something nobody else could: the wind whispering secrets.\n\n"The river will flood tomorrow," the wind told him one autumn day.\n\nKai ran to the village elders. "We must move to higher ground!"\n\nThe elders laughed. "The river has never flooded. Go play, little boy."\n\nKai could have given up. Instead, he went door to door. Some families listened. Most didn't.\n\nThat night, the river roared and rose. The families who listened to Kai were safe on the hill. The others barely escaped.\n\nThe village elder found Kai on the hilltop. "How did you know?"\n\n"The wind told me," Kai said simply.\n\n"And you had the courage to speak up even when no one believed you. That takes a special kind of bravery."\n\nFrom then on, the village always listened when Kai spoke — and the wind kept sharing its secrets.`
    }],
    quiz: [{
      language: 'en', questions: [
        { question: 'What could Kai hear that others couldn\'t?', options: ['Animals talking', 'The wind whispering secrets', 'Underground water'], correct_answer: 'The wind whispering secrets' },
        { question: 'What did the elders do when Kai warned them?', options: ['They listened immediately', 'They laughed and didn\'t believe him', 'They moved to the hill'], correct_answer: 'They laughed and didn\'t believe him' },
        { question: 'What kind of bravery did Kai show?', options: ['Fighting a monster', 'Speaking up when nobody believed him', 'Running very fast'], correct_answer: 'Speaking up when nobody believed him' },
      ]
    }],
  },
  {
    slug: 'tiny-dragon', difficulty: 'easy', ageGroup: '5-7', theme: 'friendship', themeEmoji: '🐉',
    translations: [{
      language: 'en', title: 'The Tiny Dragon',
      summary: 'Size doesn\'t matter when you have a big heart and good friends.',
      content: `All dragons were big and fierce. All except Spark, who was no bigger than a kitten.\n\n"You're too small to be a dragon!" the big dragons said.\n\nSpark couldn't breathe fire — only tiny warm puffs. He couldn't fly high — only hover a little.\n\nOne cold winter, a little girl named Lily got lost in the snow. The big dragons were too scary to help.\n\nBut Spark flew down gently. He breathed his warm puffs on Lily's cold hands.\n\n"You're not scary at all!" Lily giggled.\n\nSpark led her home with his soft glow. From that day, Lily and Spark were best friends.\n\nThe big dragons finally understood: sometimes the smallest dragon can do what the biggest cannot — make a friend.`
    }],
    quiz: [{
      language: 'en', questions: [
        { question: 'How big was Spark?', options: ['As big as a house', 'No bigger than a kitten', 'As big as a horse'], correct_answer: 'No bigger than a kitten' },
        { question: 'Why couldn\'t the big dragons help Lily?', options: ['They were sleeping', 'They were too scary', 'They couldn\'t see her'], correct_answer: 'They were too scary' },
        { question: 'What did Spark breathe?', options: ['Big fire', 'Tiny warm puffs', 'Ice'], correct_answer: 'Tiny warm puffs' },
      ]
    }],
  },
  {
    slug: 'garden-under-sea', difficulty: 'medium', ageGroup: '8-10', theme: 'animals', themeEmoji: '🐠',
    translations: [{
      language: 'en', title: 'The Garden Under the Sea',
      summary: 'Taking care of nature means taking care of our home.',
      content: `Deep beneath the ocean waves, a young seahorse named Coral tended the most beautiful underwater garden. Anemones swayed like flowers, and colorful fish danced among the coral.\n\nOne day, strange dark clouds appeared in the water. Trash from above was sinking down — plastic bags, bottles, and cans.\n\nThe fish fled. The anemones closed up. Coral's garden was dying.\n\n"We can't fix what the land creatures do," said the old octopus.\n\nBut Coral wouldn't give up. She organized the fish, the crabs, the starfish. Together they picked up every piece of trash and piled it where the currents would carry it to shore.\n\nA girl walking on the beach found the pile. She understood the message and started a beach cleanup crew.\n\nSoon the water cleared. Coral's garden bloomed again, more beautiful than before. The girl visited with her diving mask and smiled at the garden she'd helped save.\n\n"Even the smallest creatures can inspire the biggest changes," Coral told her fish friends.`
    }],
    quiz: [{
      language: 'en', questions: [
        { question: 'What was Coral?', options: ['A fish', 'A seahorse', 'A starfish'], correct_answer: 'A seahorse' },
        { question: 'What was destroying the underwater garden?', options: ['A storm', 'Trash from above', 'A shark'], correct_answer: 'Trash from above' },
        { question: 'What did the girl on the beach do?', options: ['She ignored the trash', 'She started a beach cleanup crew', 'She threw more trash in'], correct_answer: 'She started a beach cleanup crew' },
      ]
    }],
  },
  {
    slug: 'moon-cheese', difficulty: 'easy', ageGroup: '5-7', theme: 'adventure', themeEmoji: '🌙',
    translations: [{
      language: 'en', title: 'The Mouse Who Flew to the Moon',
      summary: 'Big dreams can come true with creativity and determination.',
      content: `Morris the mouse had one dream: to visit the moon. Everyone said it was made of cheese, and Morris loved cheese more than anything.\n\n"Mice can't fly to the moon!" laughed the cat.\n\nBut Morris built a tiny rocket from a tin can, a firework, and an old umbrella.\n\n"3... 2... 1..." WHOOSH! Morris shot up into the sky! Higher and higher until — bump! — he landed on the moon.\n\nThe moon wasn't cheese. It was rocky and dusty. Morris was disappointed.\n\nThen he looked back at Earth. It was the most beautiful thing he'd ever seen — blue and green and swirling with clouds.\n\n"The moon isn't cheese," he said. "But the journey was the best adventure ever!"\n\nMorris flew home and told everyone: the moon isn't cheese, but the view is worth the trip.`
    }],
    quiz: [{
      language: 'en', questions: [
        { question: 'Why did Morris want to visit the moon?', options: ['To meet aliens', 'He heard it was made of cheese', 'To see the stars'], correct_answer: 'He heard it was made of cheese' },
        { question: 'What did Morris build his rocket from?', options: ['Wood and nails', 'A tin can, firework, and umbrella', 'Paper and glue'], correct_answer: 'A tin can, firework, and umbrella' },
        { question: 'What was the best part of the trip?', options: ['Eating moon cheese', 'The journey and the view of Earth', 'Meeting moon people'], correct_answer: 'The journey and the view of Earth' },
      ]
    }],
  },
  {
    slug: 'music-forest', difficulty: 'easy', ageGroup: '5-7', theme: 'friendship', themeEmoji: '🎵',
    translations: [{
      language: 'en', title: 'The Music of the Forest',
      summary: 'When everyone plays together, the music is always better.',
      content: `In a forest, each animal played a different instrument. Rabbit played drums, Deer played flute, and Bear played a big bass.\n\nBut they never played together. Each one thought their music was the best.\n\nOne evening, a little songbird arrived. She had no instrument at all — just her voice.\n\nShe sang a simple melody. Rabbit tapped along. Then Deer joined in. Then Bear. Soon the whole forest was making music together.\n\nThe sound was more beautiful than anything they'd ever heard alone.\n\n"How did you do that?" asked Bear.\n\n"I just sang," said the songbird. "The magic was already in all of you. You just needed to play together."\n\nEvery evening after that, the forest animals gathered to play their music. And travelers from far away would stop and listen to the most beautiful orchestra in the world.`
    }],
    quiz: [{
      language: 'en', questions: [
        { question: 'What instrument did Bear play?', options: ['Drums', 'Flute', 'Bass'], correct_answer: 'Bass' },
        { question: 'Why didn\'t the animals play together at first?', options: ['They didn\'t know how', 'Each thought their music was the best', 'They were too far apart'], correct_answer: 'Each thought their music was the best' },
        { question: 'What instrument did the songbird play?', options: ['Piano', 'None — just her voice', 'Guitar'], correct_answer: 'None — just her voice' },
      ]
    }],
  },
  {
    slug: 'shadow-friend', difficulty: 'easy', ageGroup: '5-7', theme: 'courage', themeEmoji: '👤',
    translations: [{
      language: 'en', title: 'My Shadow Friend',
      summary: 'What we fear is often just something we don\'t understand yet.',
      content: `Every night, when Mom turned off the light, Zoe saw a shadow on her wall. A big, scary shadow with long arms.\n\n"There's a monster!" she'd cry.\n\nOne night, Zoe was very brave. Instead of hiding, she walked toward the shadow.\n\nShe reached out her hand... and the shadow reached back. It wasn't a monster at all — it was the shadow of the tree outside her window!\n\nWhen the wind blew, the branches waved, making the shadow dance. Zoe laughed.\n\n"You're not scary! You're just a tree dancing!"\n\nShe named the shadow Danny and every night before sleep, she'd wave at Danny and Danny would wave back.\n\nZoe learned that most scary things become friendly when you're brave enough to look closer.`
    }],
    quiz: [{
      language: 'en', questions: [
        { question: 'What did Zoe think the shadow was?', options: ['A bird', 'A monster', 'Her dad'], correct_answer: 'A monster' },
        { question: 'What was the shadow really?', options: ['A cat', 'The shadow of a tree', 'A coat'], correct_answer: 'The shadow of a tree' },
        { question: 'What did Zoe name the shadow?', options: ['Danny', 'Shadow', 'Tree'], correct_answer: 'Danny' },
      ]
    }],
  },
  {
    slug: 'golden-fish', difficulty: 'medium', ageGroup: '8-10', theme: 'kindness', themeEmoji: '🐟',
    translations: [{
      language: 'en', title: 'The Golden Fish\'s Wish',
      summary: 'The best wishes are the ones you make for others.',
      content: `A fisherman named Omar caught a golden fish one morning. "Let me go," said the fish, "and I'll grant you three wishes."\n\nOmar thought carefully. He could wish for gold, or a palace, or to be king.\n\nBut then he looked around. His village had no school. The children couldn't read.\n\n"I wish for a school for the children," he said.\n\nA beautiful school appeared. The children cheered!\n\nNext, he noticed the village well was dry. "I wish for fresh, clean water."\n\nA sparkling fountain appeared in the village square.\n\nFor his last wish, Omar looked at the golden fish. "I wish for you to be free."\n\nThe fish was amazed. "In all my years, no one has ever wished for my freedom. For your kindness, your village will always have what it needs."\n\nAnd so it did. The school grew, the water flowed, and the village became the happiest place in the land — all because one man wished for others instead of himself.`
    }],
    quiz: [{
      language: 'en', questions: [
        { question: 'What was Omar\'s first wish?', options: ['Gold', 'A school for the children', 'A big house'], correct_answer: 'A school for the children' },
        { question: 'What did Omar wish for the golden fish?', options: ['More wishes', 'Freedom', 'To stay with him'], correct_answer: 'Freedom' },
        { question: 'Why was the fish amazed?', options: ['Omar was rich', 'No one had ever wished for the fish\'s freedom', 'Omar could talk to fish'], correct_answer: 'No one had ever wished for the fish\'s freedom' },
      ]
    }],
  },
  {
    slug: 'cloud-collector', difficulty: 'easy', ageGroup: '5-7', theme: 'adventure', themeEmoji: '☁️',
    translations: [{
      language: 'en', title: 'The Cloud Collector',
      summary: 'Imagination turns ordinary things into extraordinary adventures.',
      content: `Amara lived on a hill and her favorite thing was watching clouds.\n\n"That one looks like a bunny!" she'd say. "That one looks like a castle!"\n\nOne day, a cloud drifted so low it touched the ground. Amara reached up and grabbed it. It was soft like cotton candy!\n\nShe put the cloud in a jar. Then she caught another, and another. Soon she had a whole collection!\n\nBut the sky looked empty and sad without its clouds. The sun was too hot. The flowers were thirsty.\n\nAmara opened all her jars. The clouds floated up, making rain that watered the flowers.\n\n"Some things are more beautiful when they're free," she said.\n\nAfter that, Amara still watched clouds every day — but she let them dance in the sky where they belonged.`
    }],
    quiz: [{
      language: 'en', questions: [
        { question: 'What did Amara love to watch?', options: ['Stars', 'Clouds', 'Birds'], correct_answer: 'Clouds' },
        { question: 'What happened when she collected all the clouds?', options: ['It got cold', 'The sky was empty and flowers got thirsty', 'Nothing changed'], correct_answer: 'The sky was empty and flowers got thirsty' },
        { question: 'What did Amara learn?', options: ['Clouds taste good', 'Some things are more beautiful when free', 'Jars are useful'], correct_answer: 'Some things are more beautiful when free' },
      ]
    }],
  },
  {
    slug: 'invisible-superhero', difficulty: 'easy', ageGroup: '5-7', theme: 'kindness', themeEmoji: '🦸',
    translations: [{
      language: 'en', title: 'The Invisible Superhero',
      summary: 'Real superheroes don\'t need capes — they just need caring hearts.',
      content: `Sam wanted to be a superhero. He tried to fly — THUD! He tried super strength — he couldn't even open the pickle jar.\n\n"I'll never be a superhero," he sighed.\n\nThen he noticed his neighbor struggling with grocery bags. He ran to help.\n\nAt school, a new kid sat alone at lunch. Sam sat next to her and shared his cookies.\n\nOn the way home, he picked up trash in the park. He held the door for an old lady.\n\nThat evening, Mom said, "Mrs. Johnson called you her superhero. And your new friend's mom said you made her daughter's first day special."\n\nSam looked at his hands. No cape. No super strength. But he had helped four people in one day.\n\n"I AM a superhero," he whispered. "Just the invisible kind."`
    }],
    quiz: [{
      language: 'en', questions: [
        { question: 'What did Sam want to be?', options: ['A doctor', 'A superhero', 'A teacher'], correct_answer: 'A superhero' },
        { question: 'What did Sam do for the new kid at school?', options: ['He ignored her', 'He sat with her and shared cookies', 'He teased her'], correct_answer: 'He sat with her and shared cookies' },
        { question: 'What kind of superhero was Sam?', options: ['A flying one', 'A strong one', 'The invisible kind — helping without needing credit'], correct_answer: 'The invisible kind — helping without needing credit' },
      ]
    }],
  },
  {
    slug: 'counting-stars', difficulty: 'medium', ageGroup: '8-10', theme: 'adventure', themeEmoji: '✨',
    translations: [{
      language: 'en', title: 'Counting Every Star',
      summary: 'Some things are impossible to finish, and that\'s what makes them wonderful.',
      content: `Yasmin decided she would count every star in the sky. "There can't be that many," she thought.\n\nNight one: she counted 47 stars before falling asleep.\n\nNight two: she counted 203. "Still going!"\n\nNight three: 589. Her neck hurt from looking up.\n\nBy night ten, she'd counted 2,341 stars and there were still billions more.\n\n"This is impossible!" she told her grandmother.\n\n"Of course it is," Grandma smiled. "But look what happened while you tried — you learned the constellations, you saw two shooting stars, you discovered the Milky Way, and you spent ten beautiful nights under the sky."\n\nYasmin understood. Sometimes the point isn't finishing the task — it's everything you discover along the way.\n\nShe kept counting every clear night, not because she'd ever finish, but because looking up always gave her something wonderful.`
    }],
    quiz: [{
      language: 'en', questions: [
        { question: 'What did Yasmin decide to do?', options: ['Count every cloud', 'Count every star', 'Count every tree'], correct_answer: 'Count every star' },
        { question: 'How many stars had she counted by night ten?', options: ['47', '589', '2,341'], correct_answer: '2,341' },
        { question: 'What did Grandma help Yasmin understand?', options: ['Stars aren\'t real', 'The journey of discovery matters more than finishing', 'She should count faster'], correct_answer: 'The journey of discovery matters more than finishing' },
      ]
    }],
  },
  {
    slug: 'language-bridge', difficulty: 'medium', ageGroup: '8-10', theme: 'friendship', themeEmoji: '🗣️',
    translations: [{
      language: 'en', title: 'Words Without Borders',
      summary: 'Kindness is a language everyone understands.',
      content: `When Nadia moved to a new country, she couldn't speak the language. At school, the other children talked and laughed, but Nadia sat silent.\n\nShe felt invisible.\n\nOne day, a boy named Lucas sat beside her. He didn't say a word — he just drew a picture of a smiling sun and pushed it toward her.\n\nNadia smiled and drew a picture of flowers.\n\nLucas drew a picture of himself pointing at Nadia's flowers with a thumbs up.\n\nDay after day, they drew pictures for each other. Lucas started labeling things: "sun," "flower," "friend."\n\nSlowly, Nadia learned the words. Months later, she could speak full sentences.\n\n"Thank you for teaching me," she told Lucas.\n\n"You taught me something too," Lucas said. "That you don't need the same language to be friends. You just need to care enough to try."\n\nNadia taught Lucas words in her language too. They became the only kids in school who could speak to everyone.`
    }],
    quiz: [{
      language: 'en', questions: [
        { question: 'Why couldn\'t Nadia talk to the other children?', options: ['She was shy', 'She couldn\'t speak the language', 'She didn\'t want to'], correct_answer: 'She couldn\'t speak the language' },
        { question: 'How did Lucas first communicate with Nadia?', options: ['He spoke slowly', 'He drew pictures', 'He used a phone'], correct_answer: 'He drew pictures' },
        { question: 'What did Lucas learn from Nadia?', options: ['Math', 'You don\'t need the same language to be friends', 'How to draw'], correct_answer: 'You don\'t need the same language to be friends' },
      ]
    }],
  },
  {
    slug: 'bakery-of-dreams', difficulty: 'easy', ageGroup: '5-7', theme: 'kindness', themeEmoji: '🧁',
    translations: [{
      language: 'en', title: 'The Bakery of Dreams',
      summary: 'When you make things with love, everyone can taste it.',
      content: `Grandma Noor had a tiny bakery. Her cakes weren't fancy. Her cookies were simple shapes.\n\nBut everyone said Grandma Noor's treats were the most delicious in the world.\n\n"What's your secret ingredient?" people asked.\n\n"Love," she always said.\n\nLittle Hana wanted to bake like Grandma. She tried making cookies. They were burned and lumpy.\n\n"They're terrible!" Hana cried.\n\nGrandma tasted one. "They're wonderful. Do you know why? Because you made them thinking of someone you love."\n\nHana had been thinking of her friend who was sick. She brought the lumpy cookies to her friend.\n\nHer friend took one bite and smiled. "These are the best cookies I've ever had."\n\nHana finally understood Grandma's secret. Love really was the ingredient that made everything taste better.`
    }],
    quiz: [{
      language: 'en', questions: [
        { question: 'What was Grandma Noor\'s secret ingredient?', options: ['Sugar', 'Love', 'Chocolate'], correct_answer: 'Love' },
        { question: 'What happened to Hana\'s first cookies?', options: ['They were perfect', 'They were burned and lumpy', 'They disappeared'], correct_answer: 'They were burned and lumpy' },
        { question: 'Why did Hana\'s friend like the cookies?', options: ['They looked pretty', 'They were made with love', 'She was very hungry'], correct_answer: 'They were made with love' },
      ]
    }],
  },
  {
    slug: 'color-of-sounds', difficulty: 'medium', ageGroup: '8-10', theme: 'courage', themeEmoji: '🎨',
    translations: [{
      language: 'en', title: 'The Color of Sounds',
      summary: 'Being different is not a weakness — it can be your greatest strength.',
      content: `Maya could see sounds as colors. When birds sang, she saw golden ribbons. When thunder cracked, she saw purple lightning. When her mother spoke, soft blue swirls appeared.\n\nAt school, nobody understood. "You're weird," they said.\n\nMaya stopped talking about her gift. She tried to be normal.\n\nOne day, the art teacher announced a painting contest. "Paint something no one has ever seen before."\n\nMaya hesitated, then painted what she really saw: a world of swirling colors created by everyday sounds — the red of a dog's bark, the green of rainfall, the gold of laughter.\n\nThe painting was unlike anything anyone had ever seen. She won first place.\n\n"How did you imagine this?" asked the teacher.\n\n"I didn't imagine it," Maya said quietly. "I see it every day."\n\nThe room was silent, then someone said, "That's not weird. That's amazing."\n\nMaya smiled. For the first time, being different felt like a superpower.`
    }],
    quiz: [{
      language: 'en', questions: [
        { question: 'What was special about Maya?', options: ['She could fly', 'She could see sounds as colors', 'She was very tall'], correct_answer: 'She could see sounds as colors' },
        { question: 'What did Maya paint for the contest?', options: ['A landscape', 'A portrait', 'The colors she saw from everyday sounds'], correct_answer: 'The colors she saw from everyday sounds' },
        { question: 'How did Maya feel about being different at the end?', options: ['Still sad', 'It felt like a superpower', 'She didn\'t care'], correct_answer: 'It felt like a superpower' },
      ]
    }],
  },
  {
    slug: 'lost-penguin', difficulty: 'easy', ageGroup: '5-7', theme: 'animals', themeEmoji: '🐧',
    translations: [{
      language: 'en', title: 'Pebble the Lost Penguin',
      summary: 'Home is where the people who love you are.',
      content: `Pebble the penguin got separated from his family during a storm. He washed up on a warm sandy beach.\n\n"This isn't home!" he shivered — wait, he wasn't cold. The sun was warm!\n\nA crab named Click found him. "You're a long way from the ice!"\n\n"I need to find my family!" said Pebble.\n\nClick introduced Pebble to the beach animals: Sunny the starfish, Splash the dolphin, and Shelly the turtle.\n\nThey all helped Pebble. Splash swam south to search. Shelly checked the rocky shores. Sunny kept Pebble company.\n\nFinally, Splash found Pebble's family! They came swimming north.\n\n"Pebble!" his mom cried, hugging him tight.\n\n"I made new friends, Mom! Can we visit them?"\n\nAnd every summer, Pebble's family visited the warm beach. Pebble had two homes now — one cold and one warm — and friends in both.`
    }],
    quiz: [{
      language: 'en', questions: [
        { question: 'Where did Pebble end up after the storm?', options: ['A mountain', 'A warm sandy beach', 'A forest'], correct_answer: 'A warm sandy beach' },
        { question: 'Who found Pebble\'s family?', options: ['Click the crab', 'Splash the dolphin', 'Shelly the turtle'], correct_answer: 'Splash the dolphin' },
        { question: 'What did Pebble gain from his adventure?', options: ['A treasure', 'A second home and new friends', 'Super powers'], correct_answer: 'A second home and new friends' },
      ]
    }],
  },
  {
    slug: 'worry-jar', difficulty: 'medium', ageGroup: '8-10', theme: 'courage', themeEmoji: '🫙',
    translations: [{
      language: 'en', title: 'The Worry Jar',
      summary: 'Sharing your worries makes them smaller and easier to handle.',
      content: `Aiden worried about everything. He worried about tests, about making friends, about thunderstorms, about monsters under his bed.\n\nHis worries felt like heavy stones in his pockets, making each day harder.\n\nOne day, his grandmother gave him an empty jar. "This is a worry jar. Every night, write your worry on a piece of paper and put it in the jar. The jar will hold them so you don't have to."\n\nAiden tried it. "I'm worried about my math test tomorrow." He put the paper in the jar.\n\nSomething strange happened — he felt lighter.\n\nEvery night he filled the jar. When it was full, Grandma said, "Let's read them together."\n\nAiden was amazed. Half the worries never happened. A quarter turned out fine. Only a few were real problems — and Grandma helped him solve those.\n\n"See?" Grandma said. "Most worries are just stories we tell ourselves. And the real ones are smaller when shared."\n\nAiden still used his worry jar, but now it filled up much more slowly.`
    }],
    quiz: [{
      language: 'en', questions: [
        { question: 'What did Grandma give Aiden?', options: ['A teddy bear', 'A worry jar', 'A magic wand'], correct_answer: 'A worry jar' },
        { question: 'What happened to most of the worries Aiden wrote down?', options: ['They all came true', 'Half never happened', 'They got worse'], correct_answer: 'Half never happened' },
        { question: 'What did Aiden learn about worries?', options: ['You should ignore them', 'Most are just stories, and real ones are smaller when shared', 'They always come true'], correct_answer: 'Most are just stories, and real ones are smaller when shared' },
      ]
    }],
  },
  {
    slug: 'treasure-map', difficulty: 'medium', ageGroup: '8-10', theme: 'adventure', themeEmoji: '🗺️',
    translations: [{
      language: 'en', title: 'The Treasure That Wasn\'t Gold',
      summary: 'The real treasure is the people and experiences we find along the way.',
      content: `Twins Maya and Marco found an old treasure map in their attic. "X marks the spot!" Marco said excitedly.\n\nThe map led through the town. First stop: the old library. They had to solve a riddle to find the next clue. The librarian helped them, and they discovered they loved mystery books.\n\nSecond stop: the community garden. They had to plant a seed to get the next clue. The gardener taught them about growing vegetables.\n\nThird stop: the bakery. They had to help bake bread. The baker shared his grandmother's recipe.\n\nFinally, they reached the X — their own backyard. They dug and found a wooden box. Inside was a note:\n\n"The treasure was never gold. It was the library where you learned, the garden where you grew, the bakery where you shared, and the adventure you had together. The real treasure is the journey. — Grandpa"\n\nMaya and Marco looked at each other and laughed. It was the best treasure they could have found.`
    }],
    quiz: [{
      language: 'en', questions: [
        { question: 'Where did Maya and Marco find the treasure map?', options: ['In a bottle', 'In their attic', 'In a library book'], correct_answer: 'In their attic' },
        { question: 'What was at the X on the map?', options: ['Gold coins', 'A note from Grandpa', 'Nothing'], correct_answer: 'A note from Grandpa' },
        { question: 'What was the real treasure?', options: ['Gold and jewels', 'The journey and experiences along the way', 'The wooden box'], correct_answer: 'The journey and experiences along the way' },
      ]
    }],
  },
];
