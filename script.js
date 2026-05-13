import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getDownloadURL, getStorage, ref } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyBc01ZpLDKeVdh6rWYHpNoYwL-TZ-CfEsU",
	authDomain: "portfolio-b7d4f.firebaseapp.com",
	projectId: "portfolio-b7d4f",
	storageBucket: "portfolio-b7d4f.firebasestorage.app",
	messagingSenderId: "28838974267",
	appId: "1:28838974267:web:b84ee0fc4f9efcb46e1d1e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const wireStorageVideoSource = async (sourceElement) => {
	const storagePathRaw = sourceElement.dataset.storagePath;
	if (!storagePathRaw) {
		return;
	}

	const storagePath = storagePathRaw.trim();

	try {
		const downloadUrl = await getDownloadURL(ref(storage, storagePath));
		sourceElement.src = downloadUrl;
		const video = sourceElement.closest('video');
		if (video) {
			video.load();
		}
	} catch (error) {
		console.error(`Failed to load storage video '${storagePath}':`, error);
		console.warn(`Falling back to existing src for ${storagePath}`);
	}
};

const wireStorageImage = async (imgElement) => {
	const storagePathRaw = imgElement.dataset.storagePath;
	if (!storagePathRaw) {
		return;
	}

	const storagePath = storagePathRaw.trim();

	try {
		const downloadUrl = await getDownloadURL(ref(storage, storagePath));
		imgElement.src = downloadUrl;
	} catch (error) {
		console.error(`Failed to load storage image '${storagePath}':`, error);
		console.warn(`Falling back to existing src for ${storagePath}`);
	}
};

const storageVideoSources = document.querySelectorAll('source[data-storage-path]');
storageVideoSources.forEach(sourceElement => {
	void wireStorageVideoSource(sourceElement);
});

const storageImages = document.querySelectorAll('img[data-storage-path]');
storageImages.forEach(imgElement => {
	void wireStorageImage(imgElement);
});

(() => {
	const carousel = document.querySelector('[data-carousel]');
	if (!carousel) {
		return;
	}

	const track = carousel.querySelector('.carousel-track');
	const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
	const previousButton = carousel.querySelector('[data-carousel-prev]');
	const nextButton = carousel.querySelector('[data-carousel-next]');
	const dotsContainer = carousel.querySelector('[data-carousel-dots]');
	let activeIndex = 0;

	const renderDots = () => {
		dotsContainer.innerHTML = '';
		slides.forEach((_, index) => {
			const dot = document.createElement('button');
			dot.type = 'button';
			dot.className = 'carousel-dot';
			dot.setAttribute('aria-label', `Go to software ${index + 1}`);
			dot.addEventListener('click', () => {
				activeIndex = index;
				updateCarousel();
			});
			dotsContainer.appendChild(dot);
		});
	};

	const updateCarousel = () => {
		track.style.transform = `translateX(-${activeIndex * 100}%)`;
		Array.from(dotsContainer.children).forEach((dot, index) => {
			dot.classList.toggle('is-active', index === activeIndex);
		});
	};

	previousButton.addEventListener('click', () => {
		activeIndex = (activeIndex - 1 + slides.length) % slides.length;
		updateCarousel();
	});

	nextButton.addEventListener('click', () => {
		activeIndex = (activeIndex + 1) % slides.length;
		updateCarousel();
	});

	renderDots();
	updateCarousel();
	})();

(() => {
	const tree = document.getElementById('knowledge-tree');
	if (!tree) return;

	const items = Array.from(tree.querySelectorAll('.kt-item'));

	items.forEach(item => {
		const header = item.querySelector('.kt-header');
		const branches = item.querySelector('.kt-branches');

		const toggle = () => {
			const isOpen = item.classList.toggle('expanded');
			if (isOpen) {
				// close others
				items.forEach(other => { if (other !== item) { other.classList.remove('expanded'); } });
				// set max-height based on scrollHeight for smooth animation
				branches.style.maxHeight = branches.scrollHeight + 'px';
			} else {
				branches.style.maxHeight = '';
			}
		};

		header.addEventListener('click', toggle);
		header.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				toggle();
			}
		});
	});
})();
