-- Fix formatting for Exercise Instructions (convert \n to actual newlines)

UPDATE exercises 
SET instructions = '1. Inhale through your nose for 4 seconds.
2. Hold your breath for 4 seconds.
3. Exhale through your mouth for 4 seconds.
4. Hold for 4 seconds before inhaling again.' 
WHERE title = 'Box Breathing';

UPDATE exercises 
SET instructions = '1. Acknowledge 5 things you see around you.
2. Acknowledge 4 things you can touch or feel.
3. Acknowledge 3 things you can hear.
4. Acknowledge 2 things you can smell.
5. Acknowledge 1 thing you can taste.' 
WHERE title = '5-4-3-2-1 Grounding';

UPDATE exercises 
SET instructions = '1. Close your eyes and imagine a place where you feel perfectly safe and guarding.
2. Visualize the colors, sounds, and smells.
3. Stay in this place for as long as you need.' 
WHERE title = 'Safe Place Visualization';

UPDATE exercises 
SET instructions = '1. Start with your toes, tense them for 5 seconds, then release.
2. Move to your calves, tense and release.
3. Work your way up your body to your head.
4. Notice the difference between tension and relaxation.' 
WHERE title = 'Progressive Muscle Relaxation';

UPDATE exercises 
SET instructions = '1. Identify a negative thought you are having.
2. Ask yourself: Is this 100% true? Is there another explanation?
3. Re-write the thought in a more neutral or positive way.' 
WHERE title = 'Cognitive Reframing';

UPDATE exercises 
SET instructions = '1. Write down 3 things you are grateful for today.
2. They can be big (family) or small (a good cup of coffee).
3. Reflect on why you are grateful for them.' 
WHERE title = 'Gratitude Journaling';

UPDATE exercises 
SET instructions = '1. Walk at a natural pace.
2. Focus on the sensation of your feet touching the ground.
3. Notice the rhythm of your breath.
4. If your mind wanders, gently bring it back to your steps.' 
WHERE title = 'Mindful Walking';

UPDATE exercises 
SET instructions = '1. Sit comfortably.
2. Repeat silently: "May I be happy. May I be well. May I be safe."
3. Extend this wish to a loved one, then a neutral person, then a difficult person, and finally all beings.' 
WHERE title = 'Loving-Kindness Meditation';
