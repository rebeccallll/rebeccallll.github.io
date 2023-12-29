// Countdown Script
(function () {
    const second = 1000,
          minute = second * 60,
          hour = minute * 60,
          day = hour * 24;
  
    let today = new Date(),
        dd = String(today.getDate()).padStart(2, "0"),
        mm = String(today.getMonth() + 1).padStart(2, "0"),
        yyyy = today.getFullYear(),
        dayMonth = "12/31/", // Change this to your event date
        eventDate = dayMonth + yyyy;
    
    today = mm + "/" + dd + "/" + yyyy;
    if (today > eventDate) {
      eventDate = dayMonth + (yyyy + 1);
    }
  
    const countDown = new Date(eventDate).getTime(),
        x = setInterval(function() {    
          const now = new Date().getTime(),
                distance = countDown - now;
  
          document.getElementById("days").innerText = Math.floor(distance / (day)),
          document.getElementById("hours").innerText = Math.floor((distance % (day)) / (hour)),
          document.getElementById("minutes").innerText = Math.floor((distance % (hour)) / (minute)),
          document.getElementById("seconds").innerText = Math.floor((distance % (minute)) / second);
  
          if (distance < 0) {
            
  //           Edit Content!
            document.getElementById("eventHeadline").innerText = "Happy New Year!";
            document.getElementById("countdown").style.display = "none";
            document.getElementById("eventContent").style.display = "block";
            document.getElementById("fireworksCanvas").style.display = "block";
            clearInterval(x);
          }
        }, 0)
  }());
  
  // Fireworks Script
  class Firework {
    constructor(x, y, targetX, targetY, shade, offsprings) {
      this.dead = false;
      this.offsprings = offsprings;
      this.x = x;
      this.y = y;
      this.targetX = targetX;
      this.targetY = targetY;
      this.shade = shade;
      this.history = [];
    }
    update(delta) {
      if (this.dead) return;
      let xDiff = this.targetX - this.x;
      let yDiff = this.targetY - this.y;
      if (Math.abs(xDiff) > 3 || Math.abs(yDiff) > 3) {
        this.x += xDiff * 2 * delta;
        this.y += yDiff * 2 * delta;
        this.history.push({x: this.x, y: this.y});
        if (this.history.length > 20) this.history.shift();
      } else {
        if (this.offsprings && !this.madeChilds) {
          let babies = this.offsprings / 2;
          for (let i = 0; i < babies; i++) {
            let targetX = this.x + this.offsprings * Math.cos(PI2 * i / babies) | 0;
            let targetY = this.y + this.offsprings * Math.sin(PI2 * i / babies) | 0;
            eventDisplay.fireworks.push(new Firework(this.x, this.y, targetX, targetY, this.shade, 0));
          }
          this.madeChilds = true;
        }
        this.history.shift();
      }
      if (this.history.length === 0) this.dead = true;
      else if (this.offsprings) {
        for (let i = 0; this.history.length > i; i++) {
          let point = this.history[i];
          ctx.beginPath();
          ctx.fillStyle = 'hsl(' + this.shade + ',100%,' + i + '%)';
          ctx.arc(point.x, point.y, 1, 0, PI2, false);
          ctx.fill();
        }
      } else {
        ctx.beginPath();
        ctx.fillStyle = 'hsl(' + this.shade + ',100%,50%)';
        ctx.arc(this.x, this.y, 1, 0, PI2, false);
        ctx.fill();
      }
    }
  }
  
  class EventDisplay {
    constructor() {
      this.fireworks = [];
      this.counter = 0;
      this.resize();
    }
    resize() {
      this.width = canvas.width = window.innerWidth;
      let center = this.width / 2 | 0;
      this.spawnA = center - center / 4 | 0;
      this.spawnB = center + center / 4 | 0;
      this.height = canvas.height = window.innerHeight;
      this.spawnC = this.height * .1;
      this.spawnD = this.height * .5;
    }
    onClick(evt) {
      let x = evt.clientX || evt.touches && evt.touches[0].pageX;
      let y = evt.clientY || evt.touches && evt.touches[0].pageY;
      let count = random(3,5);
      for (let i = 0; i < count; i++) this.fireworks.push(new Firework(
        random(this.spawnA, this.spawnB),
        this.height,
        x,
        y,
        random(0, 260),
        random(30, 110)));
      this.counter = -1;
    }
    update(delta) {
      ctx.globalCompositeOperation = 'hard-light';
      ctx.fillStyle = `rgba(20,20,20,${7 * delta})`;
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.globalCompositeOperation = 'lighter';
      for (let firework of this.fireworks) firework.update(delta);
      this.counter += delta * 3;
      if (this.counter >= 1) {
        this.fireworks.push(new Firework(
          random(this.spawnA, this.spawnB),
          this.height,
          random(0, this.width),
          random(this.spawnC, this.spawnD),
          random(0, 360),
          random(30, 110)));
        this.counter = 0;
      }
      if (this.fireworks.length > 1000) this.fireworks = this.fireworks.filter(firework => !firework.dead);
    }
  }
  
  // Helper functions
  const PI2 = Math.PI * 2;
  const random = (min, max) => Math.random() * (max - min + 1) + min | 0;
  const timestamp = _ => new Date().getTime();
  
  // Initialization
  let canvas = document.getElementById('fireworksCanvas'),
      ctx = canvas.getContext('2d'),
      eventDisplay = new EventDisplay();
  
  window.onresize = () => eventDisplay.resize();
  document.onclick = evt => eventDisplay.onClick(evt);
  document.ontouchstart = evt => eventDisplay.onClick(evt);
  
  let then = timestamp();
  (function loop(){
    requestAnimationFrame(loop);
    let now = timestamp(),
        delta = now - then;
    then = now;
    eventDisplay.update(delta / 1000);
  }());
  