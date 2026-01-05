-- Restore Exercises if missing

INSERT INTO exercises (title, category, duration, mood_type, description, instructions)
SELECT 'Box Breathing', 'Breathing', 5, 'Anxious', 'A simple breathing technique to calm your nervous system.', '1. Inhale through your nose for 4 seconds.\n2. Hold your breath for 4 seconds.\n3. Exhale through your mouth for 4 seconds.\n4. Hold for 4 seconds before inhaling again.'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE title = 'Box Breathing');

INSERT INTO exercises (title, category, duration, mood_type, description, instructions)
SELECT '5-4-3-2-1 Grounding', 'Grounding', 10, 'Overwhelmed', 'Use your 5 senses to bring yourself back to the present moment.', '1. Acknowledge 5 things you see around you.\n2. Acknowledge 4 things you can touch or feel.\n3. Acknowledge 3 things you can hear.\n4. Acknowledge 2 things you can smell.\n5. Acknowledge 1 thing you can taste.'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE title = '5-4-3-2-1 Grounding');

INSERT INTO exercises (title, category, duration, mood_type, description, instructions)
SELECT 'Safe Place Visualization', 'Mindfulness', 15, 'Stressed', 'Mental imagery to create a safe mental refuge.', '1. Close your eyes and imagine a place where you feel perfectly safe and guarding.\n2. Visualize the colors, sounds, and smells.\n3. Stay in this place for as long as you need.'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE title = 'Safe Place Visualization');

INSERT INTO exercises (title, category, duration, mood_type, description, instructions)
SELECT 'Progressive Muscle Relaxation', 'Relaxation', 20, 'Tense', 'Systematically tensing and relaxing muscle groups.', '1. Start with your toes, tense them for 5 seconds, then release.\n2. Move to your calves, tense and release.\n3. Work your way up your body to your head.\n4. Notice the difference between tension and relaxation.'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE title = 'Progressive Muscle Relaxation');

INSERT INTO exercises (title, category, duration, mood_type, description, instructions)
SELECT 'Cognitive Reframing', 'CBT', 15, 'Low', 'Challenge negative thoughts and replace them with balanced ones.', '1. Identify a negative thought you are having.\n2. Ask yourself: Is this 100% true? Is there another explanation?\n3. Re-write the thought in a more neutral or positive way.'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE title = 'Cognitive Reframing');

INSERT INTO exercises (title, category, duration, mood_type, description, instructions)
SELECT 'Gratitude Journaling', 'Journaling', 10, 'Sad', 'Shift focus to positive aspects of life.', '1. Write down 3 things you are grateful for today.\n2. They can be big (family) or small (a good cup of coffee).\n3. Reflect on why you are grateful for them.'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE title = 'Gratitude Journaling');

INSERT INTO exercises (title, category, duration, mood_type, description, instructions)
SELECT 'Mindful Walking', 'Mindfulness', 20, 'Restless', 'Meditation in motion.', '1. Walk at a natural pace.\n2. Focus on the sensation of your feet touching the ground.\n3. Notice the rhythm of your breath.\n4. If your mind wanders, gently bring it back to your steps.'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE title = 'Mindful Walking');

INSERT INTO exercises (title, category, duration, mood_type, description, instructions)
SELECT 'Loving-Kindness Meditation', 'Meditation', 15, 'Lonely', 'Cultivate compassion for yourself and others.', '1. Sit comfortably.\n2. Repeat silently: "May I be happy. May I be well. May I be safe."\n3. Extend this wish to a loved one, then a neutral person, then a difficult person, and finally all beings.'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE title = 'Loving-Kindness Meditation');

INSERT INTO exercises (title, category, duration, mood_type, description, instructions)
SELECT '30-Second Reset', 'Breathing', 1, 'Overwhelmed', 'A quick reset for when you fee panicked.', '1. Close your eyes.\n2. Take a deep breath in for 4 seconds.\n3. Sigh it out loudly.\n4. Open your eyes and name 3 things you see.'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE title = '30-Second Reset');

INSERT INTO exercises (title, category, duration, mood_type, description, instructions)
SELECT 'Hand on Heart', 'Grounding', 2, 'Anxious', 'Physical touch to soothe the nervous system.', '1. Place your hand on your heart.\n2. Feel the warmth of your hand.\n3. Feel your chest rise and fall with each breath.\n4. Say to yourself "I am safe".'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE title = 'Hand on Heart');

INSERT INTO exercises (title, category, duration, mood_type, description, instructions)
SELECT 'Shoulder Drop', 'Relaxation', 1, 'Tense', 'Release tension in your shoulders instantly.', '1. Raise your shoulders up to your ears.\n2. Hold for 3 seconds.\n3. Drop them down completely.\n4. Repeat 3 times.'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE title = 'Shoulder Drop');

INSERT INTO exercises (title, category, duration, mood_type, description, instructions)
SELECT 'Sip of Water', 'Mindfulness', 2, 'Restless', 'Mindful hydration.', '1. Take a sip of water.\n2. Hold it in your mouth for a moment.\n3. Notice the temperature and texture.\n4. Swallow slowly and feel it go down.'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE title = 'Sip of Water');
