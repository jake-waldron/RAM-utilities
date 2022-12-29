const Client = require('@notionhq/client').Client;

const notion = new Client({ auth: process.env.NOTION_SECRET });

const databaseId = process.env.NOTION_DB;

async function addProduct(product, addedBy, note = '') {
	const res = await notion.pages.create({
		parent: { database_id: databaseId },
		properties: {
			Product: {
				type: 'title',
				title: [
					{
						type: 'text',
						text: {
							content: product,
						},
					},
				],
			},
			Notes: {
				type: 'rich_text',
				rich_text: [
					{
						type: 'text',
						text: {
							content: note,
						},
					},
				],
			},
			Added_By: {
				type: 'multi_select',
				multi_select: [
					{
						name: addedBy,
					},
				],
			},
		},
	});
	return res;
}

function sendResponse(statusCode, message) {
	const response = {
		statusCode: statusCode,
		headers: {
			'Access-Control-Allow-Headers': 'Content-Type',
			'Access-Control-Allow-Origin': 'https://amp.reynoldsam.com',
			'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
		},
		body: JSON.stringify(message),
	};
	return response;
}

exports.handler = async (event) => {
	const body = JSON.parse(event.body);

	const product = body.product;
	const note = body.note;
	const addedBy = body.addedBy;

	if (!product || product.trim() === '') {
		return sendResponse(400, { message: 'No product provided' });
	}

	try {
		// check to see if it's already in the list
		const notionQueryResponse = await notion.databases.query({
			database_id: databaseId,
			filter: {
				and: [
					{
						property: 'Product',
						title: {
							contains: product,
						},
					},
					{
						property: 'Added?',
						checkbox: {
							equals: false,
						},
					},
				],
			},
		});
		// if note, add product to database with note, whether it's already in there or not
		if (note !== undefined) {
			await addProduct(product, addedBy, note);
			return sendResponse(200, { message: 'Added to list' });
		}

		// if it's already in the list, return a 406
		// if it's not in the list, add it and return a 200

		if (notionQueryResponse.results.length > 0) {
			return sendResponse(200, { message: 'Already in list' });
		}
		if (notionQueryResponse.results.length === 0) {
			await addProduct(product, addedBy);
			return sendResponse(200, { message: 'Added to list' });
		}
	} catch (error) {
		return sendResponse(400, { message: 'Error adding product', error });
	}
};
