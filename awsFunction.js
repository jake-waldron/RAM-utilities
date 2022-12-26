const Client = require('@notionhq/client').Client;

const notion = new Client({ auth: process.env.NOTION_SECRET });

const databaseId = process.env.NOTION_DB;

exports.handler = async (event) => {
	const body = JSON.parse(event.body);

	const product = body.product;
	const note = body.note;

	try {
		// if note, add product to database with note, whether it's already in there or not
		if (note !== undefined) {
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
				},
			});
			const response = {
				statusCode: 200,
				body: JSON.stringify({ message: 'Added to list!' }),
			};
			return response;
		}

		// if there isn't a note, check if product is already in list
		// if so, return message that it's already in list
		// if not, add it
		const res = await notion.databases.query({
			database_id: databaseId,
			filter: {
				and: [
					{
						property: 'Product',
						title: {
							equals: product,
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
		if (res.results.length > 0) {
			const response = {
				statusCode: 200,
				body: JSON.stringify({ message: 'Already in list!' }),
			};
			return response;
		}
		if (res.results.length === 0) {
			await notion.pages.create({
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
				},
			});
			const response = {
				statusCode: 200,
				body: JSON.stringify({ message: 'Added to list!' }),
			};
			return response;
		}
	} catch (error) {
		const response = {
			statusCode: 400,
			body: error,
		};
		return response;
	}
};
