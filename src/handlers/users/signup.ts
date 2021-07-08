import { ServerResponse } from '../../lib/server-response';
import bcrypt from 'bcryptjs';
import { createUser } from '../../dynamo/users';
import { makeHandler } from '../../lib/make-handler';
import { expectBody } from '../../lib/handler-validators/expect-body';
import { expectEnv } from '../../lib/handler-validators/require-env';
import { expectHTTPMethod } from '../../lib/handler-validators/expect-http-methods';
import { validateBody } from '../../lib/handler-validators/validate-body';
import v8n from 'v8n';

export const signup = makeHandler()
	.use(expectEnv('SIGNUP_SECRET'))
	.use(expectEnv('JWT_SECRET'))
	.use(expectEnv('DYNAMODB_USERS_TABLE'))
	.use(expectHTTPMethod('POST'))
	.use(expectBody())
	.use(
		validateBody<{ email: string; password: string; secret: string }>(
			v8n().schema({
				email: v8n().string().not.empty(),
				password: v8n().string().not.empty(),
				secret: v8n().string().not.empty(),
			}),
		),
	)
	.asGatewayHandler(async middlewareData => {
		const body = middlewareData.body;

		const hashedPassword = bcrypt.hashSync(body.password, 10);
		try {
			await createUser(body.email, hashedPassword, middlewareData.DYNAMODB_USERS_TABLE);
		} catch (e) {
			console.error(e);
			return ServerResponse.internalError();
		}

		return ServerResponse.success(undefined, 'Usuário criado com sucesso');
	});
