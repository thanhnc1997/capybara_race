const template = document.body;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i --) {
		let j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	
	return array;
}

function countdown(elem, seconds) {
  var that = {};

  that.elem = elem;
  that.seconds = seconds;
  that.totalTime = seconds * 100;
  that.usedTime = 0;
  that.startTime = +new Date();
  that.timer = null;

  that.count = function() {
    that.usedTime = Math.floor((+new Date() - that.startTime) / 10);

    var tt = that.totalTime - that.usedTime;
    if (tt <= 0) {
      that.elem.innerHTML = '00:00:00';
      clearInterval(that.timer);
    } 
		else {
      var mi = Math.floor(tt / (60 * 100));
      var ss = Math.floor((tt - mi * 60 * 100) / 100);
      var ms = tt - Math.floor(tt / 100) * 100;

      that.elem.innerHTML = that.fillZero(mi) + ":" + that.fillZero(ss) + ":" + that.fillZero(ms);
    }
  };
  
  that.init = function() {
    if(that.timer){
      clearInterval(that.timer);
      that.elem.innerHTML = '00:00.00';
      that.totalTime = seconds * 100;
      that.usedTime = 0;
      that.startTime = +new Date();
      that.timer = null;
    }
  };

  that.start = function() {
    if(!that.timer){
       that.timer = setInterval(that.count, 1);
    }
  };

  that.stop = function() {
    if (that.timer) clearInterval(that.timer);
  };

  that.fillZero = function(num) {
    return num < 10 ? '0' + num : num;
  };

  return that;
}

const app = {
	loadCapybaras() {
		for (let i in shuffle(students)) {
			let div = document.createElement('div');
			div.classList.add('capybara');
			div.innerHTML = `
			<span class="name">${students[i].name}</span>
			`;
			div.style.cssText = `top: ${i * 20}px;`;
			if (students[i].position) div.setAttribute('data-position', students[i].position);
			template.querySelector('main .list').appendChild(div);
		}
	},
	startRace() {
		template.querySelector('audio').play();
		let racers = template.querySelectorAll('.capybara');
		let count = 1;
		
		racers.forEach(racer => {
			let random = Math.random();
			let intervalMove = setInterval(() => {
				count ++;
				if (racer.getAttribute('data-position')) {
					if (racer.getAttribute('data-position') == 4) racer.style.left = `${1.2 * count}px`;
					if (racer.getAttribute('data-position') == 3) racer.style.left = `${1.4 * count}px`;
					if (racer.getAttribute('data-position') == 2) racer.style.left = `${1.5 * count}px`;
					if (racer.getAttribute('data-position') == 1) racer.style.left = `${1.6 * count}px`;
				}
				else {
					racer.style.left = `${random * count}px`;
				}
			}, 200);
			
			setTimeout(() => {+
				clearInterval(intervalMove);
			}, 10000);
		});
	},
	endRace() {
		let first, second, third, fourth;
		let finisher = [];
		
		for (let student of students) {
			if (student.position) {
				if (student.position == 1) first = student;
				if (student.position == 2) second = student;
				if (student.position == 3) third = student;
				if (student.position == 4) fourth = student;
			}
		}
		
		finisher.push(first, second, third, fourth);
		for (let i = 0; i < finisher.length; i ++) {
			let li = document.createElement('li');
			li.innerHTML = (i + 1) + `. ${finisher[i].name}`;
			template.querySelector('.modal ul').appendChild(li);
		}
		
		template.querySelector('.modal').style.display = 'block';
	},
	init() {
		this.loadCapybaras();
		template.querySelector('#start').addEventListener('click', e => {
			this.startRace();
			e.currentTarget.remove();
			let countClock = template.querySelector('.time');
			let clock = countdown(countClock, 11);
			clock.start();
			setTimeout(() => {
				this.endRace();
			}, 12000);
			
			setTimeout(() => {
				template.querySelector('audio').remove();
			}, 16000);
		});
		
		template.querySelector('.modal button').addEventListener('click', () => {
			location.reload();
		});
	}
};

app.init();