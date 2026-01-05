-- Fix formatting for Remaining Exercise Instructions (convert \n to actual newlines)

UPDATE exercises 
SET instructions = '1. Close your eyes.
2. Take a deep breath in for 4 seconds.
3. Sigh it out loudly.
4. Open your eyes and name 3 things you see.' 
WHERE title = '30-Second Reset';

UPDATE exercises 
SET instructions = '1. Place your hand on your heart.
2. Feel the warmth of your hand.
3. Feel your chest rise and fall with each breath.
4. Say to yourself "I am safe".' 
WHERE title = 'Hand on Heart';

UPDATE exercises 
SET instructions = '1. Raise your shoulders up to your ears.
2. Hold for 3 seconds.
3. Drop them down completely.
4. Repeat 3 times.' 
WHERE title = 'Shoulder Drop';

UPDATE exercises 
SET instructions = '1. Take a sip of water.
2. Hold it in your mouth for a moment.
3. Notice the temperature and texture.
4. Swallow slowly and feel it go down.' 
WHERE title = 'Sip of Water';
