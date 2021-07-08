import aws from 'aws-sdk';
import { User } from '../models/user';

export async function createUser(email: string, hashedPassword: string, usersTableName: string) {
	const docClient = new aws.DynamoDB.DocumentClient();
	const Item: User = {
		email: email,
		password: hashedPassword,
		creationDate: Date.now(),
	};

	await docClient.put({ TableName: usersTableName, Item }).promise();

	return Item;
}

export async function getUser(email: string, usersTableName: string) {
	const docClient = new aws.DynamoDB.DocumentClient();
	const result = await docClient.get({ TableName: usersTableName, Key: { email } }).promise();
	if (!result.Item) {
		return null;
	}

	return result.Item as unknown as User;
}
