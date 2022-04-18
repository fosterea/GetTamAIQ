## Main work done in [ml.js](ml.js)

## Q Learning
Initially, I tried to use Q learning to beat GetTam, however, it didn’t end up working because there are literally trillions of possible game states.

I began by copying our GetTam Replit and making it call my machine learning functions. At first, this was a function that played one move nestled in a chunk of code called every one second, but later I decided it would be faster to have the p5 setup function call a for loop instead of making a move every second. 

I used a dictionary of states linking to a dictionary containing moves and their expected values. Every time a game was played, a reward or punishment was given for the latest move. This was supposed to trickle back through the moves’ expected values, as the game was played, but the number of board states per game (around 200) made it unlikely to randomly get to the same state again.

I tried to fix the problem of such a vast array of possible boards by training the Q dictionary to achieve lower tiles at first and work up from there. The hope was the board would learn how to get tile 5 which would make it easier for it to get tile 6. I was inspired by transfer learning with neural networks, imagining creating a path to more valuable board states. The game loop would play a couple of hundred games with one target tile before continuing to harder tiles. The reward given was 2 to the power of the target tile’s enumeration allowing the pathways created by previous targets to be easily overwritten if necessary.

Ultimately, I believe there were too many board states for my algorithm to view, akin to a game of chess. Although, I could be wrong and may have implemented something sub optimally and it might be possible to conquer this problem with Q learning.

You can find my code [here](https://github.com/fosterea/GetTamAIQ)

You can find the gutted website [here](https://fosterea.github.io/GetTamAIQ/)