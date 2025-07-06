type Response<T> = ResponseSuccess<T> & ResponseError;
type ResponseSuccess<T> = {
  data: T;
  statusCode: number;
};

type ResponseError = {
  error: string;
  statusCode: number;
  message: string;
};

export type { Response };
