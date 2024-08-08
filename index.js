document.querySelectorAll('.toggle').forEach(toggle => {
    const title = toggle.closest('.project-title');
    const display = title.nextElementSibling;
    display.style.display = 'none';
    toggle.addEventListener('click', () => {
        if (display.style.display === 'block') {
            display.style.display = 'none';
            toggle.textContent = '▼';
        } else {
            display.style.display = 'block';
            toggle.textContent = '▲';
        }
    });
});

// This is minified Bricky
!function(){var e=function(e){var t={parent:e.parent,elements:e.elements,gutter:e.gutter||"1rem",breakpoints:e.breakpoints||[[600,2],[900,3],[1200,4]]};this.parent=document.querySelector(t.parent),this.collectItems=function(){var e=[],r=document.querySelectorAll(t.elements);return[].forEach.call(r,function(t){e.push(t),t.parentNode.removeChild(t)}),e},this.brickyItems=this.collectItems(),this.clearParent=function(){this.parent.innerHTML=""},this.render=function(){function e(){for(var e=window.outerWidth,r=t.breakpoints,n=r.sort(function(e,t){return t[0]-e[0]}),i=0;i<n.length;i++)if(e>n[i][0])return n[i][1];return 1}function r(){for(var e=n.querySelectorAll("div"),t=[],r=0;r<e.length;r++){for(var i=0,l=0;l<e[r].querySelectorAll("*").length;l++)i+=e[r].querySelectorAll("*")[l].clientHeight;t.push(i)}return t.indexOf(Math.min.apply(Math,t))}this.clearParent();var n=document.createElement("div");n.style.display="-webkit-box",n.style.display="-webkit-flex",n.style.display="-ms-flexbox",n.style.display="flex",this.parent.appendChild(n);for(var i=e(),l=0;i>l;l++){var o=document.createElement("div");o.style.width=100/i+"%",l!==i-1&&(o.style.marginRight=t.gutter),n.appendChild(o)}for(var a=0;a<this.brickyItems.length;a++){var s=r();n.querySelectorAll("div")[s].appendChild(this.brickyItems[a])}},this.debounce=function(e,t,r){var n=0;return function(){var i=this,l=arguments,o=function(){n=null,r||e.apply(i,l)},a=r&&!n;clearTimeout(n),n=setTimeout(o,t||200),a&&e.apply(i,l)}},this.start=function(){window.addEventListener("load",this.render());var e=this;window.addEventListener("resize",e.debounce(function(){e.render()},200))}};"undefined"!=typeof module&&module.exports?module.exports=e:window.Bricky=e}();

// Custom settings
var pref = {
    parent: '.background',
    elements: 'article',
    gutter: '22px'
};

// Instatntiate new Bricky and trigger start method
var mySuperLayout = new Bricky(pref);
mySuperLayout.start();

const runningAnimations = {};
/**
* Applies a typewriter effect to the specified element.
*
* @param {Object} options - Configuration options for the typewriter effect.
* @param {string} options.id - The ID of the HTML element to apply the effect to.
* @param {boolean} [options.setVisibleOnPrimaryElement=false] - If true, sets the visibility of the main element to 'visible' before starting the animation.
* @param {boolean} [options.timeBasedOnLength=false] - If true, calculates animation duration based on text length. If false, uses a fixed duration.
* @param {string} [options.classNameLetterSpan='letter'] - The CSS class name to apply to each letter's span element.
* @param {boolean} [options.snakeMode=false] - If true, enables "snake" mode where only a certain number of characters are visible at once.
* @param {number} [options.snakeLength=5] - The number of characters to keep visible in snake mode.
* @param {boolean} [options.loop=false] - If true, the animation will repeat indefinitely.
* @param {Function} [options.onAnimationFinished] - Callback function to be called when the animation finishes (not called if loop is true).
*/
function typewriter(options) {
    const {
        id,
        setVisibleOnPrimaryElement = false,
        timeBasedOnLength = false,
        classNameLetterSpan = 'letter',
        snakeMode = false,
        snakeLength = 5,
        loop = false,
        onAnimationFinished
    } = options;
    
    const textElement = document.getElementById(id);
    const text = textElement.textContent.trim();
    textElement.textContent = '';
    textElement.innerHTML = '';
    
    if (setVisibleOnPrimaryElement) {
        textElement.style.visibility = 'visible';
    }
    
    text.split('').forEach((char) => {
        const span = document.createElement('span');
        if (char === ' ') {
            span.className = 'space';
            span.innerHTML = '&nbsp;';
        } else {
            span.textContent = char;
            span.className = classNameLetterSpan;
        }
        textElement.appendChild(span);
    });
    
    const letters = textElement.querySelectorAll(`.${classNameLetterSpan}`);
    
    let animationDuration;
    if (timeBasedOnLength) {
        const readingTimeMs = (text.length / 5) * (60 / 200) * 1000;
        animationDuration = readingTimeMs;
    } else {
        animationDuration = 5000;
    }
    
    const animationDelay = animationDuration / (2 * letters.length);
    
    function revealLetters() {
        letters.forEach((letter, index) => {
            setTimeout(() => {
                letter.style.opacity = '1';
                if (snakeMode && index >= snakeLength) {
                    letters[index - snakeLength].style.opacity = '0';
                }
            }, index * animationDelay);
        });
    }
    
    function hideLetters() {
        const startDelay = snakeMode ? 0 : animationDuration / 2;
        letters.forEach((letter, index) => {
            setTimeout(() => {
                letter.style.opacity = '0';
                if (index === letters.length - 1) {
                    setTimeout(() => {
                        if (loop) {
                            runAnimation();
                        } else {
                            runningAnimations[id] = false;
                            if (typeof onAnimationFinished === 'function') {
                                onAnimationFinished();
                            }
                        }
                    }, animationDelay);
                }
            }, startDelay + index * animationDelay);
        });
    }
    
    function runAnimation() {
        revealLetters();
        setTimeout(hideLetters, snakeMode ? animationDuration : animationDuration / 2);
    }
    
    runAnimation();
}

function startRandomArticleFade() {
    let article_id = `article_${Math.floor((Math.random() * 10) + 1)}`;
    if (runningAnimations[article_id]) return;
    runningAnimations[article_id] = true;
    typewriter({id: article_id, setVisibleOnPrimaryElement: true, timeBasedOnLength: true, onAnimationFinished: () => {runningAnimations[article_id] = false}});
}
startRandomArticleFade();
setInterval(startRandomArticleFade, 5000);
