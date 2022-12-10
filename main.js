$(document).ready(function() {
    let currLevel = localStorage.getItem('Curr_Level') ? Number(localStorage.getItem('Curr_Level')) : localStorage.setItem('Curr_Level',1);
    //console.log(localStorage.getItem('Curr_Level'))
    const Basics = {
        'Level 1' : [['f','j','d','k','f','j','d','k','f'],['j','d','k']],
        'Level 2' : [['s','l','a',';','s','l','a',';','s'],['l','a',';']],
        'Level 3' : [['g','h','t','y','g','h','t','y','g'],['h','t','y']],
        'Level 4' : [['v','m','b','n','v','m','b','n','v'],['m','b','n']],
        'Level 5' : [['r','u','e','i','r','u','e','i','r'],['u','e','i']],
        'Level 6' : [['w','o','q','p','w','o','q','p','w'],['o','q','p']],
        'Level 7' : [['c',',','x','.','c',',','x','.','c'],[',','x','.']],
        'Level 8' : [['z','/',"'",'\\','z','/',"'",'\\','z'],['/',"'",'\\']],
        'Level 9' : [['`','[',']','=','`','[',']','=','`'],['[',']','=']],
        'Level 10' : [['v','z','f','=','`','v','g','j','x'],['q','r','d','s','t',';','m','r','['],['n','t','e','w','g','j','k','s',','],['o','u','c','i','y','/','\\','.']],
    } 
    keywords = {
        '`' : 'apostrophe',
        '-' : 'minus',
        '=' : 'equalto',
        '[' : 'leftsqbracket',
        ']' : 'rightsqbracket',
        ';' : 'semicolon',
        "'" : 'singlequota',
        '\\' : 'backslash',
        ',' : 'comma',
        '.' : 'fullstop',
        '/' : 'slash',
    }
    function main(data) {
         let curr = 1;
         let started = 1;
         let [max,CurrArray,totalWords,totalIncorrect,milliseconds,seconds,minutes,hours] = [0,0,0,0,0,0,0,0];
         let timerRef = document.querySelector('.timerDisplay');  
         let int = null;  
         let finished = false;
         const keyWord = (str) => /^[A-Za-z0-9]*$/.test(str) ? str : keywords[String(str)];
         $(`#level${currLevel}`).addClass('level-active');
         function Next() {
             $('.i-row').remove()
             $('.instruction').append('<div class="i-row"></div>')
             for (let i=1; i<=data[CurrArray].length; i++) { 
                 $('.i-row').append(`<div class="btn-box ${i}"><div class="btn">${data[CurrArray][i-1]}</div></div>`);
             };
             $(`.1`).append('<div class="active"></div>')
             max = data[CurrArray].length;
             $(`#${keyWord(data[CurrArray][curr-1])}`).addClass('active');
             CurrArray += 1;
         }
         function displayTimer(){
             milliseconds+=10;
             if(milliseconds == 1000){
                 milliseconds = 0;
                 seconds++;
                 if(seconds == 60){
                     seconds = 0;
                     minutes++;
                     if(minutes == 60){
                         minutes = 0;
                         hours++;
                     }
                 }
             }
             let h = hours < 10 ? "0" + hours : hours;
             let m = minutes < 10 ? "0" + minutes : minutes;
             let s = seconds < 10 ? "0" + seconds : seconds;
             //let ms = milliseconds < 10 ? "00" + milliseconds : milliseconds < 100 ? "0" + milliseconds : milliseconds;
             timerRef.innerHTML = ` ${h} : ${m} : ${s}`;
         }
         $('body').keypress(function(e) {
             e.preventDefault()
             if (started) {
                 int = setInterval(displayTimer,10);
                 started = 0;
             }       
             if (CurrArray <= data.length && !finished) {
                //console.log(e.key,data[CurrArray-1][curr-1])
                 if (e.key == data[CurrArray-1][curr-1]) {
                     $(`.${curr}`).children().removeClass('incorrect').addClass('correct');
                     //console.log(curr,data[CurrArray][curr-1])
                     $(`#${keyWord(data[CurrArray-1][curr-1])}`).removeClass('active');
                     if (curr != max) {
                         curr += 1;
                         $(`.active`).remove();
                         //console.log(keyWord(data[CurrArray-1][curr-1]))
                         $(`#${keyWord(data[CurrArray-1][curr-1])}`).addClass('active');
                         $(`.${curr}`).append('<div class="active"></div>');
     
                     }
                     else {
                         if (CurrArray != data.length) {
                             curr = 1;
                             Next()
                         }
                         else {
                             clearInterval(int);
                             toggleModal();
                             for (let i=0;i<data.length;i++) {
                                 totalWords += data[i].length
                             }
                             var accuracy = Math.round((totalWords - totalIncorrect)*100/totalWords,2)
                             var timeArray = timerRef.innerHTML.split(' ');
                             var hr = Number(timeArray[1]);
                             var min = Number(timeArray[3]);
                             var sec = Number(timeArray[5]);
                             var speed = Math.round(totalWords/(hr*60+min+sec/60));
                             var time = timerRef.innerHTML;
                             if (speed > 60) {
                                 $('.speed').css('color','#10c373');
                                 $('.time').css('color','#10c373');
                             }
                             else {
                                 $('.speed').css('color','#f5687c');
                                 $('.time').css('color','#f5687c');
                             }
                             if (accuracy >= 70) {
                                 $('.accuracy').css('color','#10c373');
                             }
                             else {
                                 $('.accuracy').css('color','#10c373');
                             }
                             $('.speed').html(`${speed} WPM`);
                             $('.time').html(`${time}`);
                             $('.accuracy').html(`${accuracy} %`);
                             finished = true;
                             currLevel += 1;
                         }
                     }
                 }
                 else {
                     totalIncorrect +=1;
                     let wrongAnimate = $(`.${curr}`).children();
                     $(wrongAnimate).addClass('incorrect');
                     setTimeout(function() {
                         $(wrongAnimate).removeClass('incorrect')
                     },1200)
                 }
             }
         });
         Next();
    }
    main(Basics[`Level ${currLevel}`]);
    function toggleModal() {
        $('.modal').toggleClass('show-modal');
    }
    function NextLevel(num) {
        $('.timerDisplay').html('00 : 00 : 00');
        $('.keyboard > .row > .active').removeClass('active');
        $(`#level${currLevel-1}`).removeClass('level-active');
        localStorage.setItem('Curr_Level',currLevel);
        main(Basics[`Level ${currLevel}`]);
    }
    $('.close-button').on("click", toggleModal);
    $(window).on("click", function(event){
        const modal = document.querySelector(".modal");
        if (event.target === modal) {
            toggleModal();
        }
    });
    $('.next').on("click", function() {
        NextLevel();
        toggleModal();
    });
    $('.restart').on("click", function() {
        $('.timerDisplay').html('00 : 00 : 00');
        $('.keyboard > .row > .active').removeClass('active');
        currLevel -= 1;
        $(`#level${currLevel-1}`).removeClass('level-active');
        localStorage.setItem('Curr_Level',currLevel);
        main(Basics[`Level ${currLevel}`]);
        toggleModal();
    });
    $('.levels').each(function (e) {
        $(this).on('click',function(e) {
            Level = $(this).attr('id');
            // Not Working
            /*
            $('.timerDisplay').html('00 : 00 : 00');
            $('.keyboard > .row > .active').removeClass('active');
            $(`.sidebar > .level-active`).removeClass('level-active');
            currLevel = Level.slice(5);
            localStorage.setItem('Curr_Level',Level.slice(5));
            main(Basics[`Level ${localStorage.getItem('Curr_Level')}`]);
            */
            // Working (Try commenting ☝️ upper lines and decommenting 👇 lower lines)
            
            localStorage.setItem('Curr_Level',Level.slice(5));
            window.location.reload();
            
        })
    });
})
