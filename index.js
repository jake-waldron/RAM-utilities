const Client = require('@notionhq/client').Client;
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_SECRET });

const databaseId = process.env.NOTION_DB;

const text = process.argv[2];

console.log(databaseId);

async function addItem(text) {
	try {
		const response = await notion.pages.create({
			parent: { database_id: databaseId },
			properties: {
				title: {
					title: [
						{
							text: {
								content: text,
							},
						},
					],
				},
			},
		});
		console.log(response);
		console.log('Success! Entry added.');
	} catch (error) {
		console.error(error.body);
	}
}

addItem(text);
