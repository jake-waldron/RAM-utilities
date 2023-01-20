const Client = require('@notionhq/client').Client;
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_SECRET });

const databaseId = process.env.NOTION_DB;

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

// uses forEach because there could be multiple entries for the same product (ex. one with and without a note)
async function checkOffProducts(products) {
	products.forEach(async (product) => {
		const page_id = product.id;
		const response = await notion.pages.update({
			page_id: page_id,
			properties: {
				'Added?': {
					checkbox: true,
				},
			},
		});
	});
}

// find item in database and update added checkbox to true if it exists
// query returns an array of results, usually only one, but could be more than one if there are multiple entries for the same product
async function findItem(text) {
	const response = await notion.databases.query({
		database_id: databaseId,
		filter: {
			property: 'Product',
			title: {
				contains: text,
			},
		},
	});
	if (response.results.length > 0) {
		checkOffProducts(response.results);
	}
}

exports.handler = async (event) => {
	const { products } = JSON.parse(event.body);

	if (!products || products.length === 0) {
		return sendResponse(400, { message: 'No products provided' });
	}
	try {
		for (const product of products) {
			await findItem(product);
		}
		return sendResponse(200, { message: `List updated` });
	} catch (error) {
		return sendResponse(400, { error });
	}
};
