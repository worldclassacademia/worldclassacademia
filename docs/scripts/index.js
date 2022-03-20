function init() {
	slider();

	const videos = document.getElementsByTagName('video');

	if (videos) {
		for (const video of videos) {
			if (video.id !== 'main-video') video.volume = 0.2;
			else video.volume = 0;
		}
	}

	const mobileToggle = document.getElementById('mobile-toggle');
	const mobileNav = document.getElementById('navbar-items-mobile');

	mobileToggle.addEventListener('click', () => {
		mobileNav.classList.remove('hidden');
	});

	document.addEventListener('click', evt => {
		let targetElement = evt.target.localName === 'path' ? evt.target.parentElement : evt.target;

		do {
			if (targetElement == mobileNav) {
				return;
			}
			targetElement = targetElement.parentNode;
		} while (targetElement);

		if (!mobileNav.classList.contains('hidden') && evt.target.id !== 'menu' && evt.target.parentElement.id !== 'menu') {
			mobileNav.classList.add('hidden');
		}
	});

	const prepareImg = document.getElementById('prepare-img');
	const prepImgs = ['prepare-m.png', 'prepare-f.png', 'prepare-f2.jpeg', 'prepare-multiple.jpeg'];

	if (prepareImg) {
		prepareImg.src = `./assets/images/${prepImgs[Math.floor(Math.random() * prepImgs.length)]}`;
	}

	const applyImg = document.getElementById('apply-img');
	const applyImgs = ['apply.png', 'apply-2.png'];

	if (applyImg) {
		applyImg.src = `./assets/images/${applyImgs[Math.floor(Math.random() * applyImgs.length)]}`;
	}

	if (document.forms.length === 0) return;

	document.getElementById('submit').addEventListener('click', submit);
}

window.onload = function () {
	init();
};

function slider() {
	// const slides = document.querySelectorAll('.slide');
	let slider = document.querySelector('.slider');

	if (!slider) return;

	let last = slider.lastElementChild;
	let first = slider.firstElementChild;
	// const btn = document.querySelectorAll('.btn');

	slider.insertBefore(last, first);

	// btn.forEach(btn => {
	// 	btn.addEventListener('click', movement);
	// });

	setInterval(function () {
		movement({ target: { id: 'next' } });
	}, 5000);

	function movement(e) {
		slider = document.querySelector('.slider');
		last = slider.lastElementChild;
		first = slider.firstElementChild;

		const activeSlide = document.querySelector('.active');

		if (e.target.id === 'next') {
			slider.insertBefore(first, last.nextSibling);

			activeSlide.classList.remove('active');
			activeSlide.nextElementSibling.classList.add('active');
		} else {
			slider.insertBefore(last, first);
			activeSlide.classList.remove('active');
			activeSlide.previousElementSibling.classList.add('active');
		}
	}
}

function submit(e) {
	const firstName = document.getElementById('firstName').value;
	const lastName = document.getElementById('lastName').value;
	const email = document.getElementById('email').value;
	const subject = document.getElementById('subject').value;
	const message = document.getElementById('message').value;
	const _honey = document.getElementById('_honey').value;

	if (!firstName || !lastName || !email || !subject || !message) return;

	if (
		!email.match(
			/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
		)
	)
		return;

	let status = document.getElementById('status');

	status.textContent = 'Submitting, please stand by...';

	fetch(`https://formsubmit.co/ajax/info@worldclassacademia.com`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: JSON.stringify({
			subject,
			_subject: `${subject}`,
			_honey,
			_captcha: false,
			_replyto: email,
			_template: 'box',
			name: `${firstName} ${lastName}`,
			email,
			message,
		}),
	})
		.then(res => res.json())
		.then(data => {
			if (data.success === 'false') throw 'Failed';

			status.textContent = 'Submitted successfully. Thank you!';
			status.classList.add('text-green-500');
			document.getElementById(document.forms[0].id).reset();
		})
		.catch(() => {
			status.textContent = 'An error occurred while trying to submit. Please try again later.';
			status.classList.add('text-red-500');
		});
}
