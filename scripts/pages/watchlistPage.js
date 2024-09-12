console.log('3 Lwd Watchlist');

function renderWatchlistPage() {
	// galeryPage = document.querySelector(`page[href='lwd']`);
	watchlistPage = document.querySelector("page[href='lwd/watchlist']");
	watchlistPage.innerHTML = '';

	watchlistPage.append(renderWatchlistsHeader());

	fetchingWatchlist.then(() => {
		console.log('watchlists', watchlists);
		watchlistPage.append(renderWatchlistsGalery(watchlists));
	});
	// imageId = LwdRouter.getHashParams('imageId');
	// if (LwdRouter.getHashParams('imageId')) {
	// 	document.querySelector(`page[href='lwd'] #image-id-${imageId}`).click();
	// }
}

function renderWatchlistsHeader() {
	watchlistsHeader = document.createElement('div');
	watchlistsHeader.id = 'watchlists-header';

	watchlistCreationModal = new LwdModal();
	watchlistsHeader.append(watchlistCreationModal);
	watchlistCreationModal.id = 'watchlist-creation-modal';

	createBtn = renderSVG('add', {
		onclick: () => watchlistCreationModal.open(),
		styles: { width: '30px' },
	});
	watchlistsHeader.append(createBtn);

	watchlistCreationForm = renderWatchlistCreationForm();
	watchlistCreationModal.append(watchlistCreationForm);

	fetchBtn = new LwdTile();
	watchlistsHeader.append(fetchBtn);
	fetchBtn.append(new LwdSvg('globe'));

	return watchlistsHeader;
}

function renderWatchlistsGalery(watchlists) {
	items = watchlists.map((watchlist) => ({
		...watchlist,
		id: `watchlist-${watchlist._id}`,
		info: watchlist.name,
		thumb: watchlist.cover,
		// onclick: async () => {
		// 	console.log('renderWatchlistsGalery on click', watchlist);
		// 	watchlistPage.innerHTML = '';
		// 	watchlistPage.append(await renderWatchlistImages(watchlist));
		// },
	}));
	watchlistsGalery = new LwdGalery(items, {});
	watchlistsGalery.focusContainer.innerHTML = '';
	watchlistsGalery.set('focusItem', () => async (watchlist) => {
		watchlistsGalery.focusContainer.hidden = false;
		watchlistsGalery.focusContainer.append(
			await renderWatchlistImages(watchlist)
		);
	});
	return watchlistsGalery;
}

// function renderWatchlistsList(watchlists) {
// 	watchlistsList = document.createElement('div');
// 	watchlistsList.id = 'watchlists-list';

// 	watchlists.forEach((watchlist) => {
// 		watchlistId = watchlist._id;

// 		imgA = document.createElement('a');
// 		watchlistsList.append(imgA);
// 		// imgA.href = `https://exhentai.org/?id=${imageId}&f_search=%`;

// 		img = document.createElement('img');
// 		imgA.append(img);
// 		img.id = 'watchlist-' + watchlistId;
// 		img.dataset.watchlistId = watchlistId;
// 		img.src = watchlist.cover;
// 		img.onclick = (event) => {
// 			event.preventDefault();
// 			hashParams.set('watchlistId', event.target.dataset.watchlistId);
// 			renderWatchlistImages(event.target.dataset.watchlistId);
// 		};
// 	});

// 	return watchlistsList;
// }

function renderWatchlistCreationForm() {
	let form = new LwdForm({ id: 'watchlist-creation-form' });

	form.append(new LwdLabel({ textContent: 'Name:' }));
	form.append(new LwdInput({ name: 'name', placeholder: 'Lana' }));

	form.append(new LwdLabel({ textContent: 'Cover:' }));
	form.append(new LwdInput({ name: 'cover', placeholder: 'Image src url' }));

	let act = autocompleteTags;
	form.append(new LwdLabel({ textContent: 'Search BooruAll:' }));
	form.append(new LwdAutocomplete(act, { name: 'search[BooruAll]' }));

	form.append(new LwdLabel({ textContent: 'Search Danbooru:' }));
	form.append(new LwdAutocomplete(act, { name: 'search[Danbooru]' }));

	form.append(new LwdLabel({ textContent: 'Search E621:' }));
	form.append(new LwdAutocomplete(act, { name: 'search[E621]' }));

	form.append(new LwdLabel({ textContent: 'Search Gelbooru:' }));
	form.append(new LwdAutocomplete(act, { name: 'search[Gelbooru]' }));

	form.append(new LwdLabel({ textContent: 'Search Rule34xxx:' }));
	form.append(new LwdAutocomplete(act, { name: 'search[Rule34xxx]' }));

	form.append(new LwdLabel({ textContent: 'Auto fetch:' }));
	form.append(new LwdInput({ name: 'autoFetch', type: 'checkbox' }));

	categoryOptions = Object.keys(categoriesOrder).map((categoryName) => ({
		textContent: categoryName,
		value: categoryName,
	}));
	form.append(new LwdLabel({ textContent: 'Category' }));
	form.append(new LwdSelect(categoryOptions, { name: 'category' }));

	form.append(new LwdInput({ name: 'unseenCount', value: '??', hidden: true }));

	formSubmit = document.createElement('div');
	form.append(formSubmit);
	formSubmit.id = 'watchlist-creation-submit';
	formSubmit.textContent = 'Create Watchlist';
	formSubmit.onclick = (event) => {
		window.watchlistForm = form.getFormData();
		createAPI('watchlist', [form.getFormData()]).then(() => {
			// todo clear inputs
			document.querySelector('#watchlist-creation-modal').close();
		});
	};

	return form;
}

