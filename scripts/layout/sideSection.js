
function createSideSection() {
	sideSection = document.createElement('section');
	document.body.append(sideSection);
	sideSection.id = 'side-section';
	sideSection.className = 'explandable';
	sideSection.onmouseenter = () => {
		document.querySelector('#top-section').classList.add('expanded');
		document.querySelector('#side-section').classList.add('expanded');
	};
	sideSection.onmouseleave = () => {
		document.querySelector('#top-section').classList.remove('expanded');
		document.querySelector('#side-section').classList.remove('expanded');
	};

	sideSectionPinBtn = new LwdContainer({ id: 'side-section-pin' });
	sideSection.append(sideSectionPinBtn);
	sideSectionPinBtn.onclick = () => {
		document.querySelector('#top-section').classList.toggle('pinned');
		document.querySelector('#side-section').classList.toggle('pinned');
	};

	sideSectionContent = document.createElement('aside');
	sideSection.append(sideSectionContent);
	sideSectionContent.id = 'side-section-content';

	// sideSectionContent.append(renderGaleryPageActionsStructure());
	// sideSectionContent.append(renderLwdImageDataStructure());
	// sideSectionContent.append(renderTagListStructure());

	return sideSection;
}