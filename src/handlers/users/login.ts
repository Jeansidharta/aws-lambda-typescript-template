import { ServerResponse } from '../../lib/server-response';
import bcrypt from 'bcryptjs';
import { getUser } from '../../dynamo/users';
import { makeHandler } from '../../lib/make-handler';
import { expectBody } from '../../lib/handler-validators/expect-body';
import { expectEnv } from '../../lib/handler-validators/require-env';
import { expectHTTPMethod } from '../../lib/handler-validators/expect-http-methods';
import { HTTPStatusCode } from '../../lib/server-response/status-codes';
import { User } from '../../models/user';
import { generateJWT } from '../../lib/jwt';
import { validateBody } from '../../lib/handler-validators/validate-body';
import v8n from 'v8n';

export const login = makeHandler()
	.use(expectEnv('JWT_SECRET'))
	.use(expectEnv('DYNAMODB_USERS_TABLE'))
	.use(expectHTTPMethod('POST'))
	.use(expectBody())
	.use(
		validateBody<{ email: string; password: string; secret: string }>(
			v8n().schema({
				email: v8n().string().not.empty(),
				password: v8n().string().not.empty(),
			}),
		),
	)
	.asGatewayHandler(async middlewareData => {
		const body = middlewareData.body;

		let user: User | null;
		try {
			user = await getUser(body.email, middlewareData.DYNAMODB_USERS_TABLE);
		} catch (e) {
			console.error(e);
			return ServerResponse.internalError();
		}

		if (!user) {
			return ServerResponse.error(
				HTTPStatusCode.CLIENT_ERROR.C403_FORBIDDEN,
				'Usuário ou senha incorretos',
			);
		}

		if (!bcrypt.compareSync(body.password, user.password)) {
			return ServerResponse.error(
				HTTPStatusCode.CLIENT_ERROR.C403_FORBIDDEN,
				'Usuário ou senha incorretos',
			);
		}

		const token = generateJWT({ email: body.email }, middlewareData.JWT_SECRET);

		const response = ServerResponse.success(
			{ token, user: { ...user, password: null } },
			'Login bem sucedido',
		);
		response.headers['Authorization'] = token;
		return response;
	});
