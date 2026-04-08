/**
 * @param {string} csvText 
 * @returns {{ urls: string[], errors: string[] }}
 */
export function parseEndpointCsv(csvText) {
	const urls = [];
	const errors = [];
	
	const lines = csvText.split(/\r?\n/);
	let isHeader = true;

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trim();
		if (!line) continue;

		if (isHeader && line.toLowerCase().includes('url')) {
			isHeader = false;
			continue;
		}
		isHeader = false;

		const columns = line.split(',');
		const potentialUrl = columns[0].trim();

		if (potentialUrl.startsWith('http://') || potentialUrl.startsWith('https://')) {
			urls.push(potentialUrl);
		} else {
			errors.push(`Row ${i + 1}: Invalid URL format "${potentialUrl}"`);
		}
	}

	return { urls, errors };
}
