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

	const submitBtn = document.getElementById('submit');

	if (submitBtn) {
		submitBtn.addEventListener('click', submit);
	}

	const submitNowBtn = document.getElementById('submit-now');

	if (submitNowBtn) {
		selects(submitNowBtn);
	}
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

function submit() {
	const firstName = document.getElementById('firstName').value;
	const lastName = document.getElementById('lastName').value;
	const email = document.getElementById('email').value;
	const phoneNumber = document.getElementById('phoneNumber').value;
	const subject = document.getElementById('subject').value;
	const message = document.getElementById('message').value;
	const _honey = document.getElementById('_honey').value;

	if (!firstName || !lastName || !email || !subject || !message) return;

	let status = document.getElementById('status');

	if (
		!email.match(
			/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
		)
	) {
		status.textContent = 'Invalid email';

		status.classList.add('text-red-500');

		return;
	}

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
			name: `${titleCase(firstName)} ${titleCase(lastName)}`,
			'Phone Number': phoneNumber,
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

function selects(button) {
	const destination = new SlimSelect({
		select: '#destination',
		showSearch: false,
		hideSelectedOption: true,
		placeholder: 'Study Destination',
	});

	const universities = new SlimSelect({
		select: '#universities',
		closeOnSelect: false,
		allowDeselectOption: true,
		limit: 5,
		placeholder: 'Universities (max: 5)',
	});

	const programme = new SlimSelect({
		select: '#programme',
		showSearch: false,
		hideSelectedOption: true,
		placeholder: 'Programme',
	});

	const pathway = new SlimSelect({
		select: '#pathway',
		showSearch: false,
		hideSelectedOption: true,
		placeholder: 'Pathway',
	});

	const intake = new SlimSelect({
		select: '#intake',
		showSearch: false,
		hideSelectedOption: true,
		placeholder: 'Intake',
	});

	button.addEventListener('click', () => {
		submitApplyNow(destination, universities, programme, pathway, intake);
	});
}

function submitApplyNow(destination, universities, programme, pathway, intake) {
	const firstName = document.getElementById('firstName').value;
	const lastName = document.getElementById('lastName').value;
	const phoneNumber = document.getElementById('phoneNumber').value;
	const birth = document.getElementById('birth').value;
	const gender = document.getElementById('gender').value;
	const nationality = document.getElementById('nationality').value;
	const country = document.getElementById('country').value;
	const email = document.getElementById('email').value;
	const info = document.getElementById('info').value;
	const destinationSelect = document.getElementById('destination').value;
	const universitiesSelect = document.getElementById('universities').value;
	const programmeSelect = document.getElementById('programme').value;
	const pathwaySelect = document.getElementById('pathway').value;
	const intakeSelect = document.getElementById('intake').value;
	const gdpr = document.getElementById('gdpr').checked;
	const _honey = document.getElementById('_honey').value;

	if (
		!firstName ||
		!lastName ||
		!phoneNumber ||
		!email ||
		!birth ||
		!gender ||
		!nationality ||
		!country ||
		!destinationSelect ||
		!universitiesSelect ||
		!programmeSelect ||
		!pathwaySelect ||
		!intakeSelect ||
		!gdpr
	)
		return;

	let status = document.getElementById('status');

	if (
		!email.match(
			/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
		)
	) {
		status.textContent = 'Invalid email';

		status.classList.add('text-red-500');

		return;
	}

	status.textContent = 'Submitting, please stand by...';

	fetch(`https://formsubmit.co/ajax/admissions@worldclassacademia.com`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: JSON.stringify({
			_subject: `Admission Request (${titleCase(firstName)} ${titleCase(lastName)})`,
			'Full Name': `${titleCase(firstName)} ${titleCase(lastName)}`,
			'Phone Number': phoneNumber,
			'Birth Date': birth,
			Gender: titleCase(gender),
			Nationality: titleCase(nationality),
			Country: titleCase(country),
			Email: email,
			'Additional Info': info,
			'Study Destination': destination.selected(),
			Universities: universities.selected(),
			Programme: programme.selected(),
			Pathway: pathway.selected(),
			Intake: intake.selected(),
			GDPR: gdpr ? 'Accepted' : 'Declined',
			_honey,
			_captcha: false,
			_replyto: email,
			_template: 'box',
		}),
	})
		.then(res => res.json())
		.then(data => {
			if (data.success === 'false') throw 'Failed';

			status.textContent = 'Submitted successfully. Thank you!';
			status.classList.add('text-green-500');
			document.getElementById(document.forms[0].id).reset();
			destination.set();
			universities.set([]);
			programme.set();
			pathway.set();
			intake.set();
		})
		.catch(() => {
			status.textContent = 'An error occurred while trying to submit. Please try again later.';
			status.classList.add('text-red-500');
		});
}

function titleCase(str) {
	return str.replace(/\w\S*/g, txt => {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
}
