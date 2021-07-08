import { APIGatewayProxyEvent } from 'aws-lambda';
import { ServerResponse } from '../../lib/server-response';

export type Middleware<RequiredData, ResultData> = (
	middlewareData: RequiredData & ResultData,
	event: APIGatewayProxyEvent,
) => ServerResponse | Promise<ServerResponse | null> | null;