async function fetchImagesFromAllSources(watchlist) {
	// watchlist = watchlists.find(({ _id }) => watchlistId == _id);
	console.log('fetchImagesFromAllSources', watchlist);

	watchlistImages = [];

	externalApiUrl = {
		BooruAll: 'https://booru.allthefallen.moe/posts.json?limit=200&tags=',
		Danbooru: 'https://danbooru.donmai.us/posts.json?limit=200&tags=',
		E621: 'https://e621.net/posts.json?limit=320&tags=',
		Rule34xxx:
			'https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&limit=600&tags=',
		// Gelbooru:
		// 	'https://gelbooru.com/index.php?page=dapi&s=post&q=index&json=1&limimt=100&tags=',
	};

	fetchAll = Promise.all(
		Object.entries(externalApiUrl).map(([domain, apiUrl]) => {
			return fetch(apiUrl + watchlist.search)
				.then((response) => response.json())
				.then((response) =>
					watchlistImages.push(extractImageData(response, domain))
				)
				.catch(() => console.log('cant fetch from', domain));
		})
	);

	// backBtn =renderTileBtn({onclick: ()=> {

	// }})
	// images.flat().map(appendImage);

	watchlistImageList = document.createElement('div');
	watchlistImageList.id = 'watchlist-images';

	await fetchAll;
}

async function renderWatchlistImages(watchlist) {
	// watchlist = watchlists.find(({ _id }) => watchlistId == _id);
	console.log('renderWatchlistImages', watchlist);

	watchlistImages = [];

	externalApiUrl = {
		BooruAll: 'https://booru.allthefallen.moe/posts.json?limit=200&tags=',
		Danbooru: 'https://danbooru.donmai.us/posts.json?limit=200&tags=',
		E621: 'https://e621.net/posts.json?limit=320&tags=',
		Rule34xxx:
			'https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&limit=600&tags=',
		// Gelbooru:
		// 	'https://gelbooru.com/index.php?page=dapi&s=post&q=index&json=1&limimt=100&tags=',
	};

	fetchAll = Promise.all(
		Object.entries(externalApiUrl).map(([domain, apiUrl]) => {
			return fetch(apiUrl + watchlist.search[domain])
				.then((response) => response.json())
				.then((response) =>
					watchlistImages.push(extractImageData(response, domain))
				)
				.catch(() => console.log('cant fetch from', domain));
		})
	);

	// backBtn =renderTileBtn({onclick: ()=> {

	// }})
	// images.flat().map(appendImage);

	watchlistImageList = document.createElement('div');
	watchlistImageList.id = 'watchlist-images';

	await fetchAll;

	console.log('done waiting', fetchAll, watchlistImages);

	items = watchlistImages.flat().map((watchlistImage) => ({
		id: `watchlist-image-${watchlistImage.id}`,
		href: watchlistImage.href,
		info: watchlist.domain,
		thumb: watchlistImage.src,
		onclick: () => {},
	}));
	return new LwdGalery(items, {});
}

function extractImageData(response, domain) {
	if (domain == 'BooruAll') {
		return response.map((image) => ({
			id: image.id,
			src: image.file_url,
			tags: image.tag_string.split(' '),
			domain,
			href: `https://booru.allthefallen.moe/posts/${image.id}`,
			source: image.source,
		}));
	} else if (domain == 'Danbooru') {
		return response
			.filter((image) => image?.media_asset?.variants?.length > 0)
			.map((image) => ({
				id: image.id,
				src: image.file_url,
				tags: image.tag_string.split(' '),
				domain,
				href: `https://danbooru.donmai.us/posts/${image.id}`,
				source: image.source,
			}));
	} else if (domain == 'E621') {
		return response.map((image) => ({
				id: image.id,
				src: image.sample.url,
				tags: Object.values(image.tags).flat(),
				domain,
				href: `https://e621.net/posts/${image.id}`,
				source: image.sources,
			}));
	} else if (domain == 'Gelbooru') {
		return response.post.map((image) => ({
			id: image.id,
			src: image.sample_url || image.file_url,
			tags: image.tags.split(' '),
			domain,
			href: `https://gelbooru.com/index.php?page=post&s=view&id=${image.id}`,
			source: image.source,
		}));
	} else if (domain == 'Rule34xxx') {
		return response.map((image) => ({
			id: image.id,
			src: image.sample_url,
			tags: image.tags.split(' '),
			domain,
			href: `https://rule34.xxx/index.php?page=post&s=view&id=${image.id}`,
			source: image.source,
		}));
	}
}
