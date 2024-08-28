console.log('syncTags');

async function syncTags() {
	if (localStorage.getItem('syncingTags')) {
    window.snackbar.fire('Already syncing tags', 'warning');
		return;
	}
	localStorage.setItem('syncingTags', true);
	window.snackbar.fire('Started syncing tags', 'success');

	tagsAddedOrRemoved = await fetchTagsAddedOrRemoved();
	// tagsAddedOrRemoved = await fetchToRebuildAllTags();
	await mapWithTimeOut(tagsAddedOrRemoved, ([tagName, countChange]) => {
		tagFound = allTags.find((existingTag) => tagName == existingTag.name);

		if (tagFound) return updateTag(tagFound, countChange);

		console.log(tagName, 'doesnt exist yet');
		return fetchExternalCategory(tagName)
			.then((category) => {
				console.log(tagName, 'category', category);
				return createTag(tagName, category, countChange);
			})
			.catch((e) => {
				console.warn(e);
				// appendLog(e);
				return createTag(tagName, 'unknown', countChange);
			});
	});

	console.log('after mapWithTimeOut');

	localStorage.setItem('allTags', JSON.stringify(allTags));
	await removeAddedAndRemovedTags();

	localStorage.removeItem('syncingTags');
	window.snackbar.fire('Done syncing tags', 'success');
}

categoriesE621net = [
	'general',
	'artist',
	'',
	'copyright',
	'character',
	'species',
	'invalid',
	'meta',
	'lore',
];
categoriesDanbooruUs = [
	'general',
	'artist',
	'',
	'copyright',
	'character',
	'meta',
];

async function fetchTagsAddedOrRemoved() {
	images = await Mongo.find('images', {
		filter: {
			$or: [
				{ addedTags: { $exists: true } },
				{ removedTags: { $exists: true } },
				{ delete: true },
			],
		},
	}).then(({ documents }) => documents);

	newTagsChanges = images
		.filter((image) => !image.delete)
		.map((image) => image.addedTags)
		.flat()
		.filter((tag) => typeof tag == 'string')
		.reduce((acc, tagName) => {
			acc[tagName] |= 0;
			acc[tagName] += 1;
			return acc;
		}, {});

	images
		.filter((image) => !image.delete)
		.map((image) => image.removedTags)
		.flat()
		.filter((tag) => typeof tag == 'string')
		.map((tagName) => {
			newTagsChanges[tagName] |= 0;
			newTagsChanges[tagName] -= 1;
		});

	images
		.filter((image) => image.delete)
		.map((image) => image.tags)
		.flat()
		.filter((tag) => typeof tag == 'string')
		.map((tagName) => {
			newTagsChanges[tagName] |= 0;
			newTagsChanges[tagName] -= 1;
		});

	return Object.entries(newTagsChanges);
}

async function fetchToRebuildAllTags() {
	allTags = [];

	images = await Mongo.find('images', {}).then(({ documents }) => documents);

	newTagsChanges = images
		.filter((image) => !image.delete)
		.map((image) => image.tags)
		.flat()
		.filter((tag) => typeof tag == 'string')
		.reduce((acc, tagName) => {
			acc[tagName] |= 0;
			acc[tagName] += 1;
			return acc;
		}, {});
	return Object.entries(newTagsChanges);
}

async function mapWithTimeOut(array, callback) {
	return Promise.all(
		array.map(
			(item, index) =>
				new Promise((resolve) =>
					setTimeout(async function () {
						return await resolve(await callback(item));
					}, index * 2000)
				)
		)
	);
}
async function fetchExternalCategory(tagName) {
	e621TagData = await e621FetchTagData(tagName);
	if (e621TagData) return e621TagData;

	danbooruTagData = await danbooruFetchTagData(tagName);
	if (danbooruTagData) return danbooruTagData;

	throw `NOT FOUND: ${tagName}`;
}

function e621FetchTagData(tagName) {
	return fetch(`https://e621.net/tags.json?search[name_matches]=` + tagName)
		.then((response) => response.json())
		.then((response) => {
			console.log('e621FetchTagData', tagName, response[0]?.category);
			return categoriesE621net[response[0]?.category];
		});
}

async function danbooruFetchTagData(tagName) {
	return fetch(
		`https://danbooru.donmai.us/tags.json?search[name_matches]=` + tagName
	)
		.then((response) => response.json())
		.then((response) => {
			console.log('danbooruFetchTagData', tagName, response[0]?.category);
			return categoriesDanbooruUs[response[0]?.category];
		});
}

function updateTag(tagFound, count) {
	return Mongo.update(
		'tags',
		{ name: { $eq: tagFound.name } },
		{ $inc: { count } }
	).then(() => (tagFound.count += count));
}

function createTag(name, category, count) {
	return Mongo.insert('tags', [{ name, category, count }]).then((data) =>
		allTags.push({ name, category, count })
	);
}

async function removeAddedAndRemovedTags() {
	Mongo.delete('images', { delete: true }).catch(() =>
		console.warn(new Date().toJSON() + ': No image marked for deletion')
	);

	Mongo.update(
		'images',
		{
			$or: [
				{ addedTags: { $exists: true } },
				{ removedTags: { $exists: true } },
			],
		},
		{ $unset: { addedTags: '', removedTags: '' } }
	)
		.then(() => console.log('clean up done'))
		.catch(() => {
			console.warn(
				new Date().toJSON() + ':No image with addedTags or removedTags'
			);
		});
}
