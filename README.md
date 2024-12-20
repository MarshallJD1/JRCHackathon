# JRCHackathon - Brick Breaker

[View live project here on GitHub](https://marshalljd1.github.io/JRCHackathon/)

<br>

![screenshot of landing page](/documentation/images/landingpage.webp)

---

## CONTENTS

* [Concept](#concept)
* [How to Play](#how-to-play)
* [Collaborators](#collaborators)
* [Project Planning](#project-planning)
  * [Wireframes](#wireframes)
  * [Project Board](#project-board)
  * [Styling Choices](#styling-choices)
* [Features for MVP](#features-for-mvp)
* [Features to be Added](#features-to-be-added)
* [Testing](#testing)
  * [HTML Validation using W3C Validation](#html-validation)
  * [CSS Validation using W3C Validation](#css-validation-using-w3c-validation)
  * [Lighthouse scores via Chrome Developer Tools](#lighthouse-testing)
  * [ARIA Validation](#aria-validation)
  * [JavaScript Validation](#javascript-validation)
  * [Bugs & Fixes](#bugs--fixes)
  * [Unsolved Bugs](#unsolved-bugs)
* [Credits](#credits) 
  * [Content References](#content-references)
  * [Media References](#media-references)
  * [Planning Resources](#planning-resources)
<p align="right"><a href="#jrchackathon---brick-breaker">Back To Top</a></p>
<br>


---

## Concept 

<br>

<p>For our Hackathon submission we are going for a remake of the old Atari Classic Breakout.
We will be adding extra content throughout the project if time constraints allow.</p> 
<p>This will be outlined in the ReadME.</p>
<p align="right"><a href="#jrchackathon---brick-breaker">Back To Top</a></p>
<br>



## How to Play

<br>

<p> Deployment page : (https://marshalljd1.github.io/JRCHackathon/)

![Screenshots](/documentation/images/deployed-screenshots.webp)

<p> Use the mouse on Desktops to control the paddle </p>
<p> --Touch device controls to be implimented--</p>
<p> Press the start button to set the game in motion and keep that rally up!</p>
<p>Destroy all the bricks and dont miss your rebounds</p> 
<p align="right"><a href="#jrchackathon---brick-breaker">Back To Top</a></p>
<br>


## Collaborators

<br>

<p>
<ul>
<li>[@Ronan525](https://github.com/Ronan525)</li>
<li>[@csmatthew](https://github.com/csmatthew)</li>
<li>[@MarshallJD1](https://github.com/MarshallJD1)</li>
</ul>
<p align="right"><a href="#jrchackathon---brick-breaker">Back To Top</a></p>
<br>

## Project Planning 

<br>
<p>
 We have mostly been using (https:www.miro.com), the project board in Github and slack for huddles and communications.
</p>
<p>
  Prior to starting the development in our IDE's; we went to balsamiq and created a few wireframes for our idea.
  We wanted to hit all the Learning objectives given to us, one of them being 'responsive design between all devices'.
  So we have planned our designs for Tablet/Mobile and desktop.
</p>
<p align="right"><a href="#jrchackathon---brick-breaker">Back To Top</a></p>
<br>

## Wireframes

<br>

<p>Wireframes were used to spatially arrange the elements of the project. These were arranged in the Balsamiq app.</p>

![Wireframes](/documentation/images/wireframes.webp)

<p align="right"><a href="#jrchackathon---brick-breaker">Back To Top</a></p>
<br>


## Project Board

<br>

<p> We have used Co-pilot to help us with creating some user stories for our development.
This way we can acurately set out what we need for an mvp and the entire team can track the 
progress of our implementation </p>

![Project board](https://github.com/user-attachments/assets/07dbce0e-da92-48cd-adf8-47c2220fb6bc)


<p>More of these will be added- at current only the should haves have been listed, but we do intend to add some scope for possible extra features </p>
<p align="right"><a href="#jrchackathon---brick-breaker">Back To Top</a></p>
<br>


## Styling Choices

<br>

<p>To emulate the gaming experience of the video arcade games of the 1970s and 1980s, the decision was to utilise a retro 8-bit themed palette.</p>

![Colour Palette](/documentation/images/palette.webp)


<p align="right"><a href="#jrchackathon---brick-breaker">Back To Top</a></p>
<br>




## Features for MVP

<br>

<ul>
  <li>Smooth Working game - No bugs or errors</li>
  <li>Ball and paddle movement is seemless</li>
  <li>Score is shown</li>
  <li>Lives are shown</li>
  <li>Works on all devices</li>
  <li>Game has an instructions tab</li>
  <li>Game has an endgame screen for both clearing all the bricks and losing all lives</li>
</ul>
<p align="right"><a href="#jrchackathon---brick-breaker">Back To Top</a></p>
<br>


## Features to be added

<br>

<ul>
  <li>Audio effects and Background music</li>
  <li>More levels with different assortments/specifications of bricks</li>
  <li>Power-ups and Power-Downs </li>
  <li>Timer for each level</li>
  <li>Possible quiz modal element</li>
</ul>
<p align="right"><a href="#jrchackathon---brick-breaker">Back To Top</a></p>
<br>

## Testing

Testing and validation of the website was carried out throughout the course of the project.

This included regular debugging and testing using the Dev Tools as provided within Chrome Browser.

#### HTML validation
[HTML Validation](https://validator.w3.org/)<br>
![HTML Validation](/documentation/images/validation-html.webp)
#### CSS Validation
[CSS Validation](https://jigsaw.w3.org/css-validator/)<br>
![CSS Validation](/documentation/images/validation-css.webp)
#### Lighthouse testing
[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview)<br>
![Lighthouse](/documentation/images/lighthouse.webp)
#### ARIA validation
[ARIA Validation](https://wave.webaim.org/report#/https://marshalljd1.github.io/JRCHackathon/)
![ARIA Validation](/documentation/images/validation-aria.webp)
#### JavaScript Validation
[JS Validation](https://jshint.com/)
![JS Validation](/documentation/images/validation-jshint.webp)

<p align="right"><a href="#jrchackathon---brick-breaker">Back To Top</a></p>
<br>

## Noted Bug Fixes  

<br>

<p> The following bugs were identified and corrected over the course of the hackathon:</p>

<hr>
<ul>
 <li>Fixed incorrect ball placement when starting game</li>
 <li>Fixed incorrect paddle collisions with the ball</li>
 <li>Fixed incorrect amount of bricks broken from a single collision</li>
 <li>Fixed bricks moving after neighbouring brick is destroyed</li>
 <li>Fixed incorrect ball collision when hitting viewport</li>
 <li>Fixed incorrect speed adjustment after losing a life</li>
 <li>Fixed round generation</li>
 <li>Fixed scroll issue on mobile devices</li>
</ul>

<p align="right"><a href="#jrchackathon---brick-breaker">Back To Top</a></p>
<br>

## Credits

### **Content References**
- All content written for this site is the product of the three authors who contributed to this repository and the use of Github Copilot
- [GitHub Copilot](https://github.com/features/copilot)

### **Media References**
- [Freesound](https://freesound.org) for the sound effects
  - [User: 'jobro'](https://freesound.org/people/jobro/) for the ['beep-a'](https://freesound.org/people/jobro/sounds/33775/) and ['beep-b'](https://freesound.org/people/jobro/sounds/33776/) sounds.
  - [User: 'AceOfSpacesProduc100'](https://freesound.org/people/AceOfSpadesProduc100/) for the ['fail' sound.](https://freesound.org/people/AceOfSpadesProduc100/sounds/333785/)
  - Round Complete and Game complete sounds created by MarshallJD

  <p align="right"><a href="#jrchackathon---brick-breaker">Back To Top</a></p>
<br>

### **Planning Resources**
- [Miro](https://miro.com/app/) for whiteboard collaborative idea planning.
- [Balsamiq](https://balsamiq.com/) for wireframes.

